import { motion } from "framer-motion";
import { DollarSign, Download, TrendingUp, FileText, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";

const payslips = [
  { month: "March 2026", gross: "$12,500", deductions: "$3,200", net: "$9,300", status: "pending" },
  { month: "February 2026", gross: "$12,500", deductions: "$3,200", net: "$9,300", status: "paid" },
  { month: "January 2026", gross: "$12,500", deductions: "$3,150", net: "$9,350", status: "paid" },
  { month: "December 2025", gross: "$13,000", deductions: "$3,400", net: "$9,600", status: "paid" },
];

const breakdown = [
  { label: "Base Salary", amount: "$10,000", type: "earning" },
  { label: "Performance Bonus", amount: "$1,500", type: "earning" },
  { label: "Housing Allowance", amount: "$1,000", type: "earning" },
  { label: "Federal Tax", amount: "-$2,100", type: "deduction" },
  { label: "Health Insurance", amount: "-$650", type: "deduction" },
  { label: "Retirement (401k)", amount: "-$450", type: "deduction" },
];

export default function PayrollPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Payroll</h1>
          <p className="page-subheader">Salary management and payslip history</p>
        </div>
        <Button variant="outline" size="sm"><Calculator className="w-4 h-4 mr-1" /> Tax Calculator</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Net Pay (Current)" value="$9,300" change="Pending for March" icon={DollarSign} />
        <StatCard title="YTD Earnings" value="$28,150" change="+8.3% vs last year" changeType="up" icon={TrendingUp} />
        <StatCard title="Total Deductions" value="$9,550" change="YTD" icon={FileText} />
      </div>

      {/* Salary Breakdown */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">March 2026 Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Earnings</p>
            {breakdown.filter(b => b.type === "earning").map(b => (
              <div key={b.label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{b.label}</span>
                <span className="text-sm font-semibold text-success mono-text">{b.amount}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Deductions</p>
            {breakdown.filter(b => b.type === "deduction").map(b => (
              <div key={b.label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{b.label}</span>
                <span className="text-sm font-semibold text-destructive mono-text">{b.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <span className="font-semibold">Net Pay</span>
          <span className="text-xl font-bold gradient-text mono-text">$9,300.00</span>
        </div>
      </div>

      {/* Payslip History */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Payslip History</h3>
        <div className="space-y-3">
          {payslips.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium">{p.month}</span>
              <span className="text-sm text-muted-foreground">Gross: {p.gross}</span>
              <span className="text-sm text-muted-foreground">Deductions: {p.deductions}</span>
              <span className="text-sm font-semibold mono-text">{p.net}</span>
              <Badge variant="outline" className={`text-xs capitalize ${p.status === "paid" ? "text-success border-success/30" : "text-warning border-warning/30"}`}>{p.status}</Badge>
              <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
