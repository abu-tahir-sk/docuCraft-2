import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Timer for Resend OTP
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const { setUser } = useAuth(); // AuthContext থেকে setUser নিয়েছি

  // Timer Countdown Effect
  useEffect(() => {
    let interval;
    if (timer > 0 && step === 2) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  // ==========================
  // Step 1: Request OTP
  // ==========================
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email address!", {
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    }

    setLoading(true);
    const toastId = toast.loading("Sending OTP to your email...");

    try {
      const res = await api.post("/auth/login", { email });

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setStep(2);
        setTimer(60); // 60 সেকেন্ডের টাইমার শুরু হবে
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Server connection failed. Is backend running?";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Step 2: Verify OTP & Login
  // ==========================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the 6-digit OTP!");

    setLoading(true);
    const toastId = toast.loading("Verifying your identity...");

    try {
      const res = await api.post(
        "/auth/verify-login",
        { email, otp, rememberMe }
      );

      if (res.data.success) {
        toast.success("Welcome back! Login Successful ", { id: toastId });
        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }
        setUser(res.data.user); // Context আপডেট 

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid OTP code. Please try again.";
      toast.error(errorMsg, { id: toastId });
      setLoading(false); // শুধুমাত্র এরর আসলেই লোডিং বন্ধ হবে
    }
  };

  // ==========================
  // Step 3: Resend OTP
  // ==========================
  const handleResendOTP = async () => {
    if (timer > 0) return; // টাইমার চললে রিসেন্ড করা যাবে না

    const toastId = toast.loading("Resending OTP...");
    try {
      const res = await api.post("/auth/resend-login-otp", { email });

      if (res.data.success) {
        toast.success("New OTP sent to your email!", { id: toastId });
        setOtp(""); // আগের OTP ক্লিয়ার করে দিলাম
        setTimer(60); // আবার নতুন করে 60 সেকেন্ডের টাইমার
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend OTP. Try again later.";
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 transform transition-all">

        <div className="bg-gray-50 pt-10 pb-6 px-10 text-center border-b border-gray-100">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#0A2647] text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg">D</div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Docu<span className="text-blue-600">Craft</span>
            </h2>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mt-2">
            {step === 1 ? "Welcome Back!" : "Security Verification"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1
              ? "Sign in to manage your professional documents."
              : <span>We've sent a 6-digit code to <b className="text-gray-700">{email}</b></span>
            }
          </p>
        </div>

        <div className="p-10">
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleRequestOTP}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                    placeholder="e.g. admin@company.com"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-600 cursor-pointer">
                  Keep me logged in for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#0A2647] hover:bg-[#11355e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2647] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Continue with Email"
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-2 text-center">
                  Enter Validation Code
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-3xl tracking-[1em] font-extrabold text-[#0A2647] focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="------"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Secure Login"
                )}
              </button>

              {/* =======================
                  Resend OTP & Change Email
                  ======================= */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setTimer(0);
                  }}
                  className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={timer > 0}
                  className={`text-sm font-bold transition-colors ${timer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800"
                    }`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center pt-2">
            <p className="text-sm text-gray-500">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-extrabold text-blue-600 hover:text-blue-800 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Login;