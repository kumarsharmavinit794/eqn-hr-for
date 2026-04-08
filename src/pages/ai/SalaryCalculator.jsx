import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Briefcase,
  Calculator,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Gift,
  Home,
  Landmark,
  PieChart,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function SalaryCalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [hra, setHra] = useState(20000);
  const [bonus, setBonus] = useState(5000);
  const [deductions, setDeductions] = useState(12000);
  const [loading, setLoading] = useState(false);
  const [yearlyMode, setYearlyMode] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("calculator");
  const [error, setError] = useState("");

  const analytics = useMemo(() => {
    const gross = result?.gross || basicSalary + hra + bonus;
    const net = result?.net || gross - deductions;
    return [
      { label: "Average Employee Salary", value: formatCurrency(684000), icon: Briefcase },
      { label: "Monthly Gross", value: formatCurrency(gross), icon: ArrowUpCircle },
      { label: "Monthly Net", value: formatCurrency(net), icon: Wallet },
      { label: "Deduction Load", value: `${gross ? Math.round((deductions / gross) * 100) : 0}%`, icon: ArrowDownCircle },
    ];
  }, [basicSalary, bonus, deductions, hra, result]);

  const calculate = async () => {
    const values = [basicSalary, hra, bonus, deductions];
    if (values.some((item) => Number.isNaN(Number(item)) || Number(item) < 0)) {
      setError("All salary fields must be valid non-negative numbers.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const gross = Number(basicSalary) + Number(hra) + Number(bonus);
    const net = gross - Number(deductions);
    setResult({
      gross,
      net,
      yearlyGross: gross * 12,
      yearlyNet: net * 12,
      deductionPercent: gross ? Math.round((Number(deductions) / gross) * 100) : 0,
      netPercent: gross ? 100 - Math.round((Number(deductions) / gross) * 100) : 0,
      taxableIncome: Math.max(0, gross - Number(hra) * 0.4),
    });
    setLoading(false);
    setActiveTab("breakdown");
  };

  const reset = () => {
    setBasicSalary(50000);
    setHra(20000);
    setBonus(5000);
    setDeductions(12000);
    setResult(null);
    setError("");
    setActiveTab("calculator");
  };

  const exportPayslip = () => {
    const gross = result?.gross || basicSalary + hra + bonus;
    const net = result?.net || gross - deductions;
    const content = `Payroll Insight Summary\nEmployee: Demo Employee\nBasic: ${formatCurrency(basicSalary)}\nHRA: ${formatCurrency(hra)}\nBonus: ${formatCurrency(bonus)}\nDeductions: ${formatCurrency(deductions)}\nGross: ${formatCurrency(gross)}\nNet: ${formatCurrency(net)}\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const multiplier = yearlyMode ? 12 : 1;
  const grossValue = (result?.gross || 0) * multiplier;
  const netValue = (result?.net || 0) * multiplier;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(59,130,246,0.16),_transparent_32%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">Payroll Insight Tool</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Salary Calculator and Payslip Tool</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Analyze salary structure, compare net versus deductions, toggle monthly and yearly views, and export a payroll summary in a consistent HR dashboard experience.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">
                  <span className="text-slate-500">Monthly</span>
                  <button type="button" onClick={() => setYearlyMode((prev) => !prev)}>{yearlyMode ? <ToggleRight className="h-5 w-5 text-emerald-600" /> : <ToggleLeft className="h-5 w-5 text-slate-500" />}</button>
                  <span className="text-slate-500">Yearly</span>
                </div>
                <Button variant="outline" onClick={reset}><RefreshCw className="mr-2 h-4 w-4" />Reset</Button>
                <Button onClick={calculate} disabled={loading}>{loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}{loading ? "Calculating..." : "Calculate Salary"}</Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analytics.map((item) => <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div><item.icon className="h-5 w-5 text-slate-500" /></CardContent></Card>)}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Payroll Inputs</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Basic Salary</p><Input type="number" value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">HRA</p><Input type="number" value={hra} onChange={(e) => setHra(Number(e.target.value))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Bonus</p><Input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Deductions</p><Input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} /></div>
              {error && <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Salary Snapshot</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700"><p className="text-xs text-slate-500">{yearlyMode ? "Yearly gross" : "Monthly gross"}</p><p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(grossValue)}</p></div>
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700"><p className="text-xs text-slate-500">{yearlyMode ? "Yearly net" : "Monthly net"}</p><p className="mt-2 text-3xl font-bold text-emerald-600">{formatCurrency(netValue)}</p></div>
              <Button className="w-full" variant="outline" onClick={exportPayslip}><Download className="mr-2 h-4 w-4" />Download Payslip</Button>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader><CardTitle className="text-base">Salary Breakdown Summary</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Basic", value: formatCurrency(basicSalary * multiplier), icon: DollarSign },
                  { label: "HRA", value: formatCurrency(hra * multiplier), icon: Home },
                  { label: "Bonus", value: formatCurrency(bonus * multiplier), icon: Gift },
                  { label: "Deductions", value: formatCurrency(deductions * multiplier), icon: CreditCard },
                ].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{item.label}</p><item.icon className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div>)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Net vs Deduction Percentage</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div key="chart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: `${result.netPercent}%` }} transition={{ duration: 0.6 }} className="h-full bg-emerald-500" /></div>
                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300"><span>Net: {result.netPercent}%</span><span>Deductions: {result.deductionPercent}%</span></div>
                      </motion.div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">Calculate salary to view percentage breakdown.</div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Salary Breakdown Chart</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[{ label: "Gross Salary", value: result?.gross || 0 }, { label: "Taxable Income", value: result?.taxableIncome || 0 }, { label: "Net Salary", value: result?.net || 0 }].map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs text-slate-500"><span>{item.label}</span><span>{formatCurrency(item.value)}</span></div><Progress value={(result?.gross ? (item.value / result.gross) * 100 : 0)} /></div>)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Payroll Insight</CardTitle></CardHeader><CardContent className="text-sm text-slate-600 dark:text-slate-300">Net take-home is {result ? `${result.netPercent}%` : "--"} of gross earnings after deductions.</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Deduction Insight</CardTitle></CardHeader><CardContent className="text-sm text-slate-600 dark:text-slate-300">Current deductions total {formatCurrency(deductions)} per month, useful for payroll forecasting and employee pay transparency.</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">AI Recommendation</CardTitle></CardHeader><CardContent className="text-sm text-slate-600 dark:text-slate-300">Use the yearly toggle and payslip export when reviewing compensation revisions or sharing payroll summaries with employees.</CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Salary Analytics</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Gross to Net Efficiency", value: `${result?.netPercent || 0}%`, icon: PieChart },
                    { label: "Allowance Weight", value: `${Math.round((((hra + bonus) / (basicSalary + hra + bonus)) || 0) * 100)}%`, icon: Sparkles },
                    { label: "Taxable Estimate", value: formatCurrency(result?.taxableIncome || 0), icon: Landmark },
                  ].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{item.label}</p><item.icon className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div>)}
                </CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Payslip Export</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><FileText className="h-4 w-4 text-blue-500" />Payroll document summary</div><p className="text-sm text-slate-600 dark:text-slate-300">Download a simplified payslip summary for payroll reviews, employee self-service, or manager approvals.</p></div><Button onClick={exportPayslip}><Download className="mr-2 h-4 w-4" />Download Payslip</Button></CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SalaryCalculator;
