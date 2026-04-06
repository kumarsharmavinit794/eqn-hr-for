import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";

// Define type for employee data
interface Employee {
  id: number;
  name: string;
  role: string;
  dept: string;
  status: "active" | "on-leave" | "remote";
  email: string;
  joined: string;
}

const statusStyle: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  "on-leave": "bg-warning/10 text-warning border-warning/20",
  remote: "bg-info/10 text-info border-info/20",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");

  // Fetch employees on mount
  useEffect(() => {
    api
      .get("/employees")
      .then((res) => {
        console.log("API:", res.data);
        setEmployees(res.data?.data || []);
      })
      .catch(err => console.error("Error fetching employees:", err));
  }, []);

  // Handle adding a new employee (hardcoded example)
  const handleAddEmployee = async () => {
    try {
      await api.post("/employees", {
        name: "New Employee",
        role: "Tester",
        dept: "QA",
        status: "active",
        email: "test@mail.com",
        joined: "2026-01-01"
      });
      // Refresh list
      const res = await api.get("/employees");
      setEmployees(res.data?.data || []);
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee");
    }
  };

  // Handle deleting an employee by id
  const handleDeleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      // Refresh list
      const res = await api.get("/employees");
      setEmployees(res.data?.data || []);
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee");
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-header">Employees</h1>
          <p className="page-subheader">{employees.length} team members across all departments</p>
        </div>
        <Button size="sm" onClick={handleAddEmployee} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-1" /> Add Employee
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table className="min-w-[720px]">
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
            {filteredEmployees.map(emp => (
              <TableRow key={emp.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm whitespace-nowrap">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.role}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{emp.dept}</Badge></TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusStyle[emp.status]} text-xs capitalize`}>
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{emp.joined}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteEmployee(emp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
