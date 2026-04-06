import { useState, useEffect } from "react";

export default function InterviewScheduling() {
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