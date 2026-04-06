import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Home,
  Gift,
  CreditCard,
  Calculator,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from "lucide-react";

export default function SalaryCalculator() {
  // Input fields
  const [basicSalary, setBasicSalary] = useState(50000);
  const [hra, setHra] = useState(20000);
  const [bonus, setBonus] = useState(5000);
  const [deductions, setDeductions] = useState(12000);

  // UI state
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState("");
  const [yearlyMode, setYearlyMode] = useState(false); // false = monthly, true = yearly

  // Results
  const [grossSalary, setGrossSalary] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Validate inputs
  const validateInputs = () => {
    const values = [basicSalary, hra, bonus, deductions];
    for (let val of values) {
      if (val === "" || isNaN(val) || val < 0) {
        setError("All fields must be non-negative numbers.");
        return false;
      }
    }
    setError("");
    return true;
  };

  // Calculate salary
  const calculateSalary = () => {
    if (!validateInputs()) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const gross = Number(basicSalary) + Number(hra) + Number(bonus);
      const net = gross - Number(deductions);
      setGrossSalary(gross);
      setNetSalary(net);
      setCalculated(true);
      setLoading(false);
    }, 500);
  };

  // Reset form
  const resetForm = () => {
    setBasicSalary(50000);
    setHra(20000);
    setBonus(5000);
    setDeductions(12000);
    setCalculated(false);
    setError("");
  };

  // Download payslip (text file)
  const downloadPayslip = () => {
    const monthlyGross = grossSalary;
    const monthlyNet = netSalary;
    const yearlyGross = monthlyGross * 12;
    const yearlyNet = monthlyNet * 12;

    const content = `
=============================
      PAYSLIP SUMMARY
=============================
Employee: John Doe (Demo)
-------------------------
Basic Salary: ${formatCurrency(basicSalary)}
HRA: ${formatCurrency(hra)}
Bonus: ${formatCurrency(bonus)}
-------------------------
Gross Salary (Monthly): ${formatCurrency(monthlyGross)}
Deductions: ${formatCurrency(deductions)}
-------------------------
Net Salary (Monthly): ${formatCurrency(monthlyNet)}
-------------------------
Yearly Gross: ${formatCurrency(yearlyGross)}
Yearly Net: ${formatCurrency(yearlyNet)}
-------------------------
Generated on: ${new Date().toLocaleString()}
=============================
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get display values based on yearly toggle
  const displayGross = yearlyMode ? grossSalary * 12 : grossSalary;
  const displayNet = yearlyMode ? netSalary * 12 : netSalary;
  const displayBasic = yearlyMode ? basicSalary * 12 : basicSalary;
  const displayHra = yearlyMode ? hra * 12 : hra;
  const displayBonus = yearlyMode ? bonus * 12 : bonus;
  const displayDeductions = yearlyMode ? deductions * 12 : deductions;

  // Percentage for chart (gross vs deductions)
  const deductionPercent = grossSalary ? (deductions / grossSalary) * 100 : 0;
  const netPercent = 100 - deductionPercent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-7 w-7 text-white" />
              <h1 className="text-2xl font-bold text-white">Salary Calculator</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
              <span className="text-sm text-white">Monthly</span>
              <button
                onClick={() => setYearlyMode(!yearlyMode)}
                className="focus:outline-none"
              >
                {yearlyMode ? (
                  <ToggleRight className="h-6 w-6 text-white" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-white" />
                )}
              </button>
              <span className="text-sm text-white">Yearly</span>
            </div>
          </div>
          <p className="text-green-100 text-sm mt-1">
            Calculate your take-home salary after earnings and deductions
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Basic Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Home className="inline h-4 w-4 mr-1" />
                  HRA (House Rent Allowance)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={hra}
                    onChange={(e) => setHra(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Gift className="inline h-4 w-4 mr-1" />
                  Bonus
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <CreditCard className="inline h-4 w-4 mr-1" />
                  Deductions (Tax, PF, etc.)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateSalary}
                  disabled={loading}
                  className={`flex-1 px-5 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      Calculate Salary
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </motion.button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {calculated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 border border-green-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Salary Breakdown
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Basic Salary</span>
                        <span className="font-medium">{formatCurrency(displayBasic)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">HRA</span>
                        <span className="font-medium">{formatCurrency(displayHra)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bonus</span>
                        <span className="font-medium">{formatCurrency(displayBonus)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Gross Salary</span>
                          <span className="text-green-700">{formatCurrency(displayGross)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Total Deductions</span>
                        <span>- {formatCurrency(displayDeductions)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Net Salary</span>
                          <span className="text-green-700">{formatCurrency(displayNet)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown chart */}
                  <div className="mt-4 bg-white rounded-xl p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Earnings vs Deductions
                    </h3>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${netPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-green-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>Net: {netPercent.toFixed(1)}%</span>
                      <span>Deductions: {deductionPercent.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Payslip button */}
                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadPayslip}
                      className="w-full px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Download Payslip
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}