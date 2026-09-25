import React, { useEffect, useState } from 'react';
import { Users, FileText, FileSpreadsheet, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    invoices: 0,
    quotations: 0,
    agreements: 0,
    totalDocuments: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers || []);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    { title: "Total Registered Users", value: stats.totalUsers, color: "bg-indigo-600", icon: <Users /> },
    { title: "Total Invoices", value: stats.invoices, color: "bg-blue-600", icon: <FileSpreadsheet /> },
    { title: "Total Quotations", value: stats.quotations, color: "bg-green-600", icon: <FileText /> },
    { title: "Active Agreements", value: stats.agreements, color: "bg-purple-600", icon: <ShieldCheck /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live MongoDB Database Insights</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                <h2 className="text-3xl font-black mt-2 text-gray-900 dark:text-white">
                  {loading ? <span className="animate-pulse">...</span> : card.value}
                </h2>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-md`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Database Users Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Database Users</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recently registered accounts in MongoDB</p>
            </div>
            <Link to="/dashboard/users" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View All Users <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm">Loading users...</div>
          ) : recentUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">No registered users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 dark:text-gray-500 text-xs uppercase border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 text-sm">
                  {recentUsers.map((u) => (
                    <tr key={u._id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3.5 font-bold text-gray-900 dark:text-white">{u.name}</td>
                      <td className="py-3.5 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.role === "Admin" 
                            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}>
                          {u.role || "User"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        {u.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-[11px] font-bold">
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-md text-[11px] font-bold">
                            <XCircle size={12} /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/dashboard/users" className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-semibold border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30">
              Manage Database Users
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </Link>
            <Link to="/dashboard/invoice" className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-semibold border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30">
              New Invoice
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </Link>
            <Link to="/dashboard/quotation" className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-semibold border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30">
              New Quotation
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </Link>
            <Link to="/dashboard/agreement" className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-semibold border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30">
              New Agreement
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}