import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Calculator,
  CalendarDays,
  Download,
  FileText,
  IndianRupee,
  Landmark,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type EmpStatus = "Active" | "On Leave" | "Remote";
type ToastType = "success" | "error";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  ctc: number;
  basicSalary: number;
  hraPercentage: number;
  allowances: number;
  pan: string;
  uan: string;
  bankAccount: string;
  status: EmpStatus;
}

interface EmployeeForm extends Omit<Employee, "id"> {}

interface AttendanceRecord {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  wfh: number;
  overtimeHours: number;
}

interface LeaveRecord {
  casual: number;
  sick: number;
  paid: number;
  unpaid: number;
}

interface PayrollBreakdownItem {
  label: string;
  amount: number;
  type: "earning" | "deduction";
}

interface PayrollResult {
  employee: Employee;
  month: number;
  year: number;
  earnings: PayrollBreakdownItem[];
  deductions: PayrollBreakdownItem[];
  gross: number;
  totalDeductions: number;
  net: number;
  monthlyTds: number;
  attendanceImpact: number;
  employerPf: number;
  employerEsi: number;
}

interface PayslipRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  gross: number;
  totalDeductions: number;
  net: number;
  status: "Paid" | "Pending";
  result: PayrollResult;
}

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface TaxResult {
  taxableIncome: number;
  tax: number;
  cess: number;
  totalTax: number;
  netIncome: number;
}

const departmentOptions = ["Engineering", "HR", "Product", "Sales", "Finance", "Design", "Operations"];

const statusStyle: Record<EmpStatus, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
  "On Leave": "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300",
  Remote: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300",
};

const defaultAttendance: AttendanceRecord = { present: 20, absent: 1, late: 2, halfDay: 1, wfh: 4, overtimeHours: 6 };
const defaultLeave: LeaveRecord = { casual: 1, sick: 0, paid: 1, unpaid: 0 };

const mockEmployees: Employee[] = [
  { id: "EMP-1001", name: "Priya Sharma", email: "priya.sharma@payrollx.in", phone: "+91 98765 10001", department: "Engineering", role: "Frontend Engineer", ctc: 1320000, basicSalary: 52000, hraPercentage: 40, allowances: 12000, pan: "BDQPS1234K", uan: "100120230001", bankAccount: "345670001234", status: "Active" },
  { id: "EMP-1002", name: "Rahul Kumar", email: "rahul.kumar@payrollx.in", phone: "+91 98765 10002", department: "Product", role: "Product Manager", ctc: 1680000, basicSalary: 67000, hraPercentage: 40, allowances: 16000, pan: "AFRPK9231N", uan: "100120230002", bankAccount: "345670001235", status: "Active" },
  { id: "EMP-1003", name: "Anjali Mehta", email: "anjali.mehta@payrollx.in", phone: "+91 98765 10003", department: "Design", role: "Senior Product Designer", ctc: 1440000, basicSalary: 56000, hraPercentage: 40, allowances: 13000, pan: "CCAPM5512T", uan: "100120230003", bankAccount: "345670001236", status: "Remote" },
  { id: "EMP-1004", name: "Vikram Singh", email: "vikram.singh@payrollx.in", phone: "+91 98765 10004", department: "Sales", role: "Regional Sales Manager", ctc: 1380000, basicSalary: 54000, hraPercentage: 35, allowances: 14000, pan: "DFUPS1189L", uan: "100120230004", bankAccount: "345670001237", status: "Active" },
  { id: "EMP-1005", name: "Neha Patel", email: "neha.patel@payrollx.in", phone: "+91 98765 10005", department: "HR", role: "HR Business Partner", ctc: 1100000, basicSalary: 44000, hraPercentage: 40, allowances: 9000, pan: "BGNPP2341A", uan: "100120230005", bankAccount: "345670001238", status: "On Leave" },
  { id: "EMP-1006", name: "Arjun Verma", email: "arjun.verma@payrollx.in", phone: "+91 98765 10006", department: "Engineering", role: "Backend Engineer", ctc: 1250000, basicSalary: 50000, hraPercentage: 40, allowances: 11000, pan: "AAFPV8931H", uan: "100120230006", bankAccount: "345670001239", status: "Active" },
  { id: "EMP-1007", name: "Kavya Nair", email: "kavya.nair@payrollx.in", phone: "+91 98765 10007", department: "Finance", role: "Finance Analyst", ctc: 980000, basicSalary: 39000, hraPercentage: 40, allowances: 9000, pan: "BUNPN3477C", uan: "100120230007", bankAccount: "345670001240", status: "Remote" },
  { id: "EMP-1008", name: "Rohan Iyer", email: "rohan.iyer@payrollx.in", phone: "+91 98765 10008", department: "Engineering", role: "DevOps Engineer", ctc: 1520000, basicSalary: 61000, hraPercentage: 40, allowances: 15000, pan: "AMOPI9871S", uan: "100120230008", bankAccount: "345670001241", status: "Active" },
  { id: "EMP-1009", name: "Sneha Gupta", email: "sneha.gupta@payrollx.in", phone: "+91 98765 10009", department: "Product", role: "Product Analyst", ctc: 1180000, basicSalary: 47000, hraPercentage: 40, allowances: 10000, pan: "GJMPG6655Q", uan: "100120230009", bankAccount: "345670001242", status: "Active" },
  { id: "EMP-1010", name: "Manish Kulkarni", email: "manish.kulkarni@payrollx.in", phone: "+91 98765 10010", department: "Sales", role: "Account Executive", ctc: 1020000, basicSalary: 40000, hraPercentage: 35, allowances: 9500, pan: "AMTPK7881R", uan: "100120230010", bankAccount: "345670001243", status: "Active" },
  { id: "EMP-1011", name: "Pooja Desai", email: "pooja.desai@payrollx.in", phone: "+91 98765 10011", department: "HR", role: "Talent Lead", ctc: 1080000, basicSalary: 42000, hraPercentage: 40, allowances: 10000, pan: "BAPPD0198K", uan: "100120230011", bankAccount: "345670001244", status: "Active" },
  { id: "EMP-1012", name: "Nitin Bhatia", email: "nitin.bhatia@payrollx.in", phone: "+91 98765 10012", department: "Engineering", role: "QA Engineer", ctc: 940000, basicSalary: 37000, hraPercentage: 40, allowances: 8500, pan: "ACCPB5588E", uan: "100120230012", bankAccount: "345670001245", status: "Remote" },
  { id: "EMP-1013", name: "Isha Kapoor", email: "isha.kapoor@payrollx.in", phone: "+91 98765 10013", department: "Finance", role: "Finance Controller", ctc: 1880000, basicSalary: 75000, hraPercentage: 40, allowances: 20000, pan: "CDIPK7771J", uan: "100120230013", bankAccount: "345670001246", status: "Active" },
  { id: "EMP-1014", name: "Devansh Joshi", email: "devansh.joshi@payrollx.in", phone: "+91 98765 10014", department: "Operations", role: "Operations Manager", ctc: 1200000, basicSalary: 47000, hraPercentage: 35, allowances: 12000, pan: "AAKPJ1123P", uan: "100120230014", bankAccount: "345670001247", status: "Active" },
  { id: "EMP-1015", name: "Ritika Bose", email: "ritika.bose@payrollx.in", phone: "+91 98765 10015", department: "Design", role: "Visual Designer", ctc: 900000, basicSalary: 35000, hraPercentage: 40, allowances: 9000, pan: "AAYPB8832R", uan: "100120230015", bankAccount: "345670001248", status: "On Leave" },
  { id: "EMP-1016", name: "Siddharth Jain", email: "siddharth.jain@payrollx.in", phone: "+91 98765 10016", department: "Engineering", role: "Tech Lead", ctc: 2200000, basicSalary: 88000, hraPercentage: 40, allowances: 25000, pan: "ADXPJ6612B", uan: "100120230016", bankAccount: "345670001249", status: "Active" },
  { id: "EMP-1017", name: "Meera Krishnan", email: "meera.krishnan@payrollx.in", phone: "+91 98765 10017", department: "Product", role: "Senior Product Manager", ctc: 2100000, basicSalary: 84000, hraPercentage: 40, allowances: 24000, pan: "AHXPK0921T", uan: "100120230017", bankAccount: "345670001250", status: "Active" },
  { id: "EMP-1018", name: "Aman Choudhary", email: "aman.choudhary@payrollx.in", phone: "+91 98765 10018", department: "Sales", role: "Inside Sales Specialist", ctc: 840000, basicSalary: 32000, hraPercentage: 35, allowances: 8500, pan: "AQLPC1711L", uan: "100120230018", bankAccount: "345670001251", status: "Remote" },
  { id: "EMP-1019", name: "Tanya Arora", email: "tanya.arora@payrollx.in", phone: "+91 98765 10019", department: "HR", role: "HR Operations Specialist", ctc: 860000, basicSalary: 33000, hraPercentage: 40, allowances: 8200, pan: "BFIPA7789M", uan: "100120230019", bankAccount: "345670001252", status: "Active" },
  { id: "EMP-1020", name: "Farhan Ali", email: "farhan.ali@payrollx.in", phone: "+91 98765 10020", department: "Finance", role: "Payroll Executive", ctc: 780000, basicSalary: 30000, hraPercentage: 40, allowances: 7500, pan: "ATXPA2884N", uan: "100120230020", bankAccount: "345670001253", status: "Active" },
];

const emptyForm: EmployeeForm = {
  name: "",
  email: "",
  phone: "",
  department: "Engineering",
  role: "",
  ctc: 0,
  basicSalary: 0,
  hraPercentage: 40,
  allowances: 0,
  pan: "",
  uan: "",
  bankAccount: "",
  status: "Active",
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const money = (value: number) => `₹${Math.max(0, value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const getProfessionalTax = (monthlyGross: number) => {
  if (monthlyGross <= 7500) return 0;
  if (monthlyGross <= 10000) return 175;
  return 200;
};

const getTaxByNewRegime = (annualIncome: number): TaxResult => {
  const taxableIncome = Math.max(0, annualIncome - 50000);
  const slabs: Array<[number, number]> = [
    [300000, 0],
    [300000, 0.05],
    [300000, 0.1],
    [300000, 0.15],
    [300000, 0.2],
    [Number.POSITIVE_INFINITY, 0.3],
  ];
  let tax = 0;
  let remaining = taxableIncome;
  for (const [limit, rate] of slabs) {
    if (remaining <= 0) break;
    const slabAmount = Math.min(remaining, limit);
    tax += slabAmount * rate;
    remaining -= slabAmount;
  }
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  return { taxableIncome, tax, cess, totalTax, netIncome: Math.max(0, annualIncome - totalTax) };
};

const computePayroll = (employee: Employee, attendance: AttendanceRecord, leave: LeaveRecord, month: number, year: number): PayrollResult => {
  const basic = employee.basicSalary;
  const hra = basic * (employee.hraPercentage / 100);
  const da = basic * 0.08;
  const specialAllowance = employee.allowances;
  const bonus = employee.ctc / 12 > 120000 ? 3000 : 1500;
  const otherAllowances = employee.ctc / 12 > 90000 ? 2500 : 1200;
  const fixedEarnings = basic + hra + da + specialAllowance + bonus + otherAllowances;

  const hourlyRate = fixedEarnings / 30 / 8;
  const overtimePay = attendance.overtimeHours * hourlyRate;
  const gross = fixedEarnings + overtimePay;
  const dailyRate = fixedEarnings / 30;

  const absentDeduction = attendance.absent * dailyRate;
  const halfDayDeduction = attendance.halfDay * (dailyRate / 2);
  const unpaidLeaveDeduction = leave.unpaid * dailyRate;
  const latePenalty = attendance.late * 150;
  const attendanceImpact = absentDeduction + halfDayDeduction + unpaidLeaveDeduction + latePenalty;

  const pfWage = Math.min(basic, 15000);
  const employeePf = pfWage * 0.12;
  const employerPf = pfWage * 0.12;

  const employeeEsi = gross <= 21000 ? gross * 0.0075 : 0;
  const employerEsi = gross <= 21000 ? gross * 0.0325 : 0;
  const professionalTax = getProfessionalTax(gross);
  const yearlyTax = getTaxByNewRegime(employee.ctc);
  const monthlyTds = yearlyTax.totalTax / 12;

  const deductions = [
    { label: "Provident Fund (Employee)", amount: employeePf, type: "deduction" as const },
    { label: "ESI (Employee)", amount: employeeEsi, type: "deduction" as const },
    { label: "Professional Tax", amount: professionalTax, type: "deduction" as const },
    { label: "TDS", amount: monthlyTds, type: "deduction" as const },
    { label: "Leave/Attendance Deduction", amount: attendanceImpact, type: "deduction" as const },
  ];

  const earnings = [
    { label: "Basic Salary", amount: basic, type: "earning" as const },
    { label: "HRA", amount: hra, type: "earning" as const },
    { label: "DA", amount: da, type: "earning" as const },
    { label: "Special Allowance", amount: specialAllowance, type: "earning" as const },
    { label: "Bonus", amount: bonus, type: "earning" as const },
    { label: "Other Allowances", amount: otherAllowances, type: "earning" as const },
    { label: "Overtime", amount: overtimePay, type: "earning" as const },
  ];

  const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
  const net = gross - totalDeductions;
  return { employee, month, year, earnings, deductions, gross, totalDeductions, net, monthlyTds, attendanceImpact, employerPf, employerEsi };
};

export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>(
    Object.fromEntries(mockEmployees.map((employee) => [employee.id, { ...defaultAttendance }]))
  );
  const [leaveMap, setLeaveMap] = useState<Record<string, LeaveRecord>>(
    Object.fromEntries(mockEmployees.map((employee) => [employee.id, { ...defaultLeave }]))
  );
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(mockEmployees[0]?.id ?? "");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [profileEmployee, setProfileEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [taxInput, setTaxInput] = useState(1200000);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(getTaxByNewRegime(1200000));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  const pushToast = (type: ToastType, message: string) => {
    const id = toastCounter + 1;
    setToastCounter(id);
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 3200);
  };

  const payrollByEmployee = useMemo(
    () =>
      Object.fromEntries(
        employees.map((employee) => [
          employee.id,
          computePayroll(
            employee,
            attendanceMap[employee.id] || defaultAttendance,
            leaveMap[employee.id] || defaultLeave,
            selectedMonth,
            selectedYear
          ),
        ])
      ) as Record<string, PayrollResult>,
    [employees, attendanceMap, leaveMap, selectedMonth, selectedYear]
  );

  const selectedPayroll = payrollByEmployee[selectedEmployeeId];
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) || null;

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query);
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  const dashboardStats = useMemo(() => {
    const allResults = Object.values(payrollByEmployee);
    const totalPayrollCost = allResults.reduce((sum, item) => sum + item.gross + item.employerPf + item.employerEsi, 0);
    const netPay = allResults.reduce((sum, item) => sum + item.net, 0);
    const taxDeducted = allResults.reduce((sum, item) => sum + item.monthlyTds, 0);
    return { totalEmployees: employees.length, totalPayrollCost, netPay, taxDeducted };
  }, [employees.length, payrollByEmployee]);

  const departmentPayroll = useMemo(
    () =>
      departmentOptions
        .map((department) => ({
          department,
          value: employees
            .filter((employee) => employee.department === department)
            .reduce((sum, employee) => sum + (payrollByEmployee[employee.id]?.net || 0), 0),
        }))
        .filter((item) => item.value > 0),
    [employees, payrollByEmployee]
  );

  const salaryDistribution = useMemo(() => {
    const bands = [
      { label: "< ₹60k", min: 0, max: 60000 },
      { label: "₹60k-₹80k", min: 60000, max: 80000 },
      { label: "₹80k-₹100k", min: 80000, max: 100000 },
      { label: "> ₹100k", min: 100000, max: Number.POSITIVE_INFINITY },
    ];
    return bands.map((band) => ({
      ...band,
      count: Object.values(payrollByEmployee).filter((item) => item.net >= band.min && item.net < band.max).length,
    }));
  }, [payrollByEmployee]);

  const attendanceImpactList = useMemo(
    () =>
      Object.values(payrollByEmployee)
        .map((item) => ({ name: item.employee.name, value: item.attendanceImpact }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
    [payrollByEmployee]
  );

  const trendSeries = useMemo(
    () =>
      [-5, -2, 0, 2, 1, 4].map((offset, index) => ({
        month: monthNames[(selectedMonth - 6 + index + 12) % 12],
        value: Math.max(0, dashboardStats.netPay * (1 + offset / 100)),
      })),
    [dashboardStats.netPay, selectedMonth]
  );

  const openAdd = () => {
    setEditingEmployee(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      ctc: employee.ctc,
      basicSalary: employee.basicSalary,
      hraPercentage: employee.hraPercentage,
      allowances: employee.allowances,
      pan: employee.pan,
      uan: employee.uan,
      bankAccount: employee.bankAccount,
      status: employee.status,
    });
    setFormOpen(true);
  };

  const saveEmployee = () => {
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      pushToast("error", "Please fill mandatory employee fields.");
      return;
    }
    if (editingEmployee) {
      setEmployees((prev) => prev.map((employee) => (employee.id === editingEmployee.id ? { ...editingEmployee, ...form } : employee)));
      pushToast("success", "Employee updated.");
    } else {
      const id = `EMP-${Math.floor(2000 + Math.random() * 7000)}`;
      const newEmp: Employee = { id, ...form };
      setEmployees((prev) => [newEmp, ...prev]);
      setAttendanceMap((prev) => ({ ...prev, [id]: { ...defaultAttendance } }));
      setLeaveMap((prev) => ({ ...prev, [id]: { ...defaultLeave } }));
      pushToast("success", "Employee added successfully.");
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteEmployee) return;
    setEmployees((prev) => prev.filter((employee) => employee.id !== deleteEmployee.id));
    setAttendanceMap((prev) => {
      const next = { ...prev };
      delete next[deleteEmployee.id];
      return next;
    });
    setLeaveMap((prev) => {
      const next = { ...prev };
      delete next[deleteEmployee.id];
      return next;
    });
    setDeleteEmployee(null);
    pushToast("success", "Employee deleted.");
  };

  const updateAttendance = (employeeId: string, key: keyof AttendanceRecord, value: number) => {
    setAttendanceMap((prev) => ({ ...prev, [employeeId]: { ...(prev[employeeId] || defaultAttendance), [key]: Math.max(0, value) } }));
  };

  const updateLeave = (employeeId: string, key: keyof LeaveRecord, value: number) => {
    setLeaveMap((prev) => ({ ...prev, [employeeId]: { ...(prev[employeeId] || defaultLeave), [key]: Math.max(0, value) } }));
  };

  const generatePayslip = () => {
    if (!selectedPayroll) return;
    setPayslips((prev) => [
      {
        id: `PS-${Date.now()}`,
        employeeId: selectedPayroll.employee.id,
        employeeName: selectedPayroll.employee.name,
        month: selectedMonth,
        year: selectedYear,
        gross: selectedPayroll.gross,
        totalDeductions: selectedPayroll.totalDeductions,
        net: selectedPayroll.net,
        status: "Pending",
        result: selectedPayroll,
      },
      ...prev,
    ]);
    pushToast("success", `Payslip generated for ${selectedPayroll.employee.name}.`);
  };

  const downloadPayslip = (slip: PayslipRecord) => {
    const text = [
      "PayrollX Technologies Pvt. Ltd.",
      `Payslip: ${monthNames[slip.month - 1]} ${slip.year}`,
      `Employee: ${slip.employeeName} (${slip.employeeId})`,
      `Gross Salary: ${money(slip.gross)}`,
      `Total Deductions: ${money(slip.totalDeductions)}`,
      `Net Salary: ${money(slip.net)}`,
    ].join("\n");
    const blob = new Blob([text], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payslip-${slip.employeeId}-${slip.month}-${slip.year}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const form16Summary = useMemo(() => {
    if (!selectedPayroll || !selectedEmployee) return null;
    const annualGross = selectedPayroll.gross * 12;
    const annualTds = selectedPayroll.monthlyTds * 12;
    const annualTax = getTaxByNewRegime(selectedEmployee.ctc);
    return { annualGross, annualTds, taxableIncome: annualTax.taxableIncome, totalTax: annualTax.totalTax };
  }, [selectedPayroll, selectedEmployee]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, x: 32 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -12, x: 32 }}
            className={`fixed right-4 top-4 z-[9999] rounded-xl border px-4 py-3 text-sm shadow-xl ${
              toast.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                : "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-header dark:text-slate-100">Indian Payroll Management</h1>
          <p className="page-subheader">Frontend-only HR payroll suite with attendance, leave, tax, payslips, Form-16 and analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>{monthNames.map((m, i) => <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Input type="number" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="w-[110px]" />
          <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
            <SelectTrigger className="w-[250px]"><SelectValue placeholder="Select employee" /></SelectTrigger>
            <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Employees", value: dashboardStats.totalEmployees, icon: Users },
          { label: "Total Payroll Cost", value: money(dashboardStats.totalPayrollCost), icon: Landmark },
          { label: "Net Pay (Current)", value: money(dashboardStats.netPay), icon: IndianRupee },
          { label: "Total Tax Deducted", value: money(dashboardStats.taxDeducted), icon: FileText },
        ].map((card) => (
          <Card key={card.label} className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <CardContent className="flex items-center justify-between p-5">
              <div><p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p><p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{card.value}</p></div>
              <card.icon className="h-5 w-5 text-slate-500 dark:text-slate-300" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2"><CardContent className="p-5"><p className="mb-3 font-semibold">Department Payroll</p>{departmentPayroll.map((d) => <div key={d.department} className="mb-3"><div className="mb-1 flex justify-between text-xs"><span>{d.department}</span><span>{money(d.value)}</span></div><div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-blue-500" style={{ width: `${(d.value / Math.max(...departmentPayroll.map((x) => x.value), 1)) * 100}%` }} /></div></div>)}</CardContent></Card>
          <Card><CardContent className="p-5"><p className="mb-3 font-semibold">Salary Distribution</p>{salaryDistribution.map((d) => <div key={d.label} className="mb-2 flex items-center justify-between text-sm"><span>{d.label}</span><Badge variant="outline">{d.count}</Badge></div>)}</CardContent></Card>
          <Card className="lg:col-span-3"><CardContent className="p-5"><p className="mb-3 font-semibold">Attendance Impact on Salary</p>{attendanceImpactList.map((a) => <div key={a.name} className="mb-2"><div className="mb-1 flex justify-between text-xs"><span>{a.name}</span><span className="text-red-600">{money(a.value)}</span></div><div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-red-500" style={{ width: `${(a.value / Math.max(...attendanceImpactList.map((x) => x.value), 1)) * 100}%` }} /></div></div>)}</CardContent></Card>
        </TabsContent>

        <TabsContent value="employees" className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2"><div className="relative flex-1 min-w-[240px]"><Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" /><Input className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, role, email, department" /></div><Select value={departmentFilter} onValueChange={setDepartmentFilter}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Departments</SelectItem>{departmentOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select><Button onClick={openAdd}><Plus className="mr-1 h-4 w-4" />Add Employee</Button></div>
          <Card><CardContent className="p-0"><div className="max-h-[420px] overflow-auto"><table className="min-w-full text-sm"><thead className="sticky top-0 bg-slate-50 dark:bg-slate-900"><tr><th className="px-4 py-3 text-left">Employee</th><th className="px-4 py-3 text-left">Department</th><th className="px-4 py-3 text-left">CTC</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{filteredEmployees.map((e) => <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setProfileEmployee(e)}><td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback>{initials(e.name)}</AvatarFallback></Avatar><div><p className="font-medium">{e.name}</p><p className="text-xs text-slate-500">{e.role}</p></div></div></td><td className="px-4 py-3">{e.department}</td><td className="px-4 py-3">{money(e.ctc)}</td><td className="px-4 py-3"><Badge variant="outline" className={statusStyle[e.status]}>{e.status}</Badge></td><td className="px-4 py-3 text-right"><Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}><UserRound className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={(ev) => { ev.stopPropagation(); setDeleteEmployee(e); }}><Trash2 className="h-4 w-4 text-red-600" /></Button></td></tr>)}</tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card><CardContent className="p-4"><div className="max-h-[430px] overflow-auto"><table className="min-w-full text-sm"><thead className="sticky top-0 bg-slate-50 dark:bg-slate-900"><tr><th className="px-3 py-2 text-left">Employee</th><th className="px-3 py-2">Present</th><th className="px-3 py-2">Absent</th><th className="px-3 py-2">Late</th><th className="px-3 py-2">Half Day</th><th className="px-3 py-2">WFH</th><th className="px-3 py-2">Overtime(H)</th><th className="px-3 py-2">Paid Leave</th><th className="px-3 py-2">Unpaid Leave</th></tr></thead><tbody>{employees.map((e) => { const a = attendanceMap[e.id] || defaultAttendance; const l = leaveMap[e.id] || defaultLeave; return <tr key={e.id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-3 py-2">{e.name}</td>{(["present","absent","late","halfDay","wfh","overtimeHours"] as Array<keyof AttendanceRecord>).map((k) => <td key={k} className="px-2 py-2"><Input type="number" value={a[k]} className="h-8 w-20" onChange={(ev) => updateAttendance(e.id, k, Number(ev.target.value))} /></td>)}<td className="px-2 py-2"><Input type="number" value={l.paid} className="h-8 w-20" onChange={(ev) => updateLeave(e.id, "paid", Number(ev.target.value))} /></td><td className="px-2 py-2"><Input type="number" value={l.unpaid} className="h-8 w-20" onChange={(ev) => updateLeave(e.id, "unpaid", Number(ev.target.value))} /></td></tr>; })}</tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card><CardContent className="p-5"><p className="mb-3 font-semibold">Payroll Engine Output - {selectedEmployee?.name}</p>{selectedPayroll ? <><div className="grid grid-cols-2 gap-3 text-sm">{selectedPayroll.earnings.map((item) => <div key={item.label} className="flex justify-between border-b py-1"><span>{item.label}</span><span className="text-emerald-600">{money(item.amount)}</span></div>)}{selectedPayroll.deductions.map((item) => <div key={item.label} className="flex justify-between border-b py-1"><span>{item.label}</span><span className="text-red-600">{money(item.amount)}</span></div>)}</div><div className="mt-4 flex justify-between text-sm"><span>Gross</span><b>{money(selectedPayroll.gross)}</b></div><div className="mt-1 flex justify-between text-sm"><span>Total Deductions</span><b>{money(selectedPayroll.totalDeductions)}</b></div><div className="mt-1 flex justify-between text-base"><span>Net Pay</span><b className="text-emerald-600">{money(selectedPayroll.net)}</b></div><Button className="mt-4 w-full" onClick={generatePayslip}><Plus className="mr-1 h-4 w-4" />Generate Payslip</Button></> : <p>No employee selected.</p>}</CardContent></Card>
          <Card><CardContent className="p-5"><p className="mb-3 font-semibold">Indian Tax Calculator (New Regime)</p><Label>Annual Salary</Label><Input type="number" value={taxInput} onChange={(e) => setTaxInput(Number(e.target.value))} className="mt-1" /><Button className="mt-3 w-full" variant="outline" onClick={() => setTaxResult(getTaxByNewRegime(taxInput))}><Calculator className="mr-1 h-4 w-4" />Calculate Tax</Button>{taxResult && <div className="mt-4 space-y-2 rounded-lg border p-3 text-sm"><div className="flex justify-between"><span>Taxable Income</span><span>{money(taxResult.taxableIncome)}</span></div><div className="flex justify-between"><span>Income Tax</span><span>{money(taxResult.tax)}</span></div><div className="flex justify-between"><span>Cess (4%)</span><span>{money(taxResult.cess)}</span></div><div className="flex justify-between font-semibold"><span>Total Tax</span><span>{money(taxResult.totalTax)}</span></div><div className="flex justify-between font-semibold text-emerald-600"><span>Net Income</span><span>{money(taxResult.netIncome)}</span></div></div>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="payslips" className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card><CardContent className="p-5"><p className="mb-3 font-semibold">Payslip Generator & History</p><div className="space-y-2 max-h-[380px] overflow-auto">{payslips.length === 0 ? <p className="text-sm text-slate-500">No payslips generated yet.</p> : payslips.map((s) => <div key={s.id} className="flex items-center justify-between rounded-lg border p-3 text-sm"><div><p className="font-medium">{s.employeeName}</p><p className="text-xs text-slate-500">{monthNames[s.month - 1]} {s.year}</p></div><div>{money(s.net)}</div><Button size="sm" variant="ghost" onClick={() => downloadPayslip(s)}><Download className="h-4 w-4" /></Button></div>)}</div></CardContent></Card>
          <Card><CardContent className="p-5"><p className="mb-3 font-semibold">Form-16 Preview (Simulated)</p>{form16Summary && selectedEmployee ? <div className="space-y-2 text-sm"><p><b>Employee:</b> {selectedEmployee.name} ({selectedEmployee.id})</p><p><b>PAN:</b> {selectedEmployee.pan}</p><p><b>UAN:</b> {selectedEmployee.uan}</p><p><b>Bank:</b> {selectedEmployee.bankAccount}</p><div className="mt-3 rounded-lg border p-3"><div className="flex justify-between"><span>Total Salary Paid</span><span>{money(form16Summary.annualGross)}</span></div><div className="flex justify-between"><span>Total TDS Deducted</span><span>{money(form16Summary.annualTds)}</span></div><div className="flex justify-between"><span>Taxable Income</span><span>{money(form16Summary.taxableIncome)}</span></div><div className="flex justify-between font-semibold"><span>Total Tax Paid</span><span>{money(form16Summary.totalTax)}</span></div></div></div> : <p>No Form-16 data available.</p>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card><CardContent className="p-5"><p className="mb-3 font-semibold">AI Salary Analytics - Monthly Trend</p>{trendSeries.map((t) => <div key={t.month} className="mb-2"><div className="mb-1 flex justify-between text-xs"><span>{t.month}</span><span>{money(t.value)}</span></div><div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(t.value / Math.max(...trendSeries.map((x) => x.value), 1)) * 100}%` }} /></div></div>)}</CardContent></Card>
          <Card><CardContent className="p-5"><p className="mb-3 font-semibold">Insights</p><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Highest Net Pay</span><b>{money(Math.max(...Object.values(payrollByEmployee).map((p) => p.net), 0))}</b></div><div className="flex justify-between"><span>Avg Net Pay</span><b>{money(dashboardStats.netPay / Math.max(dashboardStats.totalEmployees, 1))}</b></div><div className="flex justify-between"><span>Total Attendance Impact</span><b className="text-red-600">{money(attendanceImpactList.reduce((sum, i) => sum + i.value, 0))}</b></div><div className="flex justify-between"><span>Projected Annual Tax</span><b>{money(dashboardStats.taxDeducted * 12)}</b></div></div></CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{editingEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle></DialogHeader><div className="grid gap-3 sm:grid-cols-2">{(["name","email","phone","role","pan","uan","bankAccount"] as Array<keyof EmployeeForm>).map((field) => <div key={field}><Label className="capitalize">{field}</Label><Input value={String(form[field])} onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))} /></div>)}<div><Label>Department</Label><Select value={form.department} onValueChange={(value) => setForm((prev) => ({ ...prev, department: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{departmentOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div><div><Label>Status</Label><Select value={form.status} onValueChange={(value: EmpStatus) => setForm((prev) => ({ ...prev, status: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="On Leave">On Leave</SelectItem><SelectItem value="Remote">Remote</SelectItem></SelectContent></Select></div><div><Label>CTC</Label><Input type="number" value={form.ctc} onChange={(e) => setForm((prev) => ({ ...prev, ctc: Number(e.target.value) }))} /></div><div><Label>Basic Salary</Label><Input type="number" value={form.basicSalary} onChange={(e) => setForm((prev) => ({ ...prev, basicSalary: Number(e.target.value) }))} /></div><div><Label>HRA %</Label><Input type="number" value={form.hraPercentage} onChange={(e) => setForm((prev) => ({ ...prev, hraPercentage: Number(e.target.value) }))} /></div><div><Label>Allowances</Label><Input type="number" value={form.allowances} onChange={(e) => setForm((prev) => ({ ...prev, allowances: Number(e.target.value) }))} /></div><div className="sm:col-span-2 flex justify-end"><Button onClick={saveEmployee}>Save Employee</Button></div></div></DialogContent>
      </Dialog>

      <Sheet open={Boolean(profileEmployee)} onOpenChange={(v) => !v && setProfileEmployee(null)}>
        <SheetContent><SheetHeader><SheetTitle>Employee Profile</SheetTitle></SheetHeader>{profileEmployee && <div className="mt-4 space-y-3 text-sm"><div className="flex items-center gap-2"><Avatar><AvatarFallback>{initials(profileEmployee.name)}</AvatarFallback></Avatar><div><p className="font-semibold">{profileEmployee.name}</p><p className="text-slate-500">{profileEmployee.role}</p></div></div><p><b>ID:</b> {profileEmployee.id}</p><p><b>Department:</b> {profileEmployee.department}</p><p><b>Email:</b> {profileEmployee.email}</p><p><b>Phone:</b> {profileEmployee.phone}</p><p><b>PAN:</b> {profileEmployee.pan}</p><p><b>UAN:</b> {profileEmployee.uan}</p><p><b>Bank:</b> {profileEmployee.bankAccount}</p><div className="flex gap-2 pt-2"><Button className="flex-1" onClick={() => { openEdit(profileEmployee); setProfileEmployee(null); }}>Edit</Button><Button className="flex-1" variant="destructive" onClick={() => { setDeleteEmployee(profileEmployee); setProfileEmployee(null); }}>Delete</Button></div></div>}</SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(deleteEmployee)} onOpenChange={(v) => !v && setDeleteEmployee(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete employee?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this employee?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

