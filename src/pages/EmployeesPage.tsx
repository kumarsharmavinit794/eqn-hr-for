import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const employees = [
  { id: 1, name: "Alice Wang", role: "Engineering Manager", dept: "Engineering", status: "active", email: "alice@nexahr.com", joined: "2022-03-15" },
  { id: 2, name: "Bob Smith", role: "Product Designer", dept: "Design", status: "active", email: "bob@nexahr.com", joined: "2023-01-20" },
  { id: 3, name: "Carol Martinez", role: "Marketing Lead", dept: "Marketing", status: "on-leave", email: "carol@nexahr.com", joined: "2021-07-10" },
  { id: 4, name: "David Kim", role: "Sales Executive", dept: "Sales", status: "active", email: "david@nexahr.com", joined: "2023-06-01" },
  { id: 5, name: "Eva Brown", role: "HR Specialist", dept: "HR", status: "active", email: "eva@nexahr.com", joined: "2022-11-15" },
  { id: 6, name: "Frank Lee", role: "DevOps Engineer", dept: "Engineering", status: "remote", email: "frank@nexahr.com", joined: "2023-02-28" },
  { id: 7, name: "Grace Taylor", role: "Data Analyst", dept: "Engineering", status: "active", email: "grace@nexahr.com", joined: "2023-09-10" },
];

const statusStyle: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  "on-leave": "bg-warning/10 text-warning border-warning/20",
  remote: "bg-info/10 text-info border-info/20",
};

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Employees</h1>
          <p className="page-subheader">{employees.length} team members across all departments</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Employee</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp, i) => (
              <TableRow key={emp.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{emp.dept}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={`${statusStyle[emp.status]} text-xs capitalize`}>{emp.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{emp.joined}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
