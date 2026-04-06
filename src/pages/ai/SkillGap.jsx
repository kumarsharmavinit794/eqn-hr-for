import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Code,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  X,
  Plus,
  RefreshCw,
  Zap,
  BookOpen,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SkillGapAnalysis() {
  // Form state
  const [employeeName, setEmployeeName] = useState("");
  const [currentSkills, setCurrentSkills] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [skillInputType, setSkillInputType] = useState("current"); // 'current' or 'required'
  const [error, setError] = useState("");

  // Predefined skill suggestions for autocomplete
  const skillSuggestions = [
    "React",
    "JavaScript",
    "TypeScript",
    "Python",
    "Node.js",
    "Java",
    "SQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "Tailwind CSS",
    "Next.js",
    "Vue.js",
  ];

  // Course recommendations mapping for missing skills
  const courseRecommendations = {
    React: "React Official Tutorial (react.dev)",
    JavaScript: "Modern JavaScript from The Odin Project",
    TypeScript: "TypeScript Handbook",
    Python: "Python for Everybody (Coursera)",
    "Node.js": "Node.js Crash Course (YouTube)",
    Java: "Java Programming Masterclass (Udemy)",
    SQL: "SQL for Data Science (Coursera)",
    MongoDB: "MongoDB University Free Courses",
    AWS: "AWS Certified Cloud Practitioner (AWS Training)",
    Docker: "Docker Mastery (Udemy)",
    Kubernetes: "Kubernetes Basics (K8s.io)",
    GraphQL: "GraphQL with Apollo (freeCodeCamp)",
    "Tailwind CSS": "Tailwind CSS Official Docs",
    "Next.js": "Next.js Learn Course",
    "Vue.js": "Vue.js Official Guide",
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const skill = skillInput.trim();
    if (skillInputType === "current") {
      if (!currentSkills.includes(skill)) {
        setCurrentSkills([...currentSkills, skill]);
      }
    } else {
      if (!requiredSkills.includes(skill)) {
        setRequiredSkills([...requiredSkills, skill]);
      }
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill, type) => {
    if (type === "current") {
      setCurrentSkills(currentSkills.filter((s) => s !== skill));
    } else {
      setRequiredSkills(requiredSkills.filter((s) => s !== skill));
    }
  };

  const handleAnalyze = async () => {
    if (!employeeName.trim()) {
      setError("Please enter employee name");
      return;
    }
    if (requiredSkills.length === 0) {
      setError("Please add at least one required skill");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const matching = currentSkills.filter((skill) => requiredSkills.includes(skill));
    const missing = requiredSkills.filter((skill) => !currentSkills.includes(skill));
    const gapScore = requiredSkills.length === 0 ? 0 : (missing.length / requiredSkills.length) * 100;

    // Generate recommendations for missing skills
    const recommendations = missing.map((skill) => ({
      skill,
      course: courseRecommendations[skill] || "General upskilling resources",
    }));

    setResult({
      matching,
      missing,
      gapScore,
      recommendations,
    });
    setLoading(false);
  };

  const handleReset = () => {
    setEmployeeName("");
    setCurrentSkills([]);
    setRequiredSkills([]);
    setExperienceLevel("");
    setResult(null);
    setError("");
    setSkillInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <Zap className="h-8 w-8 text-indigo-600" />
            Skill Gap Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Identify missing skills and get personalized recommendations
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Employee Details
            </h2>

            <div className="space-y-6">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g., John Doe"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner (0-2 years)</option>
                  <option value="Intermediate">Intermediate (3-5 years)</option>
                  <option value="Expert">Expert (6+ years)</option>
                </select>
              </div>

              {/* Current Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInputType === "current" ? skillInput : ""}
                    onChange={(e) => {
                      setSkillInputType("current");
                      setSkillInput(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Type a skill and press Enter or click Add"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill, "current")}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {currentSkills.length === 0 && (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInputType === "required" ? skillInput : ""}
                    onChange={(e) => {
                      setSkillInputType("required");
                      setSkillInput(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Type a skill and press Enter or click Add"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill, "required")}
                        className="hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {requiredSkills.length === 0 && (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`flex-1 px-5 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    loading
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
                      <BarChart3 className="h-4 w-4" />
                      Analyze Skills
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Analysis Results
            </h2>

            {!result ? (
              <div className="text-center py-12 text-gray-400">
                <Code className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No analysis yet. Fill the form and click "Analyze Skills".</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Gap Score */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-700">Skill Gap Score</h3>
                      <span className="text-2xl font-bold text-indigo-600">
                        {Math.round(result.gapScore)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.gapScore}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-indigo-600 rounded-full"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {result.gapScore === 0
                        ? "Perfect match! All required skills are present."
                        : `${result.missing.length} missing skill(s) out of ${requiredSkills.length} required.`}
                    </p>
                  </div>

                  {/* Matching Skills */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Matching Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.matching.length === 0 ? (
                        <p className="text-sm text-green-600">No matching skills found.</p>
                      ) : (
                        result.matching.map((skill) => (
                          <span
                            key={skill}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-red-800">Missing Skills (Gap)</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missing.length === 0 ? (
                        <p className="text-sm text-red-600">No missing skills!</p>
                      ) : (
                        result.missing.map((skill) => (
                          <span
                            key={skill}
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-5 w-5 text-yellow-700" />
                        <h3 className="font-semibold text-yellow-800">Recommended Courses</h3>
                      </div>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec) => (
                          <li key={rec.skill} className="text-sm text-gray-700">
                            <strong>{rec.skill}:</strong> {rec.course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}