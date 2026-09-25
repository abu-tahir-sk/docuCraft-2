import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { User, Mail, Loader2, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
      });
      toast.success("Registration successful! An OTP has been sent to your email");
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">DocuCraft Join DocuCraft now.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">


          {/* ইনপুট ফিল্ডস */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="text" placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="email" placeholder="Email Address" onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <button disabled={loading} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>Register <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">

          Already have an account?? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;