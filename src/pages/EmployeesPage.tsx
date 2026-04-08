import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import api from "@/lib/api";

type EmployeeStatus = "Active" | "On Leave" | "Remote";

interface Employee {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
  status: EmployeeStatus;
  joined: string;
  location: string;
}

interface EmployeeFormValues {
  name: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
  status: EmployeeStatus;
  joined: string;
  location: string;
}

interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

const statusStyle: Record<EmployeeStatus, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/20 dark:text-emerald-300",
  "On Leave": "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-900/20 dark:text-amber-300",
  Remote: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-900/20 dark:text-blue-300",
};

const departmentOptions = ["Engineering", "HR", "Product", "Sales", "Finance", "Design", "Operations"];
const statusOptions: EmployeeStatus[] = ["Active", "On Leave", "Remote"];

const emptyEmployeeForm: EmployeeFormValues = {
  name: "",
  email: "",
  phone: "",
  role: "",
  dept: "",
  status: "Active",
  joined: "",
  location: "",
};

const mockEmployees: Employee[] = [
  { id: "EMP-1001", name: "Priya Sharma", email: "priya.sharma@eqnhr.com", phone: "+91 98765 10001", role: "Frontend Engineer", dept: "Engineering", status: "Active", joined: "2024-05-10", location: "Bengaluru" },
  { id: "EMP-1002", name: "Rahul Kumar", email: "rahul.kumar@eqnhr.com", phone: "+91 98765 10002", role: "Product Manager", dept: "Product", status: "Active", joined: "2023-11-21", location: "Gurugram" },
  { id: "EMP-1003", name: "Anjali Mehta", email: "anjali.mehta@eqnhr.com", phone: "+91 98765 10003", role: "UI/UX Designer", dept: "Design", status: "Remote", joined: "2025-01-08", location: "Pune" },
  { id: "EMP-1004", name: "Vikram Singh", email: "vikram.singh@eqnhr.com", phone: "+91 98765 10004", role: "Regional Sales Manager", dept: "Sales", status: "Active", joined: "2022-09-03", location: "Mumbai" },
  { id: "EMP-1005", name: "Neha Patel", email: "neha.patel@eqnhr.com", phone: "+91 98765 10005", role: "HR Business Partner", dept: "HR", status: "On Leave", joined: "2023-02-14", location: "Ahmedabad" },
  { id: "EMP-1006", name: "Arjun Verma", email: "arjun.verma@eqnhr.com", phone: "+91 98765 10006", role: "Backend Engineer", dept: "Engineering", status: "Active", joined: "2024-07-01", location: "Noida" },
  { id: "EMP-1007", name: "Kavya Nair", email: "kavya.nair@eqnhr.com", phone: "+91 98765 10007", role: "Finance Analyst", dept: "Finance", status: "Remote", joined: "2024-04-18", location: "Kochi" },
  { id: "EMP-1008", name: "Rohan Iyer", email: "rohan.iyer@eqnhr.com", phone: "+91 98765 10008", role: "DevOps Engineer", dept: "Engineering", status: "Active", joined: "2023-12-04", location: "Hyderabad" },
  { id: "EMP-1009", name: "Sneha Gupta", email: "sneha.gupta@eqnhr.com", phone: "+91 98765 10009", role: "Product Analyst", dept: "Product", status: "Active", joined: "2025-03-19", location: "Delhi" },
  { id: "EMP-1010", name: "Manish Kulkarni", email: "manish.kulkarni@eqnhr.com", phone: "+91 98765 10010", role: "Sales Executive", dept: "Sales", status: "On Leave", joined: "2022-06-11", location: "Nagpur" },
  { id: "EMP-1011", name: "Pooja Desai", email: "pooja.desai@eqnhr.com", phone: "+91 98765 10011", role: "Talent Acquisition Lead", dept: "HR", status: "Active", joined: "2023-08-29", location: "Surat" },
  { id: "EMP-1012", name: "Nitin Bhatia", email: "nitin.bhatia@eqnhr.com", phone: "+91 98765 10012", role: "QA Engineer", dept: "Engineering", status: "Remote", joined: "2024-10-12", location: "Chandigarh" },
  { id: "EMP-1013", name: "Isha Kapoor", email: "isha.kapoor@eqnhr.com", phone: "+91 98765 10013", role: "Finance Controller", dept: "Finance", status: "Active", joined: "2021-11-08", location: "Mumbai" },
  { id: "EMP-1014", name: "Devansh Joshi", email: "devansh.joshi@eqnhr.com", phone: "+91 98765 10014", role: "Operations Manager", dept: "Operations", status: "Active", joined: "2022-12-20", location: "Jaipur" },
  { id: "EMP-1015", name: "Ritika Bose", email: "ritika.bose@eqnhr.com", phone: "+91 98765 10015", role: "Product Designer", dept: "Design", status: "On Leave", joined: "2024-02-26", location: "Kolkata" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeStatus(rawStatus: unknown): EmployeeStatus {
  const value = String(rawStatus || "").trim().toLowerCase();
  if (value === "on-leave" || value === "on leave") return "On Leave";
  if (value === "remote") return "Remote";
  return "Active";
}

function normalizeEmployee(raw: Partial<Employee>, index: number): Employee {
  return {
    id: raw.id ?? `EMP-MOCK-${index + 1}`,
    name: raw.name || "Unknown Employee",
    email: raw.email || "not.available@eqnhr.com",
    phone: raw.phone || "-",
    role: raw.role || "Unassigned",
    dept: raw.dept || "Operations",
    status: normalizeStatus(raw.status),
    joined: raw.joined || "2026-01-01",
    location: raw.location || "India",
  };
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [form, setForm] = useState<EmployeeFormValues>(emptyEmployeeForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EmployeeFormValues, string>>>({});
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  const showToast = (type: "success" | "error", message: string) => {
    const id = toastCounter + 1;
    setToastCounter(id);
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3500);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employees");
      const payload = res.data as { data?: unknown };
      const rawList = Array.isArray(payload?.data) ? payload.data : Array.isArray(res.data) ? res.data : [];
      const normalized = rawList.map((emp, index) => normalizeEmployee(emp as Partial<Employee>, index));
      if (normalized.length > 0) {
        setEmployees(normalized);
        setUsingMockData(false);
      } else {
        setEmployees(mockEmployees);
        setUsingMockData(true);
      }
    } catch {
      setEmployees(mockEmployees);
      setUsingMockData(true);
      showToast("error", "API unavailable. Showing local mock employee data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEmployees();
  }, []);

  const resetForm = () => {
    setForm(emptyEmployeeForm);
    setFormErrors({});
    setEditingEmployee(null);
  };

  const openAddModal = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      dept: employee.dept,
      status: employee.status,
      joined: employee.joined,
      location: employee.location,
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const setField = (field: keyof EmployeeFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof EmployeeFormValues, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.role.trim()) nextErrors.role = "Role is required.";
    if (!form.dept.trim()) nextErrors.dept = "Department is required.";
    if (!form.joined.trim()) nextErrors.joined = "Joining date is required.";
    if (!form.location.trim()) nextErrors.location = "Location is required.";
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;
    setSubmittingForm(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role.trim(),
      dept: form.dept,
      status: form.status,
      joined: form.joined,
      location: form.location.trim(),
    };

    try {
      if (editingEmployee) {
        if (usingMockData) {
          setEmployees((prev) =>
            prev.map((employee) => (employee.id === editingEmployee.id ? { ...employee, ...payload } : employee))
          );
          if (selectedEmployee?.id === editingEmployee.id) {
            setSelectedEmployee((prev) => (prev ? { ...prev, ...payload } : prev));
          }
        } else {
          await api.put(`/employees/${editingEmployee.id}`, payload);
          await fetchEmployees();
        }
        showToast("success", "Employee updated successfully");
      } else {
        if (usingMockData) {
          const newEmployee: Employee = {
            id: `EMP-${Math.floor(2000 + Math.random() * 7000)}`,
            ...payload,
          };
          setEmployees((prev) => [newEmployee, ...prev]);
        } else {
          await api.post("/employees", payload);
          await fetchEmployees();
        }
        showToast("success", "Employee added successfully");
      }

      setFormOpen(false);
      resetForm();
    } catch {
      showToast("error", editingEmployee ? "Failed to update employee" : "Failed to add employee");
    } finally {
      setSubmittingForm(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (usingMockData) {
        setEmployees((prev) => prev.filter((employee) => employee.id !== deleteTarget.id));
      } else {
        await api.delete(`/employees/${deleteTarget.id}`);
        await fetchEmployees();
      }
      if (selectedEmployee?.id === deleteTarget.id) {
        setSelectedEmployee(null);
        setProfileOpen(false);
      }
      showToast("success", "Employee deleted successfully");
      setDeleteTarget(null);
    } catch {
      showToast("error", "Failed to delete employee");
    } finally {
      setDeleting(false);
    }
  };

  const employeeCounts = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((employee) => employee.status === "Active").length;
    const onLeave = employees.filter((employee) => employee.status === "On Leave").length;
    const remote = employees.filter((employee) => employee.status === "Remote").length;
    return { total, active, onLeave, remote };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.dept.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query);
      const matchesDepartment = departmentFilter === "all" || employee.dept === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, departmentFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AnimatePresence>
        {toasts.map((toastItem) => (
          <motion.div
            key={toastItem.id}
            initial={{ opacity: 0, x: 90, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 90, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            className={`fixed right-4 top-4 z-[9999] flex min-w-[280px] items-start gap-3 rounded-xl border px-4 py-3 shadow-xl ${
              toastItem.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/80 dark:text-red-300"
            }`}
          >
            <div className="flex-1 text-sm font-medium">{toastItem.message}</div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toastItem.id))}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="page-header dark:text-slate-100">Employees</h1>
          <p className="page-subheader">
            {employeeCounts.total} team members across all departments
            {usingMockData ? " (local mock dataset)" : ""}
          </p>
        </div>
        <Button size="sm" onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className="mr-1 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Employees", value: employeeCounts.total, tone: "text-blue-600 dark:text-blue-300", icon: Users },
          { label: "Active", value: employeeCounts.active, tone: "text-emerald-600 dark:text-emerald-300", icon: Building2 },
          { label: "On Leave", value: employeeCounts.onLeave, tone: "text-amber-600 dark:text-amber-300", icon: CalendarDays },
          { label: "Remote", value: employeeCounts.remote, tone: "text-blue-600 dark:text-blue-300", icon: MapPin },
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className={`mt-2 text-2xl font-semibold ${stat.tone}`}>{stat.value}</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800">
                  <stat.icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 lg:grid-cols-[minmax(0,1fr)_260px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, department, email"
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departmentOptions.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredEmployees.length}</span> employees
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-0">
          <div className="max-h-[620px] overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      Loading employees...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      No employees found for the current search and filter.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <motion.tr
                      key={employee.id}
                      whileHover={{ backgroundColor: "rgba(148, 163, 184, 0.08)" }}
                      transition={{ duration: 0.18 }}
                      className="cursor-pointer border-b border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setProfileOpen(true);
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">{employee.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{employee.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="dark:bg-slate-800 dark:text-slate-200">
                          {employee.dept}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={statusStyle[employee.status]}>
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{employee.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEditModal(employee);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                            onClick={(event) => {
                              event.stopPropagation();
                              setDeleteTarget(employee);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="dark:text-slate-100">{editingEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Priya Sharma" />
              {formErrors.name && <p className="text-xs text-red-600">{formErrors.name}</p>}
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@company.com" />
              {formErrors.email && <p className="text-xs text-red-600">{formErrors.email}</p>}
            </div>
            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 98765 43210" />
              {formErrors.phone && <p className="text-xs text-red-600">{formErrors.phone}</p>}
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Input value={form.role} onChange={(e) => setField("role", e.target.value)} placeholder="e.g. Product Manager" />
              {formErrors.role && <p className="text-xs text-red-600">{formErrors.role}</p>}
            </div>
            <div className="space-y-1">
              <Label>Department</Label>
              <Select value={form.dept} onValueChange={(value) => setField("dept", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.dept && <p className="text-xs text-red-600">{formErrors.dept}</p>}
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value: EmployeeStatus) => setField("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Joining Date</Label>
              <Input type="date" value={form.joined} onChange={(e) => setField("joined", e.target.value)} />
              {formErrors.joined && <p className="text-xs text-red-600">{formErrors.joined}</p>}
            </div>
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="e.g. Bengaluru" />
              {formErrors.location && <p className="text-xs text-red-600">{formErrors.location}</p>}
            </div>
            <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setFormOpen(false)} disabled={submittingForm}>
                Cancel
              </Button>
              <Button onClick={handleFormSubmit} disabled={submittingForm}>
                {submittingForm ? "Saving..." : editingEmployee ? "Update Employee" : "Add Employee"}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Sheet
        open={profileOpen}
        onOpenChange={(open) => {
          setProfileOpen(open);
          if (!open) setSelectedEmployee(null);
        }}
      >
        <SheetContent className="w-full border-slate-200 bg-white p-0 sm:max-w-md dark:border-slate-700 dark:bg-slate-900">
          {selectedEmployee && (
            <div className="flex h-full flex-col">
              <SheetHeader className="border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                <SheetTitle className="text-left dark:text-slate-100">Employee Profile</SheetTitle>
              </SheetHeader>
              <div className="flex-1 space-y-5 overflow-auto px-6 py-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-slate-900 text-sm font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
                      {getInitials(selectedEmployee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedEmployee.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.role}</p>
                  </div>
                </div>

                <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{selectedEmployee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{selectedEmployee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Department</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{selectedEmployee.dept}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{selectedEmployee.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Joining Date</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{selectedEmployee.joined}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Status</p>
                    <Badge variant="outline" className={statusStyle[selectedEmployee.status]}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
                <Button
                  className="flex-1"
                  onClick={() => {
                    openEditModal(selectedEmployee);
                    setProfileOpen(false);
                  }}
                >
                  <Pencil className="mr-1 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setDeleteTarget(selectedEmployee)}>
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-slate-100">Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Employee"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
