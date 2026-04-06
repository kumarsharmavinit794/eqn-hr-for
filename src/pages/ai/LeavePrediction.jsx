import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Percent,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Flame,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function LeavePrediction() {
  const [employeeName, setEmployeeName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [performance, setPerformance] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculateRisk = () => {
    // Convert inputs to numbers
    const attendancePercent = parseFloat(attendance);
    const hours = parseFloat(workHours);

    // Validation
    if (
      !employeeName.trim() ||
      isNaN(attendancePercent) ||
      !performance ||
      isNaN(hours)
    ) {
      return null;
    }

    // Score components: lower score = lower risk
    let attendanceScore = 0;
    if (attendancePercent < 80) attendanceScore = 3;
    else if (attendancePercent < 90) attendanceScore = 2;
    else attendanceScore = 1;

    let performanceScore = 0;
    if (performance === "Low") performanceScore = 3;
    else if (performance === "Medium") performanceScore = 2;
    else performanceScore = 1;

    let hoursScore = 0;
    if (hours < 35) hoursScore = 2; // low hours might indicate disengagement
    else if (hours <= 45) hoursScore = 1;
    else hoursScore = 2; // overwork can lead to burnout

    const totalScore = attendanceScore + performanceScore + hoursScore;
    const maxScore = 7;
    let probability = (totalScore / maxScore) * 100;
    // Ensure probability is between 5% and 95%
    probability = Math.min(95, Math.max(5, Math.round(probability)));

    let riskLevel = "";
    let riskColor = "";
    let riskIcon = null;
    let recommendation = "";

    if (probability < 30) {
      riskLevel = "Low";
      riskColor = "text-green-600 bg-green-50 border-green-200";
      riskIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
      recommendation =
        "Employee shows strong engagement. Maintain regular feedback and growth opportunities.";
    } else if (probability < 70) {
      riskLevel = "Medium";
      riskColor = "text-yellow-600 bg-yellow-50 border-yellow-200";
      riskIcon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      recommendation =
        "Moderate leave risk. Consider one-on-one check-ins and workload assessment.";
    } else {
      riskLevel = "High";
      riskColor = "text-red-600 bg-red-50 border-red-200";
      riskIcon = <Flame className="h-5 w-5 text-red-500" />;
      recommendation =
        "High leave risk. Immediate attention needed: review workload, engagement, and well-being.";
    }

    return {
      probability,
      riskLevel,
      riskColor,
      riskIcon,
      recommendation,
      attendanceScore,
      performanceScore,
      hoursScore,
    };
  };

  const handlePredict = async () => {
    setLoading(true);
    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));
    const prediction = calculateRisk();
    setResult(prediction);
    setLoading(false);
  };

  const handleReset = () => {
    setEmployeeName("");
    setAttendance("");
    setPerformance("");
    setWorkHours("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7 text-white" />
            <h1 className="text-2xl font-bold text-white">
              Leave Risk Predictor
            </h1>
          </div>
          <p className="text-indigo-100 text-sm mt-1">
            AI-powered analysis to predict employee leave probability
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          {/* Form */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" /> Employee Name
                </label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Percent className="inline h-4 w-4 mr-1" /> Attendance (%)
                </label>
                <input
                  type="number"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  placeholder="e.g., 85"
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Star className="inline h-4 w-4 mr-1" /> Performance Rating
                </label>
                <select
                  value={performance}
                  onChange={(e) => setPerformance(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                >
                  <option value="">Select rating</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" /> Work Hours / Week
                </label>
                <input
                  type="number"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  placeholder="e.g., 40"
                  min="0"
                  max="80"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict}
                disabled={
                  loading ||
                  !employeeName.trim() ||
                  !attendance ||
                  !performance ||
                  !workHours
                }
                className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                  loading ||
                  !employeeName.trim() ||
                  !attendance ||
                  !performance ||
                  !workHours
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    Predict Leave Risk
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </motion.button>
            </div>
          </div>

          {/* Result Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div
                  className={`rounded-xl border p-5 ${result.riskColor} bg-opacity-30`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {result.riskIcon}
                      <h3 className="text-lg font-semibold">
                        Risk Level: {result.riskLevel}
                      </h3>
                    </div>
                    <span className="text-2xl font-bold">
                      {result.probability}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probability}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          result.probability < 30
                            ? "bg-green-500"
                            : result.probability < 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium">Recommendation</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {result.recommendation}
                    </p>
                  </div>

                  {/* Optional: Breakdown */}
                  <details className="mt-3 text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-700">
                      Show risk factors
                    </summary>
                    <div className="mt-2 space-y-1">
                      <p>Attendance score: {result.attendanceScore}/3</p>
                      <p>Performance score: {result.performanceScore}/3</p>
                      <p>Work hours score: {result.hoursScore}/1</p>
                    </div>
                  </details>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}