import { convertMinorUnits, cryptoRatesInUsd } from "./countryConfigs";
import type {
  AttendanceRecord,
  CountryConfig,
  Employee,
  Expense,
  LeaveRequest,
  PayrollLineItem,
  PayrollPeriod,
  PayrollResult,
} from "./types";

export interface PayrollComputationOptions {
  attendance?: AttendanceRecord;
  expenses?: Expense[];
  leaveRequests?: LeaveRequest[];
}

type StrategyInput = {
  employee: Employee;
  period: PayrollPeriod;
  config: CountryConfig;
  options: PayrollComputationOptions;
};

type PayrollStrategy = (input: StrategyInput) => PayrollResult;

const periodsPerYearMap: Record<PayrollPeriod["payFrequency"], number> = {
  Monthly: 12,
  "Semi-Monthly": 24,
  "Bi-Weekly": 26,
  Weekly: 52,
};

const statutoryFormByCountry = {
  IN: "Form 16",
  US: "W-2",
  UK: "P60",
  DE: "Lohnsteuerbescheinigung",
  AE: "WPS Advice",
  SG: "IR8A",
  CA: "T4",
  AU: "Income Statement",
} as const;

const sumAmounts = (values: number[]) => values.reduce((sum, value) => sum + value, 0);

const scaleByRate = (amount: number, rate: number) => Math.round(amount * rate);

const getPeriodsPerYear = (payFrequency: PayrollPeriod["payFrequency"]) =>
  periodsPerYearMap[payFrequency] ?? 12;

const getApprovedUnpaidLeaveDays = (
  employeeId: string,
  leaveRequests: LeaveRequest[],
) =>
  leaveRequests
    .filter(
      (request) =>
        request.employeeId === employeeId &&
        request.status === "Approved" &&
        request.type.toUpperCase().includes("UNPAID"),
    )
    .reduce((sum, request) => sum + request.days, 0);

const getReimbursableExpenses = (employeeId: string, expenses: Expense[]) =>
  expenses.filter(
    (expense) =>
      expense.employeeId === employeeId &&
      (expense.status === "Approved" || expense.status === "Reimbursed") &&
      !expense.reimbursedInPayroll,
  );

const getTaxableAnnualMinorUnits = (
  grossAnnualMinorUnits: number,
  config: CountryConfig,
) => Math.max(0, grossAnnualMinorUnits - config.taxFreeAllowanceMinorUnits);

const computeProgressiveTaxAnnual = (
  taxableAnnualMinorUnits: number,
  config: CountryConfig,
) => {
  let previousLimit = 0;
  let totalTax = 0;

  for (const slab of config.taxSlabs) {
    const currentLimit = slab.upToMinorUnits ?? taxableAnnualMinorUnits;
    if (taxableAnnualMinorUnits <= previousLimit) {
      break;
    }

    const taxableSlice = Math.min(taxableAnnualMinorUnits, currentLimit) - previousLimit;
    if (taxableSlice > 0) {
      totalTax += scaleByRate(taxableSlice, slab.rate);
    }
    previousLimit = currentLimit;
  }

  return totalTax;
};

const computeTaxForPeriod = (
  grossPerPeriodMinorUnits: number,
  employee: Employee,
  period: PayrollPeriod,
  config: CountryConfig,
) => {
  if (config.payrollStrategy === "zero-tax") {
    return 0;
  }

  if (
    employee.employmentType === "Contractor" ||
    employee.employmentType === "Freelancer"
  ) {
    return scaleByRate(grossPerPeriodMinorUnits, config.contractorWithholdingRate);
  }

  const periodsPerYear = getPeriodsPerYear(period.payFrequency);
  const annualizedGross = grossPerPeriodMinorUnits * periodsPerYear;
  const taxableAnnualMinorUnits = getTaxableAnnualMinorUnits(annualizedGross, config);
  const annualTaxMinorUnits = computeProgressiveTaxAnnual(
    taxableAnnualMinorUnits,
    config,
  );

  return Math.round(annualTaxMinorUnits / periodsPerYear);
};

const computeSocialContributions = (
  grossPerPeriodMinorUnits: number,
  employee: Employee,
  config: CountryConfig,
) => {
  if (
    employee.employmentType === "Contractor" ||
    employee.employmentType === "Freelancer"
  ) {
    return { employee: {}, employer: {} };
  }

  return Object.entries(config.socialSecurity).reduce(
    (accumulator, [key, rule]) => {
      const thresholdBlocked =
        typeof rule.thresholdMinorUnits === "number" &&
        grossPerPeriodMinorUnits > rule.thresholdMinorUnits;

      if (thresholdBlocked) {
        accumulator.employee[key] = 0;
        accumulator.employer[key] = 0;
        return accumulator;
      }

      const rateableBase = Math.min(
        grossPerPeriodMinorUnits,
        rule.capMinorUnits ?? grossPerPeriodMinorUnits,
      );

      accumulator.employee[key] = scaleByRate(rateableBase, rule.employeeRate);
      accumulator.employer[key] = scaleByRate(rateableBase, rule.employerRate);
      return accumulator;
    },
    {
      employee: {} as Record<string, number>,
      employer: {} as Record<string, number>,
    },
  );
};

const computeMandatoryDeductions = (
  grossPerPeriodMinorUnits: number,
  employee: Employee,
  config: CountryConfig,
) =>
  config.mandatoryDeductions.reduce(
    (accumulator, rule) => {
      if (
        (employee.employmentType === "Contractor" ||
          employee.employmentType === "Freelancer") &&
        rule.label !== "Professional Tax"
      ) {
        accumulator.employee[rule.label] = 0;
        accumulator.employer[rule.label] = 0;
        return accumulator;
      }

      const cappedBase = Math.min(
        grossPerPeriodMinorUnits,
        rule.capMinorUnits ?? grossPerPeriodMinorUnits,
      );

      accumulator.employee[rule.label] =
        rule.calculation === "fixed"
          ? rule.fixedEmployeeMinorUnits ?? 0
          : scaleByRate(cappedBase, rule.employeeRate ?? 0);

      accumulator.employer[rule.label] =
        rule.calculation === "fixed"
          ? rule.fixedEmployerMinorUnits ?? 0
          : scaleByRate(cappedBase, rule.employerRate ?? 0);

      return accumulator;
    },
    {
      employee: {} as Record<string, number>,
      employer: {} as Record<string, number>,
    },
  );

const computeBaseGrossForPeriod = (
  employee: Employee,
  period: PayrollPeriod,
) => Math.round(employee.salary / getPeriodsPerYear(period.payFrequency));

const computeOvertimePay = (
  baseGrossMinorUnits: number,
  employee: Employee,
  config: CountryConfig,
  attendance?: AttendanceRecord,
) => {
  if (!attendance || attendance.overtimeHours <= 0) {
    return 0;
  }

  const hourlyRateMinorUnits = Math.round(
    baseGrossMinorUnits / ((employee.standardHoursPerWeek / 5) * config.workingDaysPerMonth),
  );

  return Math.max(
    0,
    Math.round(attendance.overtimeHours * hourlyRateMinorUnits * config.overtimeMultiplier),
  );
};

const buildPayslipEarnings = (
  employee: Employee,
  baseGrossMinorUnits: number,
  overtimeMinorUnits: number,
  reimbursedExpensesMinorUnits: number,
) => {
  const earnings: PayrollLineItem[] = [
    { label: "Base Pay", amount: baseGrossMinorUnits },
  ];

  if (employee.country === "IN") {
    earnings.push(
      { label: "HRA", amount: Math.round(baseGrossMinorUnits * 0.22) },
      { label: "LTA", amount: Math.round(baseGrossMinorUnits * 0.05) },
    );
  }

  if (employee.country === "AE") {
    earnings.push(
      { label: "Housing Allowance", amount: Math.round(baseGrossMinorUnits * 0.18) },
      { label: "Transport Allowance", amount: Math.round(baseGrossMinorUnits * 0.08) },
    );
  }

  if (overtimeMinorUnits > 0) {
    earnings.push({ label: "Overtime", amount: overtimeMinorUnits });
  }

  const reimbursements: PayrollLineItem[] =
    reimbursedExpensesMinorUnits > 0
      ? [{ label: "Expense Reimbursement", amount: reimbursedExpensesMinorUnits }]
      : [];

  return { earnings, reimbursements };
};

const standardStrategy: PayrollStrategy = ({
  employee,
  period,
  config,
  options,
}) => {
  const baseGrossMinorUnits = computeBaseGrossForPeriod(employee, period);
  const overtimeMinorUnits = computeOvertimePay(
    baseGrossMinorUnits,
    employee,
    config,
    options.attendance,
  );
  const unpaidLeaveDays = getApprovedUnpaidLeaveDays(
    employee.id,
    options.leaveRequests ?? [],
  );
  const leaveDeductionMinorUnits = Math.round(
    (baseGrossMinorUnits / config.workingDaysPerMonth) * unpaidLeaveDays,
  );
  const reimbursableExpenses = getReimbursableExpenses(
    employee.id,
    options.expenses ?? [],
  );
  const reimbursedExpensesMinorUnits = reimbursableExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const taxableGrossMinorUnits = Math.max(
    0,
    baseGrossMinorUnits + overtimeMinorUnits - leaveDeductionMinorUnits,
  );

  const taxMinorUnits = computeTaxForPeriod(
    taxableGrossMinorUnits,
    employee,
    period,
    config,
  );

  const socialContributions = computeSocialContributions(
    taxableGrossMinorUnits,
    employee,
    config,
  );
  const mandatoryDeductions = computeMandatoryDeductions(
    taxableGrossMinorUnits,
    employee,
    config,
  );

  const employeeSocialTotal = sumAmounts(
    Object.values(socialContributions.employee),
  );
  const employeeMandatoryTotal = sumAmounts(
    Object.values(mandatoryDeductions.employee),
  );
  const employerMandatoryTotal = sumAmounts(
    Object.values(mandatoryDeductions.employer),
  );
  const employerSocialTotal = sumAmounts(
    Object.values(socialContributions.employer),
  );

  const { earnings, reimbursements } = buildPayslipEarnings(
    employee,
    taxableGrossMinorUnits,
    overtimeMinorUnits,
    reimbursedExpensesMinorUnits,
  );

  const deductions = [
    { label: "Tax", amount: taxMinorUnits },
    { label: "Leave Deduction", amount: leaveDeductionMinorUnits },
    ...Object.entries(socialContributions.employee).map(([label, amount]) => ({
      label,
      amount,
    })),
    ...Object.entries(mandatoryDeductions.employee).map(([label, amount]) => ({
      label,
      amount,
    })),
  ].filter((item) => item.amount > 0);

  const employerCosts = [
    ...Object.entries(socialContributions.employer).map(([label, amount]) => ({
      label,
      amount,
    })),
    ...Object.entries(mandatoryDeductions.employer).map(([label, amount]) => ({
      label,
      amount,
    })),
  ].filter((item) => item.amount > 0);

  const netPayMinorUnits =
    taxableGrossMinorUnits +
    reimbursedExpensesMinorUnits -
    taxMinorUnits -
    employeeSocialTotal -
    employeeMandatoryTotal;

  const grossPayMinorUnits =
    taxableGrossMinorUnits + reimbursedExpensesMinorUnits;

  const countrySpecificFields: Record<string, string | number | boolean | null> = {
    statutoryForm: statutoryFormByCountry[employee.country],
    dataPrivacyLaw: config.dataPrivacyLaw,
    filingStatus: config.filingRequirements[0] ?? "Payroll filing",
    payFrequency: period.payFrequency,
    payInCrypto: employee.bankDetails.payInCrypto ?? false,
  };

  let cryptoPayout: PayrollResult["cryptoPayout"];
  if (
    employee.bankDetails.payInCrypto &&
    employee.bankDetails.cryptoCurrency &&
    config.cryptoPaySupported
  ) {
    const usdMinorUnits = convertMinorUnits(
      netPayMinorUnits,
      employee.currency,
      "USD",
    );
    const usdValue = usdMinorUnits / 100;
    const rateUsed = cryptoRatesInUsd[employee.bankDetails.cryptoCurrency];
    cryptoPayout = {
      currency: employee.bankDetails.cryptoCurrency,
      amount: Number((usdValue / rateUsed).toFixed(6)),
      rateUsed,
    };
    countrySpecificFields.cryptoWallet = employee.bankDetails.walletAddress ?? null;
  }

  return {
    employeeId: employee.id,
    period,
    grossPay: grossPayMinorUnits,
    taxBreakdown: { tax: taxMinorUnits },
    deductions: {
      leaveDeduction: leaveDeductionMinorUnits,
      ...socialContributions.employee,
      ...mandatoryDeductions.employee,
    },
    socialContributions,
    netPay: Math.max(0, netPayMinorUnits),
    currency: employee.currency,
    payslipData: {
      earnings,
      reimbursements,
      deductions,
      employerCosts,
    },
    countrySpecificFields,
    expensesReimbursed: reimbursedExpensesMinorUnits,
    cryptoPayout,
  };
};

const zeroTaxStrategy: PayrollStrategy = (input) =>
  standardStrategy({
    ...input,
    config: {
      ...input.config,
      taxSlabs: [{ label: "No income tax", upToMinorUnits: null, rate: 0 }],
      taxFreeAllowanceMinorUnits: 0,
    },
  });

const strategyRegistry: Record<CountryConfig["payrollStrategy"], PayrollStrategy> = {
  standard: standardStrategy,
  "contractor-friendly": standardStrategy,
  "zero-tax": zeroTaxStrategy,
};

export const computePayroll = (
  employee: Employee,
  period: PayrollPeriod,
  config: CountryConfig,
  options: PayrollComputationOptions = {},
): PayrollResult => {
  const strategy = strategyRegistry[config.payrollStrategy] ?? standardStrategy;

  return strategy({ employee, period, config, options });
};
