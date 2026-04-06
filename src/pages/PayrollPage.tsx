import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Download, TrendingUp, FileText, Calculator, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

// Type definitions
interface Payslip {
  id: number;
  month: number;
  year: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  status: "paid" | "pending" | string;
}

interface BreakdownItem {
  label: string;
  amount: number;
  type: "earning" | "deduction";
}

interface PayrollStats {
  netPay: number;
  ytd: number;
  deductions: number;
}

interface UserDirectoryItem {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface TaxResult {
  taxableIncome: number;
  tax: number;
  cess: number;
  totalTax: number;
  netIncome: number;
}

interface PayrollUserResponse {
  user: { id: number; fullName: string; email: string; role: string };
  latest_payslip: any | null;
}

export default function PayrollPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [stats, setStats] = useState<PayrollStats>({ netPay: 0, ytd: 0, deductions: 0 });
  const [users, setUsers] = useState<UserDirectoryItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [payrollUser, setPayrollUser] = useState<PayrollUserResponse | null>(null);

  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [annualSalary, setAnnualSalary] = useState<number>(0);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [genMonth, setGenMonth] = useState<number>(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const response = await api.get("/payroll/users");
        const list = response.data?.data || [];
        setUsers(list);
        if (list.length > 0) {
          setSelectedUserId(String(list[0].id));
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  const fetchPayroll = async (userId: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const [userRes, payslipRes, statsRes] = await Promise.all([
        api.get("/payroll/user", { params: { user_id: userId } }),
        api.get("/payroll/payslips", { params: { user_id: userId } }),
        api.get("/payroll/stats", { params: { user_id: userId } }),
      ]);
      setPayrollUser(userRes.data?.data || null);
      setPayslips(payslipRes.data?.data || []);
      setStats(statsRes.data?.data || { netPay: 0, ytd: 0, deductions: 0 });

      const latest = userRes.data?.data?.latest_payslip;
      if (latest?.earnings && latest?.deductions) {
        const earnings: BreakdownItem[] = [
          { label: "Basic", amount: latest.earnings.basic || 0, type: "earning" },
          { label: "HRA", amount: latest.earnings.hra || 0, type: "earning" },
          { label: "Allowances", amount: latest.earnings.allowances || 0, type: "earning" },
          { label: "Bonus", amount: latest.earnings.bonus || 0, type: "earning" },
        ];
        const deductions: BreakdownItem[] = [
          { label: "PF", amount: latest.deductions.pf || 0, type: "deduction" },
          { label: "ESI", amount: latest.deductions.esi || 0, type: "deduction" },
          { label: "TDS", amount: latest.deductions.tds || 0, type: "deduction" },
          { label: "Professional Tax", amount: latest.deductions.professional_tax || 0, type: "deduction" },
          { label: "Other Deductions", amount: latest.deductions.other_deductions || 0, type: "deduction" },
        ];
        setBreakdown([...earnings, ...deductions]);
      } else {
        setBreakdown([]);
      }
    } catch (err) {
      console.error("Error fetching payroll:", err);
      setPayrollUser(null);
      setPayslips([]);
      setStats({ netPay: 0, ytd: 0, deductions: 0 });
      setBreakdown([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPayroll(selectedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleDownload = async (payslip: Payslip) => {
    try {
      setActionLoading(true);
      const response = await api.get(`/payroll/download/${payslip.id}`, { responseType: "blob" });
      downloadBlob(new Blob([response.data]), `payslip-${payslip.month}-${payslip.year}.pdf`);
    } catch (err) {
      console.error("Error downloading payslip:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCalculateTax = async () => {
    try {
      setActionLoading(true);
      const response = await api.post("/payroll/tax/calc", { annual_salary: annualSalary });
      setTaxResult(response.data?.data || null);
    } catch (err) {
      console.error("Tax calc failed:", err);
      setTaxResult(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!selectedUserId) return;
    try {
      setActionLoading(true);
      await api.post("/payroll/generate", {
        user_id: Number(selectedUserId),
        month: genMonth,
        year: genYear,
        status: "pending",
      });
      setGenerateDialogOpen(false);
      await fetchPayroll(selectedUserId);
    } catch (err) {
      console.error("Payslip generation failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const latestLabel = useMemo(() => {
    const latest = payrollUser?.latest_payslip;
    if (!latest?.month || !latest?.year) return "Latest Breakdown";
    return `Breakdown — ${String(latest.month).padStart(2, "0")}/${latest.year}`;
  }, [payrollUser]);

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Payroll</h1>
          <p className="page-subheader">Salary management and payslip history</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="min-w-[260px]">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.fullName} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={!selectedUserId}>
                <Plus className="w-4 h-4 mr-1" /> Generate Payslip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Payslip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Input type="number" min={1} max={12} value={genMonth} onChange={(e) => setGenMonth(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" min={2000} max={2100} value={genYear} onChange={(e) => setGenYear(Number(e.target.value))} />
                  </div>
                </div>
                <Button onClick={() => void handleGeneratePayslip()} className="w-full" disabled={actionLoading}>
                  Generate
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        <Dialog open={taxDialogOpen} onOpenChange={setTaxDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-1" /> Tax Calculator
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tax Calculator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="annual-salary">Annual Salary (₹)</Label>
                <Input
                  id="annual-salary"
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Number(e.target.value))}
                  placeholder="Enter annual salary"
                />
              </div>
                <Button onClick={handleCalculateTax} className="w-full">
                  Calculate
                </Button>
              {taxResult && (
                <div className="mt-4 space-y-2 rounded-lg bg-muted/30 p-4">
                  <p className="text-sm font-medium">Tax Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>Taxable Income:</span>
                    <span className="font-mono">₹{taxResult.taxableIncome.toLocaleString()}</span>
                    <span>Income Tax:</span>
                    <span className="font-mono">₹{taxResult.tax.toLocaleString()}</span>
                    <span>Cess (4%):</span>
                    <span className="font-mono">₹{taxResult.cess.toLocaleString()}</span>
                    <span className="font-semibold">Total Tax:</span>
                    <span className="font-semibold font-mono">₹{taxResult.totalTax.toLocaleString()}</span>
                    <span className="font-semibold">Net Income:</span>
                    <span className="font-semibold font-mono text-success">₹{taxResult.netIncome.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Net Pay (Current)" value={`₹${(stats.netPay || 0).toLocaleString()}`} change="Latest payslip" icon={IndianRupee} />
        <StatCard title="YTD Earnings" value={`₹${(stats.ytd || 0).toLocaleString()}`} changeType="up" change="Year to date" icon={TrendingUp} />
        <StatCard title="Total Deductions" value={`₹${(stats.deductions || 0).toLocaleString()}`} change="Year to date" icon={FileText} />
      </div>

      {/* Salary Breakdown */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">{latestLabel}</h3>
        {breakdown.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payroll generated yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Earnings</p>
                {breakdown
                  .filter((b) => b.type === "earning")
                  .map((b) => (
                    <div key={b.label} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{b.label}</span>
                      <span className="text-sm font-semibold text-success mono-text">₹{b.amount.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Deductions</p>
                {breakdown
                  .filter((b) => b.type === "deduction")
                  .map((b) => (
                    <div key={b.label} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{b.label}</span>
                      <span className="text-sm font-semibold text-destructive mono-text">₹{b.amount.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <span className="font-semibold">Net Pay</span>
              <span className="text-xl font-bold gradient-text mono-text">₹{(stats.netPay || 0).toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Payslip History */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Payslip History</h3>
        <div className="space-y-3">
          {payslips.length === 0 ? <p className="text-sm text-muted-foreground">No payroll generated yet.</p> : null}
          {payslips.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium">{String(p.month).padStart(2, "0")}/{p.year}</span>
              <span className="text-sm text-muted-foreground">Gross: ₹{p.gross_salary.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">Deductions: ₹{p.total_deductions.toLocaleString()}</span>
              <span className="text-sm font-semibold mono-text">₹{p.net_salary.toLocaleString()}</span>
              <Badge
                variant="outline"
                className={`text-xs capitalize ${p.status === "paid" ? "text-success border-success/30" : "text-warning border-warning/30"}`}
              >
                {p.status}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => void handleDownload(p)} disabled={actionLoading}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
