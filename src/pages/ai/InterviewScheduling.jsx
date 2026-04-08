import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock3, Filter, LineChart, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function LegacyInterviewScheduling() {
  // Form state
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [duration, setDuration] = useState("60");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [isScheduled, setIsScheduled] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  // Predefined options
  const jobRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
  ];
  const interviewers = [
    "Alice Johnson (Senior Engineer)",
    "Bob Smith (Tech Lead)",
    "Carol Davis (HR Manager)",
    "David Wilson (CTO)",
  ];
  const durations = [
    { label: "30 minutes", value: "30" },
    { label: "60 minutes", value: "60" },
  ];
  const timezonesList = [
    "Asia/Kolkata",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Berlin",
    "Australia/Sydney",
    "Asia/Tokyo",
  ];
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  // Load upcoming interviews from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("upcomingInterviews");
    if (stored) {
      setUpcomingInterviews(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever upcomingInterviews changes
  useEffect(() => {
    localStorage.setItem("upcomingInterviews", JSON.stringify(upcomingInterviews));
  }, [upcomingInterviews]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!candidateName || !candidateEmail || !jobRole || !interviewer || !selectedDate || !selectedTime) {
      setError("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create new interview object
    const newInterview = {
      id: Date.now(),
      candidateName,
      candidateEmail,
      jobRole,
      interviewer,
      duration: durations.find((d) => d.value === duration)?.label,
      date: selectedDate,
      time: selectedTime,
      timezone,
      status: "Scheduled",
    };

    // Add to upcoming interviews list
    setUpcomingInterviews((prev) => [newInterview, ...prev]);

    // Clear form if desired (optional)
    // setCandidateName("");
    // setCandidateEmail("");
    // setJobRole("");
    // setInterviewer("");
    // setSelectedDate("");
    // setSelectedTime("");

    setLoading(false);
    setIsScheduled(true);
    setShowModal(true);

    // Auto-hide success message after 5 seconds
    setTimeout(() => setIsScheduled(false), 5000);
  };

  const cancelInterview = (id) => {
    if (window.confirm("Are you sure you want to cancel this interview?")) {
      setUpcomingInterviews((prev) => prev.filter((interview) => interview.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Interview Scheduling
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scheduling Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Schedule New Interview</h2>

            {isScheduled && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center animate-fadeIn">
                ✅ Interview scheduled successfully! A confirmation email has been sent.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center animate-shake">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSchedule} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Role *</label>
                  <select
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Select role</option>
                    {jobRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer *</label>
                  <select
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Select interviewer</option>
                    {interviewers.map((person) => (
                      <option key={person} value={person}>
                        {person}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {durations.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {timezonesList.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date *</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Scheduling..." : "Schedule Interview"}
              </button>
            </form>
          </div>

          {/* Upcoming Interviews List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Interviews</h2>
            {upcomingInterviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No interviews scheduled yet.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{interview.candidateName}</h3>
                        <p className="text-sm text-gray-600">{interview.jobRole}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          📅 {interview.date} at {interview.time} ({interview.timezone})
                        </p>
                        <p className="text-sm text-gray-500">
                          👤 {interview.interviewer} • ⏱️ {interview.duration}
                        </p>
                      </div>
                      <button
                        onClick={() => cancelInterview(interview.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Interview Scheduled!</h3>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Candidate:</strong> {candidateName}
              </p>
              <p>
                <strong>Email:</strong> {candidateEmail}
              </p>
              <p>
                <strong>Job Role:</strong> {jobRole}
              </p>
              <p>
                <strong>Interviewer:</strong> {interviewer}
              </p>
              <p>
                <strong>Date & Time:</strong> {selectedDate} at {selectedTime} ({timezone})
              </p>
              <p>
                <strong>Duration:</strong> {durations.find((d) => d.value === duration)?.label}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

const InterviewScheduling = () => {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [interviewer, setInterviewer] = useState("");
  const [duration, setDuration] = useState("60");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calendarView, setCalendarView] = useState("week");
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [feedbackInterviewId, setFeedbackInterviewId] = useState("");
  const [feedback, setFeedback] = useState({ technical: 8, communication: 8, problemSolving: 8, recommendation: "Strong Yes", notes: "" });
  const [feedbackMap, setFeedbackMap] = useState({});

  const jobRoles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist", "Product Manager"];
  const interviewers = ["Alice Johnson (Senior Engineer)", "Bob Smith (Tech Lead)", "Carol Davis (HR Manager)", "David Wilson (CTO)"];
  const durations = [{ label: "30 minutes", value: "30" }, { label: "60 minutes", value: "60" }, { label: "90 minutes", value: "90" }];
  const interviewTypes = ["Technical", "HR", "Final Round"];
  const timezonesList = ["Asia/Kolkata", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Australia/Sydney", "Asia/Tokyo"];
  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
  const statuses = ["Scheduled", "Completed", "Cancelled", "Rescheduled"];

  useEffect(() => {
    const stored = localStorage.getItem("interviewDashboardData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUpcomingInterviews(parsed.upcomingInterviews || []);
      setFeedbackMap(parsed.feedbackMap || {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("interviewDashboardData", JSON.stringify({ upcomingInterviews, feedbackMap }));
  }, [upcomingInterviews, feedbackMap]);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !interviewer) return timeSlots;
    const blocked = upcomingInterviews
      .filter((i) => i.interviewer === interviewer && i.date === selectedDate && i.status !== "Cancelled")
      .map((i) => i.time);
    return timeSlots.filter((slot) => !blocked.includes(slot));
  }, [interviewer, selectedDate, upcomingInterviews]);

  const scheduleInterview = async (event) => {
    event.preventDefault();
    setError("");
    if (!candidateName || !candidateEmail || !jobRole || !interviewer || !selectedDate || !selectedTime) {
      setError("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateEmail)) return setError("Please enter a valid email address.");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const interview = {
      id: Date.now(),
      candidateName,
      candidateEmail,
      jobRole,
      interviewType,
      interviewer,
      duration: durations.find((d) => d.value === duration)?.label || "60 minutes",
      date: selectedDate,
      time: selectedTime,
      timezone,
      status: "Scheduled",
      reminders: ["24h reminder", "1h reminder"],
    };
    setUpcomingInterviews((prev) => [interview, ...prev]);
    setLoading(false);
  };

  const updateStatus = (id, status) => setUpcomingInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  const deleteInterview = (id) => setUpcomingInterviews((prev) => prev.filter((i) => i.id !== id));

  const analytics = useMemo(() => {
    const total = upcomingInterviews.length;
    const completed = upcomingInterviews.filter((i) => i.status === "Completed").length;
    const cancelled = upcomingInterviews.filter((i) => i.status === "Cancelled").length;
    const scoreEntries = Object.values(feedbackMap);
    const avgScore = scoreEntries.length
      ? Math.round(scoreEntries.reduce((sum, f) => sum + (f.technical + f.communication + f.problemSolving) / 3, 0) / scoreEntries.length)
      : 0;
    const passRate = scoreEntries.length
      ? Math.round((scoreEntries.filter((f) => f.recommendation === "Strong Yes" || f.recommendation === "Yes").length / scoreEntries.length) * 100)
      : 0;
    return { total, completed, cancelled, avgScore, passRate };
  }, [feedbackMap, upcomingInterviews]);

  const selectedHistory = useMemo(() => {
    if (!candidateEmail) return [];
    return upcomingInterviews.filter((i) => i.candidateEmail === candidateEmail);
  }, [candidateEmail, upcomingInterviews]);

  const submitFeedback = () => {
    if (!feedbackInterviewId) return;
    setFeedbackMap((prev) => ({ ...prev, [feedbackInterviewId]: feedback }));
    updateStatus(Number(feedbackInterviewId), "Completed");
  };

  const selectedFeedback = feedbackInterviewId ? feedbackMap[feedbackInterviewId] : null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Interview Management Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Schedule, track, score, and optimize interviews across your hiring pipeline.</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[{ label: "Total Scheduled", value: analytics.total, icon: CalendarDays }, { label: "Completed", value: analytics.completed, icon: CheckCircle2 }, { label: "Pass Rate", value: `${analytics.passRate}%`, icon: LineChart }, { label: "Avg Interview Score", value: analytics.avgScore, icon: UserCheck }].map((item) => (
            <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div><item.icon className="h-5 w-5 text-slate-500" /></CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="scheduler">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="scheduler" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader><CardTitle className="text-base">Interview Scheduling Form</CardTitle></CardHeader>
              <CardContent>
                {error && <p className="mb-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
                <form onSubmit={scheduleInterview} className="grid gap-3 sm:grid-cols-2">
                  <div><Label>Candidate Name *</Label><Input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} /></div>
                  <div><Label>Candidate Email *</Label><Input type="email" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} /></div>
                  <div><Label>Job Role *</Label><Select value={jobRole} onValueChange={setJobRole}><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent>{jobRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Interview Type</Label><Select value={interviewType} onValueChange={setInterviewType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{interviewTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Interviewer *</Label><Select value={interviewer} onValueChange={setInterviewer}><SelectTrigger><SelectValue placeholder="Select interviewer" /></SelectTrigger><SelectContent>{interviewers.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Duration</Label><Select value={duration} onValueChange={setDuration}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{durations.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Date *</Label><Input type="date" value={selectedDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setSelectedDate(e.target.value)} /></div>
                  <div><Label>Available Time Slots *</Label><Select value={selectedTime} onValueChange={setSelectedTime}><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger><SelectContent>{availableSlots.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Timezone</Label><Select value={timezone} onValueChange={setTimezone}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{timezonesList.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent></Select></div>
                  <div className="sm:col-span-2"><Button type="submit" disabled={loading}>{loading ? "Scheduling..." : "Schedule Interview"}</Button></div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Upcoming Interviews Dashboard</CardTitle></CardHeader><CardContent className="space-y-3">{upcomingInterviews.length === 0 ? <p className="text-sm text-slate-500">No interviews scheduled yet.</p> : upcomingInterviews.map((i) => <motion.div key={i.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-semibold">{i.candidateName} • {i.jobRole}</p><p className="text-xs text-slate-500">{i.interviewType} • {i.interviewer}</p><p className="text-xs text-slate-500">{i.date} {i.time} ({i.timezone}) • {i.duration}</p><div className="mt-1 flex flex-wrap gap-1">{i.reminders.map((r) => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}</div></div><div className="flex gap-2"><Select value={i.status} onValueChange={(v) => updateStatus(i.id, v)}><SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><Button variant="ghost" size="sm" onClick={() => deleteInterview(i.id)}>Remove</Button></div></div></motion.div>)}</CardContent></Card>
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-base">Interview Calendar View</CardTitle><div className="w-[150px]"><Select value={calendarView} onValueChange={setCalendarView}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="day">Day</SelectItem><SelectItem value="week">Week</SelectItem><SelectItem value="month">Month</SelectItem></SelectContent></Select></div></CardHeader><CardContent>{upcomingInterviews.length === 0 ? <p className="text-sm text-slate-500">No events for calendar view.</p> : <div className="space-y-2">{upcomingInterviews.slice(0, calendarView === "day" ? 2 : calendarView === "week" ? 7 : 30).map((i) => <div key={`cal-${i.id}`} className="rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700"><p className="font-medium">{i.candidateName}</p><p className="text-xs text-slate-500">{i.date} • {i.time} • {i.interviewer}</p></div>)}</div>}</CardContent></Card>
          </TabsContent>

          <TabsContent value="pipeline" className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Interview Pipeline Tracker</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{["Application Review", "Technical Interview", "HR Interview", "Final Interview", "Offer"].map((s, idx) => <div key={s} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700"><p className="text-xs text-slate-500">Stage {idx + 1}</p><p className="font-medium">{s}</p></div>)}</CardContent></Card>
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Candidate Interview History</CardTitle></CardHeader><CardContent>{selectedHistory.length === 0 ? <p className="text-sm text-slate-500">Enter candidate email in scheduler to view history.</p> : selectedHistory.map((h) => <div key={`hist-${h.id}`} className="mb-2 rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700"><p>{h.interviewType} — <b>{h.status}</b></p><p className="text-xs text-slate-500">{h.date} {h.time}</p></div>)}</CardContent></Card>
          </TabsContent>

          <TabsContent value="feedback" className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Interview Feedback System</CardTitle></CardHeader><CardContent className="space-y-3"><div><Label>Select Interview</Label><Select value={feedbackInterviewId} onValueChange={setFeedbackInterviewId}><SelectTrigger><SelectValue placeholder="Pick interview" /></SelectTrigger><SelectContent>{upcomingInterviews.map((i) => <SelectItem key={i.id} value={String(i.id)}>{i.candidateName} - {i.jobRole}</SelectItem>)}</SelectContent></Select></div>{["technical", "communication", "problemSolving"].map((k) => <div key={k}><Label className="capitalize">{k} Rating</Label><Input type="number" min={1} max={10} value={feedback[k]} onChange={(e) => setFeedback((prev) => ({ ...prev, [k]: Number(e.target.value) }))} /></div>)}<div><Label>Overall Recommendation</Label><Select value={feedback.recommendation} onValueChange={(v) => setFeedback((prev) => ({ ...prev, recommendation: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Strong Yes", "Yes", "Maybe", "No"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div><div><Label>Notes</Label><Textarea value={feedback.notes} onChange={(e) => setFeedback((prev) => ({ ...prev, notes: e.target.value }))} /></div><Button onClick={submitFeedback}>Submit Feedback</Button></CardContent></Card>
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Interview Scorecard</CardTitle></CardHeader><CardContent className="space-y-3">{selectedFeedback ? <><div><div className="mb-1 flex justify-between text-xs"><span>Technical Skills</span><span>{selectedFeedback.technical}/10</span></div><Progress value={selectedFeedback.technical * 10} /></div><div><div className="mb-1 flex justify-between text-xs"><span>Communication</span><span>{selectedFeedback.communication}/10</span></div><Progress value={selectedFeedback.communication * 10} /></div><div><div className="mb-1 flex justify-between text-xs"><span>Problem Solving</span><span>{selectedFeedback.problemSolving}/10</span></div><Progress value={selectedFeedback.problemSolving * 10} /></div><p className="text-sm">Recommendation: <b>{selectedFeedback.recommendation}</b></p><p className="text-xs text-slate-500">{selectedFeedback.notes || "No notes added."}</p></> : <p className="text-sm text-slate-500">Select an interview and submit feedback to view scorecard.</p>}</CardContent></Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Interview Analytics Dashboard</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs text-slate-500">Total Interviews Scheduled</p><p className="text-2xl font-semibold">{analytics.total}</p></div><div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs text-slate-500">Interviews Completed</p><p className="text-2xl font-semibold">{analytics.completed}</p></div><div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs text-slate-500">Candidate Pass Rate</p><p className="text-2xl font-semibold">{analytics.passRate}%</p></div><div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs text-slate-500">Average Interview Score</p><p className="text-2xl font-semibold">{analytics.avgScore}</p></div></CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewScheduling;
