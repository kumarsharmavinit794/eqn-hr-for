import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Briefcase,
  Building,
  Calendar,
  UserCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";

export default function Onboarding() {
  // Step index
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    role: "",
    department: "",
    joiningDate: "",
    avatar: null,
  });

  // Departments & roles
  const departments = [
    "Engineering",
    "Product",
    "Marketing",
    "Sales",
    "Human Resources",
    "Finance",
  ];
  const roles = [
    "Software Engineer",
    "Product Manager",
    "Marketing Specialist",
    "Sales Executive",
    "HR Generalist",
    "Financial Analyst",
  ];

  // Load persisted data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("onboardingData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
    } else {
      // Generate a unique employee ID on first load
      const empId = `EMP${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
      setFormData((prev) => ({ ...prev, employeeId: empId }));
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (formData.employeeId) {
      localStorage.setItem("onboardingData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleChange("avatar", ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const removeAvatar = () => {
    handleChange("avatar", null);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        setError("Employee name is required");
        return false;
      }
      if (!formData.email.trim()) {
        setError("Email address is required");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.role) {
        setError("Please select a role");
        return false;
      }
      if (!formData.department) {
        setError("Please select a department");
        return false;
      }
      if (!formData.joiningDate) {
        setError("Please select a joining date");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      setError("");
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setOnboarded(true);
    // Clear localStorage after successful onboarding? (optional)
    // localStorage.removeItem("onboardingData");
  };

  const handleReset = () => {
    const newEmpId = `EMP${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;
    setFormData({
      employeeId: newEmpId,
      name: "",
      email: "",
      role: "",
      department: "",
      joiningDate: "",
      avatar: null,
    });
    setStep(1);
    setOnboarded(false);
    setError("");
  };

  const handleAddAnother = () => {
    handleReset();
  };

  // Progress percentage
  const progress = ((step - 1) / 2) * 100;

  // Step content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                {formData.avatar ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-300">
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeAvatar}
                      className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <UserCircle className="w-24 h-24 text-gray-300" />
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700"
                >
                  <Upload className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline h-4 w-4 mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="john@company.com"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Role / Position *
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building className="inline h-4 w-4 mr-1" />
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Joining Date *
              </label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => handleChange("joiningDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Review Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Employee ID:</dt>
                  <dd className="font-medium">{formData.employeeId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Full Name:</dt>
                  <dd className="font-medium">{formData.name || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email:</dt>
                  <dd className="font-medium">{formData.email || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Role:</dt>
                  <dd className="font-medium">{formData.role || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Department:</dt>
                  <dd className="font-medium">{formData.department || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Joining Date:</dt>
                  <dd className="font-medium">{formData.joiningDate || "—"}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <p className="text-sm text-indigo-800">
                📧 Welcome email will be sent to {formData.email} with onboarding instructions.
              </p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Success screen
  if (onboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Employee Onboarded Successfully! 🎉
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-gray-600">
              <strong>Employee ID:</strong> {formData.employeeId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {formData.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {formData.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Role:</strong> {formData.role}
            </p>
          </div>
          <button
            onClick={handleAddAnother}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Add Another Employee
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <User className="h-7 w-7 text-white" />
            <h1 className="text-2xl font-bold text-white">Employee Onboarding</h1>
          </div>
          <p className="text-indigo-100 text-sm mt-1">
            Complete the steps to onboard a new employee
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`text-xs font-medium ${
                  step >= s ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                Step {s}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="ml-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`ml-auto px-5 py-2 rounded-lg flex items-center gap-2 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Onboard Employee
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reset Form
          </button>
        </div>
      </motion.div>
    </div>
  );
}