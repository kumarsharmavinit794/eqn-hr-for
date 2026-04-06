import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Sparkles, Briefcase, CheckCircle2 } from "lucide-react";

export default function JDGenerator() {
  const [role, setRole] = useState("");
  const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Realistic JD generator based on role
  const generateJobDescription = (jobRole) => {
    const roleLower = jobRole.toLowerCase();
    let overview = "";
    let responsibilities = [];
    let skills = [];
    let experience = "";

    if (roleLower.includes("frontend") || roleLower.includes("react") || roleLower.includes("vue")) {
      overview = `We are looking for a talented ${jobRole} to join our dynamic team. You will be responsible for building responsive, high-performance user interfaces and collaborating with designers and backend engineers.`;
      responsibilities = [
        "Develop and maintain scalable web applications using modern frameworks (React/Vue/Angular).",
        "Translate UI/UX designs into pixel-perfect, responsive code.",
        "Optimize components for maximum performance across devices.",
        "Collaborate with backend teams to integrate RESTful APIs.",
        "Write clean, maintainable, and testable code following best practices."
      ];
      skills = [
        "Proficiency in HTML5, CSS3, and JavaScript (ES6+)",
        "Experience with React.js and its ecosystem (Redux, React Router)",
        "Knowledge of state management and component lifecycle",
        "Familiarity with version control (Git) and build tools (Webpack, Vite)",
        "Understanding of responsive design and cross-browser compatibility"
      ];
      experience = "3+ years of frontend development experience, preferably in a product-based company.";
    } 
    else if (roleLower.includes("backend") || roleLower.includes("node") || roleLower.includes("python") || roleLower.includes("java")) {
      overview = `We are seeking an experienced ${jobRole} to design and implement robust backend services. You'll work on scalable architecture, APIs, and database optimization.`;
      responsibilities = [
        "Design and develop high-volume, low-latency APIs.",
        "Implement secure data storage solutions (SQL/NoSQL).",
        "Optimize application performance and scalability.",
        "Collaborate with frontend developers to integrate user-facing elements.",
        "Write unit and integration tests to ensure reliability."
      ];
      skills = [
        "Strong knowledge of Node.js / Python / Java",
        "Experience with Express, Django, or Spring Boot",
        "Database design (PostgreSQL, MongoDB, or similar)",
        "Understanding of microservices architecture",
        "Familiarity with cloud platforms (AWS, GCP, Azure)"
      ];
      experience = "4+ years of backend development experience, with a strong grasp of system design.";
    }
    else if (roleLower.includes("full stack") || roleLower.includes("fullstack")) {
      overview = `We are hiring a versatile ${jobRole} to take ownership of both frontend and backend development. You will build end-to-end features and contribute to architectural decisions.`;
      responsibilities = [
        "Develop and maintain full-stack web applications.",
        "Implement responsive UIs and scalable backend APIs.",
        "Ensure seamless integration between frontend and backend.",
        "Participate in code reviews and contribute to team best practices.",
        "Troubleshoot and debug across the entire stack."
      ];
      skills = [
        "Proficiency in JavaScript/TypeScript (React, Node.js)",
        "Experience with RESTful APIs and database design",
        "Knowledge of version control (Git) and CI/CD pipelines",
        "Understanding of cloud services and deployment",
        "Strong problem-solving and communication skills"
      ];
      experience = "3+ years of full-stack development experience, with a portfolio of projects.";
    }
    else {
      overview = `We are looking for a motivated ${jobRole} to join our growing team. You will contribute to our products and help drive innovation.`;
      responsibilities = [
        "Collaborate with cross-functional teams to define and deliver features.",
        "Write clean, maintainable code following industry standards.",
        "Participate in design reviews and contribute to technical discussions.",
        "Ensure application performance, quality, and responsiveness.",
        "Stay up-to-date with emerging technologies and propose improvements."
      ];
      skills = [
        "Solid understanding of software development principles",
        "Experience with one or more programming languages (JavaScript, Python, Java, etc.)",
        "Familiarity with version control (Git)",
        "Good communication and teamwork skills",
        "Problem-solving mindset and attention to detail"
      ];
      experience = "2+ years of relevant software development experience.";
    }

    return `
${overview}

**Role Overview**
As a ${jobRole}, you will play a key role in shaping our products and driving technical excellence.

**Responsibilities**
${responsibilities.map(r => `• ${r}`).join("\n")}

**Required Skills**
${skills.map(s => `• ${s}`).join("\n")}

**Experience & Qualifications**
${experience}

**Why Join Us?**
- Competitive salary and benefits
- Flexible work hours and remote-friendly culture
- Opportunity to work on cutting-edge technologies
- Collaborative and inclusive team environment
    `.trim();
  };

  const handleGenerate = async () => {
    if (!role.trim()) return;
    setLoading(true);
    // Simulate async generation for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    const generatedJD = generateJobDescription(role);
    setJD(generatedJD);
    setLoading(false);
  };

  const handleClear = () => {
    setRole("");
    setJD("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!jd) return;
    await navigator.clipboard.writeText(jd);
    setCopied(true);
    setToastVisible(true);
    setTimeout(() => {
      setCopied(false);
      setToastVisible(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-white" />
            <h1 className="text-2xl font-bold text-white">Job Description Generator</h1>
          </div>
          <p className="text-indigo-100 text-sm mt-1">
            Create professional, tailored job descriptions in seconds
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Role
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer, Backend Engineer, Full Stack Developer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={!role.trim() || loading}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
                    !role.trim() || loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClear}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </motion.button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          {jd && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Generated Job Description
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </motion.button>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                  {jd}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}