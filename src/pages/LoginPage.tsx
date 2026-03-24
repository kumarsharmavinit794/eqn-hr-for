import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">NexaHR</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered HR Management</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">{isSignup ? "Create Account" : "Welcome Back"}</h2>
            <p className="text-sm text-muted-foreground">{isSignup ? "Start your free trial" : "Sign in to your workspace"}</p>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full"><Chrome className="w-4 h-4 mr-2" /> Google</Button>
            <Button variant="outline" className="w-full"><Github className="w-4 h-4 mr-2" /> GitHub</Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or continue with email</span></div>
          </div>

          <div className="space-y-4">
            {isSignup && <div><Label>Full Name</Label><Input placeholder="John Doe" /></div>}
            <div><Label>Email</Label><Input type="email" placeholder="john@company.com" /></div>
            <div><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
            <Button className="w-full" onClick={() => navigate("/")}>
              {isSignup ? "Create Account" : "Sign In"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline font-medium">
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
