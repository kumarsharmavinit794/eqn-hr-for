import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Chrome, Github, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { getDefaultRoute } from "@/lib/auth";
import api, { isApiError } from "@/lib/api";

const validateEmail = (email) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
const validatePincode = (pincode) => /^[0-9]{6}$/.test(pincode);

const Field = ({ label, name, type = "text", placeholder, value, onChange, onBlur, error }) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-foreground/70">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`h-10 w-full rounded-lg border bg-background px-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "border-border focus:border-primary/50 focus:ring-primary/20"
      }`}
    />
    {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
  </div>
);

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStatusLoading, setAuthStatusLoading] = useState(true);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    companyEmail: "",
    phone: "",
    pincode: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    let active = true;

    const loadAuthStatus = async () => {
      try {
        const response = await api.get("/auth/status");
        if (active) {
          setSignupEnabled(response.data?.data?.signup_enabled !== false);
        }
      } catch {
        if (active) {
          setSignupEnabled(true);
        }
      } finally {
        if (active) {
          setAuthStatusLoading(false);
        }
      }
    };

    loadAuthStatus();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "Email is required";
        else if (!validateEmail(value)) error = "Invalid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (!validatePassword(value)) error = "Password must be 8+ chars with upper, lower, number, and special char";
        break;
      case "fullName":
        if (isSignup && !value) error = "Full name is required";
        break;
      case "companyName":
        if (isSignup && !value) error = "Company name is required";
        break;
      case "companyEmail":
        if (isSignup && !value) error = "Company email is required";
        else if (isSignup && !validateEmail(value)) error = "Invalid company email";
        break;
      case "phone":
        if (isSignup && !value) error = "Phone number is required";
        else if (isSignup && !validatePhone(value)) error = "Phone must be 10 digits";
        break;
      case "pincode":
        if (isSignup && !value) error = "Pincode is required";
        else if (isSignup && !validatePincode(value)) error = "Pincode must be 6 digits";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateForm = () => {
    const fieldsToValidate = isSignup
      ? ["fullName", "companyName", "companyEmail", "phone", "pincode", "email", "password"]
      : ["email", "password"];

    const nextErrors = {};
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      let error = "";
      if (!value) {
        error = `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`;
      } else if (field === "email" && !validateEmail(value)) {
        error = "Invalid email address";
      } else if (field === "password" && !validatePassword(value)) {
        error = "Password must be 8+ chars with upper, lower, number, and special char";
      } else if (field === "companyEmail" && !validateEmail(value)) {
        error = "Invalid company email";
      } else if (field === "phone" && !validatePhone(value)) {
        error = "Phone must be 10 digits";
      } else if (field === "pincode" && !validatePincode(value)) {
        error = "Pincode must be 6 digits";
      }

      if (error) {
        isValid = false;
        nextErrors[field] = error;
      }
    });

    const allTouched = {};
    fieldsToValidate.forEach((field) => {
      allTouched[field] = true;
    });

    setErrors(nextErrors);
    setTouched((prev) => ({ ...prev, ...allTouched }));
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      companyName: "",
      companyEmail: "",
      phone: "",
      pincode: "",
      email: "",
      password: "",
      role: "employee",
    });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

      setLoading(true);
    try {
      if (isSignup) {
        const response = await api.post("/auth/signup", {
          fullName: formData.fullName.trim(),
          companyName: formData.companyName.trim(),
          companyEmail: formData.companyEmail.trim(),
          phone: formData.phone.trim(),
          pincode: formData.pincode.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
        });

        toast.success(response.data?.message || "Account created successfully");
        resetForm();
        setIsSignup(false);
        setTimeout(() => navigate("/login", { replace: true }), 500);
      } else {
        const response = await api.post("/auth/login", {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        const payload = response.data?.data || response.data;
        const accessToken = payload?.access_token || payload?.token;
        if (accessToken) {
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refresh_token", payload?.refresh_token || "");
          localStorage.setItem("email", payload?.email || formData.email);
          localStorage.setItem("name", payload?.name || payload?.fullName || "");
          const role = payload?.role || "employee";
          localStorage.setItem("role", role);
          toast.success("Login successful! Redirecting...");
          setTimeout(() => navigate(getDefaultRoute(role)), 800);
        } else {
          toast.error("Invalid credentials");
        }
      }
    } catch (error) {
      const message = isApiError(error)
        ? error.response?.data?.message || error.response?.data?.detail || "Something went wrong"
        : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-primary/8 to-background px-6 md:flex md:w-1/2 lg:w-3/5 lg:px-16"
      >
        <div className="pointer-events-none absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/6 blur-2xl" />

        <div className="relative z-10 max-w-sm text-center">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #0d9488, #059669)",
              boxShadow: "0 8px 24px rgba(13,148,136,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Sparkles style={{ width: 26, height: 26, color: "#fff" }} />
          </div>
          <h1 className="bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-5xl font-black tracking-tight text-transparent">
            NexaHR
          </h1>
          <p className="mt-2 text-lg font-medium text-foreground/60">AI-Powered HR Management</p>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Streamline your HR operations with intelligent automation and real-time insights.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Payroll", "Attendance", "Recruiting", "Analytics"].map((feature) => (
              <span key={feature} className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                {feature}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-10 h-px w-20 rounded-full bg-primary/25" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        className="flex w-full items-center justify-center overflow-y-auto bg-background px-4 py-8 sm:px-6 sm:py-10 md:w-1/2 lg:w-2/5"
      >
        <div className="w-full max-w-[360px]">
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="mb-1 flex flex-col items-center gap-2 md:hidden">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #0d9488, #059669)",
                  boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <span className="text-base font-bold tracking-tight">NexaHR</span>
            </div>

            <motion.div variants={itemVariants}>
              <h2 className="text-lg font-semibold tracking-tight">
                {isSignup ? "Create your account" : "Sign in to NexaHR"}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isSignup ? "Create the first admin account or request access from your admin" : "Enter your credentials to continue"}
              </p>
              {isSignup && !authStatusLoading && !signupEnabled ? (
                <p className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                  Signup is disabled. Please contact admin.
                </p>
              ) : null}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-full gap-1.5 text-xs"
                onClick={() => {
                  const params = new URLSearchParams({
                    token: "mock-oauth-token",
                    name: "Demo Employee",
                    email: "employee@nexahr.com",
                    role: "employee",
                  });
                  window.location.href = `/oauth-success?${params.toString()}`;
                }}
              >
                <Chrome className="h-3.5 w-3.5" /> Google
              </Button>
              <Button variant="outline" size="sm" className="h-10 w-full gap-1.5 text-xs" disabled>
                <Github className="h-3.5 w-3.5" /> GitHub
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-2.5 text-[11px] text-muted-foreground">or continue with email</span></div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <AnimatePresence>
                {isSignup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <Field label="Full Name" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} error={touched.fullName ? errors.fullName : ""} />
                    <Field label="Company Name" name="companyName" placeholder="ABC Pvt Ltd" value={formData.companyName} onChange={handleChange} onBlur={handleBlur} error={touched.companyName ? errors.companyName : ""} />
                    <Field label="Company Email" name="companyEmail" type="email" placeholder="hr@company.com" value={formData.companyEmail} onChange={handleChange} onBlur={handleBlur} error={touched.companyEmail ? errors.companyEmail : ""} />
                    <Field label="Phone Number" name="phone" type="tel" placeholder="9876543210" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={touched.phone ? errors.phone : ""} />
                    <Field label="Pincode" name="pincode" type="number" placeholder="302001" value={formData.pincode} onChange={handleChange} onBlur={handleBlur} error={touched.pincode ? errors.pincode : ""} />
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-foreground/70">Role</label>
                      <Select value={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-[11px] text-muted-foreground">
                      The first account is created as Admin automatically. In development mode, public signups can join as Employee or HR.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email" name="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={touched.email ? errors.email : ""} />
              <Field label="Password" name="password" type="password" placeholder="Strong password" value={formData.password} onChange={handleChange} onBlur={handleBlur} error={touched.password ? errors.password : ""} />

              <Button className="h-10 w-full text-sm" onClick={handleSubmit} disabled={loading || (isSignup && !signupEnabled)}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSignup ? "Create Account" : "Sign In"}
              </Button>

              {!isSignup && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-xs text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              {authStatusLoading || signupEnabled || isSignup ? (
                <button
                  onClick={() => {
                    if (!isSignup && !signupEnabled) {
                      toast.error("Signup disabled. Please contact admin");
                      return;
                    }
                    setIsSignup(!isSignup);
                    resetForm();
                  }}
                  className="font-medium text-primary transition-all hover:underline underline-offset-2"
                >
                  {isSignup ? "Sign in" : "Sign up"}
                </button>
              ) : (
                <span className="font-medium text-foreground/60">Signup is disabled. Please contact admin.</span>
              )}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
