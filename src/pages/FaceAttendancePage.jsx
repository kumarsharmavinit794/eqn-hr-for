import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, Clock, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FaceAttendancePage() {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [toast, setToast] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
    } catch (err) {
      alert("Camera access denied ❌");
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
    setCameraOn(false);
  };

  const handleNotifySubmit = () => {
    if (!email && !phone) return alert("Kuch toh bharo bhai 😅");
    setShowModal(false);
    setEmail("");
    setPhone("");
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    // ✅ No backdrop-blur on root — clean background
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">

      {/* ✅ TOAST — always z-50, completely independent of modal */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
            className="flex items-start gap-3 bg-white border border-green-200 shadow-2xl rounded-xl px-4 py-3 w-72"
          >
            {/* Icon */}
            <div className="mt-0.5 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">You're on the list! 🚀</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                AI feature launch hone par notify karenge.
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setToast(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3.5, ease: "linear" }}
              style={{ transformOrigin: "left", position: "absolute", bottom: 0, left: 0, right: 0 }}
              className="h-1 bg-green-400 rounded-b-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ MODAL — dark backdrop only, no blur on background */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop — dark transparent, no blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowModal(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                zIndex: 40,
              }}
            />

            {/* Modal Box — above backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 50,
                width: "100%",
                maxWidth: 400,
                padding: "0 16px",
              }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-2xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-gray-900">🔔 Notify Me</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-5">
                  AI face recognition launch hone par notify karenge. Email ya WhatsApp koi bhi bharo!
                </p>

                {/* Email */}
                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                  />
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                  />
                </div>

                {/* Submit */}
                <Button onClick={handleNotifySubmit} className="w-full gap-2 h-11 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Notify Karo Mujhe!
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ MAIN CARD — no backdrop-blur, clean white */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Face Attendance</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-4">
          Camera-based attendance verification system
        </p>

        {/* Video — always in DOM */}
        <div className={`mb-4 ${cameraOn ? "block" : "hidden"}`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-xl border border-gray-200"
          />
        </div>

        {/* Placeholder */}
        {!cameraOn && (
          <div className="mb-4 w-full aspect-video rounded-xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2">
            <Camera className="w-10 h-10 text-gray-300" />
            <span className="text-xs text-gray-400">Camera preview will appear here</span>
          </div>
        )}

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-sm font-medium mb-4">
          <Clock className="w-4 h-4" />
          Demo Mode
        </div>

        <p className="text-sm text-gray-500 mb-6">
          This is a preview of face attendance system. AI recognition coming soon.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          {!cameraOn ? (
            <Button onClick={startCamera} className="gap-2 h-10">
              <Camera className="w-4 h-4" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="destructive" className="h-10">
              Stop Camera
            </Button>
          )}

          <Button
            onClick={() => setShowModal(true)}
            variant="outline"
            className="gap-2 h-10 border-gray-200 hover:bg-gray-50"
          >
            <Sparkles className="w-4 h-4" />
            Notify Me
          </Button>
        </div>
      </motion.div>
    </div>
  );
}