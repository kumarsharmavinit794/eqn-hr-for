import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const trackedEmployeeId = "EMP-1042";

const initialLog = [
  { id: "EMP-1042", name: "Priya Sharma", department: "Engineering", role: "Frontend Engineer", shift: "9:30 AM - 6:30 PM", checkIn: "9:28 AM", checkOut: "-", status: "Present" },
  { id: "EMP-2031", name: "Rahul Kumar", department: "Product", role: "Product Manager", shift: "10:00 AM - 7:00 PM", checkIn: "9:45 AM", checkOut: "-", status: "Present" },
  { id: "EMP-3017", name: "Anjali Mehta", department: "Design", role: "Senior Product Designer", shift: "9:30 AM - 6:30 PM", checkIn: "-", checkOut: "-", status: "Absent" },
  { id: "EMP-4008", name: "Vikram Singh", department: "Sales", role: "Sales Executive", shift: "9:30 AM - 6:30 PM", checkIn: "10:02 AM", checkOut: "6:31 PM", status: "Checked Out" },
  { id: "EMP-5023", name: "Neha Patel", department: "HR", role: "HR Business Partner", shift: "9:30 AM - 6:30 PM", checkIn: "9:30 AM", checkOut: "-", status: "Present" },
  { id: "EMP-6145", name: "Arjun Verma", department: "Engineering", role: "Backend Engineer", shift: "9:30 AM - 6:30 PM", checkIn: "9:39 AM", checkOut: "-", status: "Late" },
  { id: "EMP-7094", name: "Kavya Nair", department: "Finance", role: "Finance Analyst", shift: "9:00 AM - 6:00 PM", checkIn: "8:57 AM", checkOut: "-", status: "Present" },
  { id: "EMP-8109", name: "Rohan Iyer", department: "Engineering", role: "DevOps Engineer", shift: "10:00 AM - 7:00 PM", checkIn: "10:11 AM", checkOut: "-", status: "Late" },
  { id: "EMP-9204", name: "Sneha Gupta", department: "Product", role: "Product Analyst", shift: "9:30 AM - 6:30 PM", checkIn: "9:33 AM", checkOut: "-", status: "Present" },
  { id: "EMP-1033", name: "Manish Kulkarni", department: "Sales", role: "Regional Sales Manager", shift: "9:30 AM - 6:30 PM", checkIn: "-", checkOut: "-", status: "Absent" },
  { id: "EMP-1178", name: "Pooja Desai", department: "HR", role: "Talent Acquisition Lead", shift: "9:30 AM - 6:30 PM", checkIn: "9:26 AM", checkOut: "-", status: "Present" },
  { id: "EMP-1286", name: "Nitin Bhatia", department: "Engineering", role: "QA Engineer", shift: "9:30 AM - 6:30 PM", checkIn: "9:48 AM", checkOut: "-", status: "Late" },
  { id: "EMP-1392", name: "Isha Malhotra", department: "Design", role: "UX Researcher", shift: "9:30 AM - 6:30 PM", checkIn: "9:36 AM", checkOut: "-", status: "Present" },
  { id: "EMP-1474", name: "Saurabh Jain", department: "Finance", role: "Accounts Manager", shift: "9:00 AM - 6:00 PM", checkIn: "9:18 AM", checkOut: "-", status: "Late" },
  { id: "EMP-1588", name: "Meera Reddy", department: "Sales", role: "Account Executive", shift: "10:00 AM - 7:00 PM", checkIn: "-", checkOut: "-", status: "Absent" },
];

function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function AnimatedCount({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 700;
    const start = performance.now();
    let frame = 0;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

export default function FaceAttendancePage() {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState(initialLog);
  const [toast, setToast] = useState({ type: "success", message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [faceDetected, setFaceDetected] = useState(false);
  const [verificationState, setVerificationState] = useState("idle");
  const [lastScanTime, setLastScanTime] = useState("-");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setFaceDetected(false);
      setVerificationState("idle");
      setLastScanTime(getCurrentTime());
    } catch (error) {
      alert("Camera access denied.");
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    setCameraOn(false);
    setIsMarkingAttendance(false);
    setFaceDetected(false);
    setVerificationState("idle");
  };

  const handleMarkAttendance = () => {
    if (!cameraOn) return;
    setIsMarkingAttendance(true);
    setVerificationState("verifying");

    window.setTimeout(() => {
      const currentTime = getCurrentTime();
      const recognized = Math.random() > 0.12;

      if (!recognized) {
        setVerificationState("error");
        setLastScanTime(currentTime);
        setToast({ type: "error", message: "Face not recognized. Please adjust position and try again." });
        setIsMarkingAttendance(false);
        window.setTimeout(() => setToast({ type: "success", message: "" }), 3500);
        return;
      }

      setAttendanceLog((prev) =>
        prev.map((entry) =>
          entry.id === trackedEmployeeId
            ? { ...entry, checkIn: currentTime, status: "Present" }
            : entry
        )
      );
      setVerificationState("recorded");
      setLastScanTime(currentTime);
      setToast({ type: "success", message: `Attendance marked for Priya Sharma at ${currentTime}` });
      setIsMarkingAttendance(false);
      window.setTimeout(() => setToast({ type: "success", message: "" }), 3500);
    }, 2000);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (!cameraOn) return;
    const timer = window.setTimeout(() => {
      setFaceDetected(true);
      if (verificationState === "idle") {
        setVerificationState("matched");
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [cameraOn, verificationState]);

  const trackedEmployee = useMemo(
    () => attendanceLog.find((entry) => entry.id === trackedEmployeeId) || initialLog[0],
    [attendanceLog]
  );

  const stats = useMemo(() => {
    const totalEmployees = attendanceLog.length;
    const presentToday = attendanceLog.filter((entry) => entry.status !== "Absent").length;
    const absent = totalEmployees - presentToday;
    const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

    return { totalEmployees, presentToday, absent, attendanceRate };
  }, [attendanceLog]);

  const departmentOptions = useMemo(
    () => ["all", ...Array.from(new Set(attendanceLog.map((entry) => entry.department.toLowerCase())))],
    [attendanceLog]
  );

  const filteredLog = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return attendanceLog.filter((entry) => {
      const matchesQuery =
        !query ||
        entry.name.toLowerCase().includes(query) ||
        entry.id.toLowerCase().includes(query) ||
        entry.role.toLowerCase().includes(query);
      const matchesDepartment = departmentFilter === "all" || entry.department.toLowerCase() === departmentFilter;
      return matchesQuery && matchesDepartment;
    });
  }, [attendanceLog, searchTerm, departmentFilter]);

  const verificationLabel = {
    idle: "Ready to Verify",
    matched: "Matched with Employee",
    verifying: "Verifying...",
    recorded: "Attendance Recorded",
    error: "Verification Failed",
  };

  const verificationTone = {
    idle: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    matched: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    verifying: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    recorded: "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300",
    error: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  };

  return (
    <div className="min-h-[80vh] space-y-8 bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={`fixed right-4 top-4 z-[9999] flex w-80 items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm ${
              toast.type === "success"
                ? "border-green-200 bg-white dark:border-green-900/70 dark:bg-slate-900"
                : "border-red-200 bg-white dark:border-red-900/70 dark:bg-slate-900"
            }`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                toast.type === "success" ? "bg-green-100 dark:bg-green-900/40" : "bg-red-100 dark:bg-red-900/40"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.type === "success" ? "Attendance Marked" : "Verification Error"}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast({ type: "success", message: "" })}
              className="mt-0.5 shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3.5, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-green-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-100">Face Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Secure facial attendance verification with a real-time monitoring view and daily attendance insights.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Employees", value: stats.totalEmployees, icon: Users, tone: "bg-blue-50 text-blue-600" },
            { label: "Present Today", value: stats.presentToday, icon: CheckCircle, tone: "bg-green-50 text-green-600" },
            { label: "Absent", value: stats.absent, icon: X, tone: "bg-red-50 text-red-600" },
            { label: "Attendance Rate", value: stats.attendanceRate, icon: Clock, tone: "bg-amber-50 text-amber-600", suffix: "%" },
          ].map((stat) => (
            <motion.div key={stat.label} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-slate-100">
                      {typeof stat.value === "number" ? <AnimatedCount value={stat.value} suffix={stat.suffix || ""} /> : stat.value}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Employee Verification</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-100">{trackedEmployee.name}</h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <ShieldCheck className="h-7 w-7" />
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span className={`h-2 w-2 rounded-full ${cameraOn ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className="font-medium">Live Camera Status:</span>
              <span>{cameraOn ? "Active" : "Offline"}</span>
              <span className="ml-auto font-medium">Last scan: {lastScanTime}</span>
            </div>

            <div className="mb-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:grid-cols-2">
              <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-semibold text-white">
                  {getInitials(trackedEmployee.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{trackedEmployee.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{trackedEmployee.role}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Employee ID</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{trackedEmployee.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Department</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{trackedEmployee.department}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Role</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{trackedEmployee.role}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Shift</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{trackedEmployee.shift}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Last check-in</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{trackedEmployee.checkIn}</p>
              </div>
            </div>

            {cameraOn ? (
              <div className="mb-5 relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="aspect-video w-full rounded-2xl border border-slate-200 bg-slate-950 object-cover brightness-[1.08] contrast-[1.08] dark:border-slate-700"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-black/15 dark:to-black/35" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-emerald-300/90 shadow-[0_0_24px_rgba(16,185,129,0.45)]" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-green-400 animate-pulse shadow-[0_0_30px_rgba(34,197,94,0.35)]" />
                <motion.div
                  initial={{ y: "5%" }}
                  animate={{ y: "90%" }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "linear" }}
                  className="pointer-events-none absolute left-6 right-6 h-[2px] bg-emerald-300/80 shadow-[0_0_16px_rgba(16,185,129,0.8)]"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-green-500/90 px-2 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" /> Scanning for face...
                </div>
                {faceDetected && (
                  <>
                    <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs text-white">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        {getInitials(trackedEmployee.name)}
                      </div>
                      Face detected: {trackedEmployee.name}
                    </div>
                    <div className="absolute bottom-3 left-3 rounded-full bg-emerald-600/90 px-2 py-1 text-xs font-semibold text-white">
                      Matched with employee
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mb-5 flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-300">
                  <Camera className="h-8 w-8" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Camera preview is offline</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enable the camera to begin identity verification and mark attendance.</p>
                </div>
              </div>
            )}

            <div className={`mb-4 rounded-xl border px-3 py-2 text-sm font-medium ${verificationTone[verificationState]}`}>
              {verificationLabel[verificationState]}
            </div>

            <div className="flex flex-wrap gap-3">
              {!cameraOn ? (
                <Button onClick={startCamera} className="h-11 gap-2">
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button onClick={handleMarkAttendance} disabled={isMarkingAttendance} className="h-11 gap-2 bg-emerald-600 hover:bg-emerald-700">
                    {isMarkingAttendance ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Mark Attendance
                      </>
                    )}
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="h-11 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    Stop Camera
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <CardContent className="p-0">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Today's Attendance Log</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Live attendance overview for the current shift window.</p>
                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by employee name, id, or role"
                      className="pl-9 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="w-full md:w-56">
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departmentOptions.filter((d) => d !== "all").map((department) => (
                          <SelectItem key={department} value={department}>
                            {department[0].toUpperCase() + department.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="max-h-[460px] overflow-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Employee ID</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Department</th>
                      <th className="px-6 py-4 font-medium">Check-In</th>
                      <th className="px-6 py-4 font-medium">Check-Out</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLog.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-t border-slate-200 text-slate-700 transition-colors hover:bg-slate-50/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/80"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{entry.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-700">
                              {getInitials(entry.name)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">{entry.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{entry.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{entry.department}</td>
                        <td className="px-6 py-4">{entry.checkIn}</td>
                        <td className="px-6 py-4">{entry.checkOut}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={
                              entry.status === "Present"
                                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                                : entry.status === "Late"
                                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                                  : entry.status === "Checked Out"
                                    ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            }
                          >
                            {entry.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {filteredLog.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                          No employees match your current search and filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
