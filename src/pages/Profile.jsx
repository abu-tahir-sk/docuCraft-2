import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/me');

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        toast.error("Profile fetch error:", err);
        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [setUser]);

  // প্রফেশনাল লোডিং স্টেট
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p className="font-bold text-sm uppercase tracking-widest">Loading profile...</p>
        </div>
      </div>
    );
  }

  // সুন্দর এরর স্টেট
  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-3 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/30">
          <AlertCircle size={40} />
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;


  const Image = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0A2647&color=fff&size=128`;

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-8 sm:p-10 bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 transition-colors duration-300">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 border-b border-gray-100 dark:border-gray-800 pb-8 text-center sm:text-left">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden flex-shrink-0 bg-[#0A2647] dark:bg-blue-600">
          <img
            src={Image}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-2 sm:mt-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{user.name}</h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Manage your personal information and account security.</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-4">

        {/* Name Field */}
        <div className="flex items-center gap-5 p-5 bg-gray-50 dark:bg-gray-800/40 border border-transparent dark:border-gray-800 rounded-2xl hover:border-blue-100 dark:hover:border-blue-900/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform">
            <User size={22} />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Full Name</label>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</p>
          </div>
        </div>

        {/* Email Field */}
        <div className="flex items-center gap-5 p-5 bg-gray-50 dark:bg-gray-800/40 border border-transparent dark:border-gray-800 rounded-2xl hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
            <Mail size={22} />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Email Address</label>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{user.email}</p>
          </div>
        </div>

        {/* Role Field */}
        <div className="flex items-center gap-5 p-5 bg-gray-50 dark:bg-gray-800/40 border border-transparent dark:border-gray-800 rounded-2xl hover:border-purple-100 dark:hover:border-purple-900/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform">
            <Shield size={22} />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Account Role</label>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{user.role || 'User'}</p>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;