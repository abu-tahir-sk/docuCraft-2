import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { 
  Users as UsersIcon, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Shield, 
  RefreshCw, 
  Trash2, 
  ShieldAlert, 
  UserCheck, 
  UserX,
  AlertTriangle 
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 });

  // Modals state
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [roleModalData, setRoleModalData] = useState(null); // { user, targetRole }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/users");
      if (res.data.success) {
        setUsers(res.data.users);
        setStats({
          totalUsers: res.data.totalUsers,
          verifiedUsers: res.data.verifiedUsers,
          unverifiedUsers: res.data.unverifiedUsers,
        });
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (targetUser, newRole) => {
    setActionLoading(targetUser._id);
    try {
      const res = await api.put(`/auth/users/${targetUser._id}/role`, { role: newRole });
      if (res.data.success) {
        toast.success(res.data.message || `User role changed to ${newRole}`);
        // Update local state
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading(null);
      setRoleModalData(null);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    setActionLoading(targetUser._id);
    try {
      const res = await api.delete(`/auth/users/${targetUser._id}`);
      if (res.data.success) {
        toast.success(res.data.message || "User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
        setStats((prev) => ({
          ...prev,
          totalUsers: Math.max(0, prev.totalUsers - 1),
          verifiedUsers: targetUser.isVerified ? Math.max(0, prev.verifiedUsers - 1) : prev.verifiedUsers,
          unverifiedUsers: !targetUser.isVerified ? Math.max(0, prev.unverifiedUsers - 1) : prev.unverifiedUsers,
        }));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
      setDeleteModalUser(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const isAdmin =
    currentUser?.role === "Admin" ||
    currentUser?.email?.toLowerCase() === "abutahir2626@gmail.com";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <UsersIcon className="text-blue-600 dark:text-blue-400" size={32} />
            Database Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all registered users, roles, and administrative access
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Registered Users</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">{stats.totalUsers}</h2>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Verified Accounts</p>
          <h2 className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">{stats.verifiedUsers}</h2>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Unverified Accounts</p>
          <h2 className="text-3xl font-black text-orange-500 dark:text-orange-400 mt-2">{stats.unverifiedUsers}</h2>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        {/* Search Input */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 rounded-xl mb-6 border border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm font-medium"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <RefreshCw className="animate-spin mx-auto mb-2" size={28} />
            <p>Loading database users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            No users found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-3">
                  <th className="pb-3 px-4">User</th>
                  <th className="pb-3 px-4">Email</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Joined Date</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 text-sm">
                {filteredUsers.map((u) => {
                  const isUserAdmin = u.role === "Admin";
                  const isCurrent = (currentUser?._id === u._id) || (currentUser?.id === u._id);

                  return (
                    <tr
                      key={u._id}
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="py-4 px-4 font-bold flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm ${
                          isUserAdmin 
                            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700" 
                            : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                        }`}>
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900 dark:text-white font-bold">{u.name}</p>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded font-semibold border border-blue-200 dark:border-blue-800">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-600 dark:text-gray-400">
                        {isAdmin || isCurrent ? u.email : "••••••••••••"}
                      </td>
                      <td className="py-4 px-4">
                        {isAdmin || isCurrent ? (
                          isUserAdmin ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 rounded-lg text-xs font-bold shadow-xs">
                              <ShieldAlert size={13} className="text-purple-600 dark:text-purple-400" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">
                              <Shield size={12} />
                              {u.role || "User"}
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-xs italic">Hidden</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {isAdmin || isCurrent ? (
                          u.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-bold">
                              <CheckCircle2 size={14} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-md text-xs font-bold">
                              <XCircle size={14} /> Unverified
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-xs italic">Hidden</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {isAdmin || isCurrent ? (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A") : <span className="text-gray-400 dark:text-gray-500 italic">Hidden</span>}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Role toggle button */}
                          {isAdmin && !isCurrent ? (
                            isUserAdmin ? (
                              <button
                                onClick={() => setRoleModalData({ user: u, targetRole: "User" })}
                                disabled={actionLoading === u._id}
                                title="Demote to Regular User"
                                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800/50 transition-all flex items-center gap-1 disabled:opacity-50"
                              >
                                <UserX size={14} />
                                <span className="hidden sm:inline">Remove Admin</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setRoleModalData({ user: u, targetRole: "Admin" })}
                                disabled={actionLoading === u._id}
                                title="Promote to Admin"
                                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/50 transition-all flex items-center gap-1 disabled:opacity-50"
                              >
                                <UserCheck size={14} />
                                <span className="hidden sm:inline">Make Admin</span>
                              </button>
                            )
                          ) : null}

                          {/* Delete button */}
                          {isAdmin && !isCurrent ? (
                            <button
                              onClick={() => setDeleteModalUser(u)}
                              disabled={actionLoading === u._id}
                              title="Delete User"
                              className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800/40 disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            isCurrent && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 italic pr-2">
                                Active Account
                              </span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Delete User Account?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Are you sure you want to permanently delete user <strong className="text-gray-800 dark:text-gray-200">{deleteModalUser.name}</strong> (<span className="text-xs font-mono">{deleteModalUser.email}</span>)? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                disabled={actionLoading === deleteModalUser._id}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deleteModalUser)}
                disabled={actionLoading === deleteModalUser._id}
                className="px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {actionLoading === deleteModalUser._id ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {roleModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              roleModalData.targetRole === "Admin" 
                ? "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400" 
                : "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400"
            }`}>
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              {roleModalData.targetRole === "Admin" ? "Promote User to Admin?" : "Remove Admin Privileges?"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              {roleModalData.targetRole === "Admin" ? (
                <>
                  User <strong className="text-gray-800 dark:text-gray-200">{roleModalData.user.name}</strong> will receive full administrative access to manage all users, documents, and roles.
                </>
              ) : (
                <>
                  User <strong className="text-gray-800 dark:text-gray-200">{roleModalData.user.name}</strong> will be downgraded to a standard user with regular permissions.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setRoleModalData(null)}
                disabled={actionLoading === roleModalData.user._id}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateRole(roleModalData.user, roleModalData.targetRole)}
                disabled={actionLoading === roleModalData.user._id}
                className={`px-5 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-2 ${
                  roleModalData.targetRole === "Admin"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {actionLoading === roleModalData.user._id ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Shield size={14} />
                )}
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

