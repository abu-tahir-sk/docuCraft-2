import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { ShieldCheck, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ইমেইল না পেলে রিডাইরেক্ট করার জন্য
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  // যদি কেউ সরাসরি এই পেজে চলে আসে (ইমেইল ছাড়া), তাকে রেজিস্টার পেজে পাঠিয়ে দিবে
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP!");

    setLoading(true);

    try {
      const res = await api.post("/auth/verify-email", {
        email,
        otp,
      });

      toast.success(res.data.message || "Email verified successfully!");
      
      // ভেরিফাই হওয়ার পর লগইন পেজে পাঠিয়ে দেবে
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      const res = await api.post("/auth/resend-register-otp", { email });
      toast.success(res.data.message || "New OTP sent to your email!");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10">
        
        {/* Header Section */}
        <div className="bg-gray-50 pt-10 pb-6 px-10 text-center border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Verify Email
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            We've sent a 6-digit code to
            <br />
            <b className="text-gray-800">{email}</b>
          </p>
        </div>

        {/* Form Section */}
        <div className="p-10">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                // শুধুমাত্র নম্বর টাইপ করতে দিবে
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-3xl tracking-[1em] font-extrabold text-[#0A2647] focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                placeholder="------"
                required
              />
            </div>

            <button
              disabled={loading || otp.length < 4}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          {/* Resend OTP Option */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive code?{" "}
              {timer > 0 ? (
                <span className="font-bold text-gray-400">Resend in {timer}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="font-extrabold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                >
                  {resending ? <Loader2 className="animate-spin" size={14} /> : "Resend OTP"}
                </button>
              )}
            </p>
          </div>

          {/* Go Back Option */}
          <div className="mt-6 text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Wrong email address?{" "}
              <Link to="/register" className="font-extrabold text-blue-600 hover:text-blue-800 transition-colors">
                Go back
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;