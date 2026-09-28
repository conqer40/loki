import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Clock,
  Phone,
  Search,
  RefreshCw,
  Lock,
  LogOut,
  ArrowRight,
  Shield,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Download,
  CheckCircle2
} from "lucide-react";

export default function AdminDashboard({ onBackToChat }) {
  const [token, setToken] = useState(() => localStorage.getItem("loki_admin_token") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userChats, setUserChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Authenticate Admin
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return;
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("loki_admin_token", data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || "كلمة المرور غير صحيحة");
      }
    } catch {
      setLoginError("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loki_admin_token");
    setToken("");
    setUsers([]);
    setSelectedUser(null);
    setUserChats([]);
  };

  // Fetch Dashboard Stats & Users
  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.status === 401 || usersRes.status === 401) {
        handleLogout();
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (usersData.success) {
        setUsers(usersData.users || []);
        // If no user selected, auto select first user
        if (!selectedUser && usersData.users && usersData.users.length > 0) {
          fetchUserChat(usersData.users[0]);
        }
      }
    } catch (err) {
      console.warn("Admin fetch error:", err);
    }
  };

  // Fetch specific user's chat trajectory
  const fetchUserChat = async (user) => {
    if (!user || !token) return;
    setSelectedUser(user);
    setLoadingChats(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserChats(data.messages || []);
      }
    } catch (err) {
      console.warn("Chat fetch error:", err);
    } finally {
      setLoadingChats(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Auto-refresh interval
  useEffect(() => {
    if (!token || !autoRefresh) return;
    const interval = setInterval(() => {
      fetchDashboardData();
      if (selectedUser) {
        fetchUserChat(selectedUser);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [token, autoRefresh, selectedUser?.id]);

  // Export current chat
  const handleExportChat = () => {
    if (!selectedUser || userChats.length === 0) return;
    const textLines = userChats.map((m) => `[${m.timestamp}] ${m.sender === "user" ? selectedUser.name : "Loki"}: ${m.text}`);
    const blob = new Blob([textLines.join("\n\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat_${selectedUser.name}_${selectedUser.phone}.txt`;
    a.click();
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q))
    );
  });

  // Login Screen if not authenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex items-center justify-center p-4 font-sans select-none">
        <div className="w-full max-w-md bg-[#1e1f20] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                لوحة تحكم الأدمن | Loki Admin
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                متابعة المستخدمين والمحادثات والفضفضة النفسية
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 justify-end">
                <span>كلمة مرور لوحة التحكم</span>
                <Lock className="w-3.5 h-3.5 text-purple-400" />
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="اكتب كلمة مرور لوحة التحكم"
                className="w-full py-3 px-4 rounded-2xl bg-[#282a2c] border border-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-right"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isLoggingIn ? "جاري التحقق..." : "دخول لوحة التحكم"}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToChat}
              className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لشات لوكي</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 px-4 sm:px-6 bg-[#1e1f20]/90 border-b border-white/10 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>لوحة تحكم الأدمن | Loki Admin Center</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                مباشر
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">مراقبة المستخدمين والفضفضة وتحليل المرفقات</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auto Refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border transition ${
              autoRefresh
                ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
            title="تحديث تلقائي كل 5 ثواني"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? "animate-spin-slow text-purple-400" : ""}`} />
            <span className="hidden sm:inline">تحديث لايف: {autoRefresh ? "مفعل" : "معطل"}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="تحديث البيانات الآن"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Back to chat */}
          <button
            onClick={onBackToChat}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للتطبيق</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Stats Counter Bar */}
      <section className="px-4 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-white/5 bg-[#18191a]">
        <div className="p-3.5 rounded-2xl bg-[#1e1f20] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">إجمالي المستخدمين</p>
            <p className="text-xl font-bold text-white mt-0.5">{stats?.totalUsers || users.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1e1f20] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">إجمالي الرسائل والردود</p>
            <p className="text-xl font-bold text-purple-300 mt-0.5">{stats?.totalMessages || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1e1f20] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">نشط اليوم</p>
            <p className="text-xl font-bold text-emerald-300 mt-0.5">{stats?.activeToday || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1e1f20] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">مرفقات وصور تم تحليلها</p>
            <p className="text-xl font-bold text-pink-300 mt-0.5">{stats?.mediaCount || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Main Split Layout: User List (Left) & Chat Viewer (Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* User Directory Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-l border-white/10 bg-[#1e1f20] flex flex-col">
          {/* Search Bar */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو رقم الموبايل..."
                className="w-full py-2.5 pr-9 pl-4 rounded-xl bg-[#282a2c] border border-white/5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/40 text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* User List Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                لا يوجد مستخدمين مسجلين حتى الآن
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => fetchUserChat(user)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? "bg-purple-600/15 border-r-4 border-purple-500 text-white"
                        : "hover:bg-white/[0.04] text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {user.name ? user.name.slice(0, 1) : "؟"}
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-[160px]">
                          {user.name || "مستخدم مجهول"}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5" dir="ltr">
                          {user.phone || "بدون رقم"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-purple-200 font-semibold">
                        {user.messageCount || 0} رسالة
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {user.lastActive ? new Date(user.lastActive).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat Transcript Area */}
        <main className="flex-1 flex flex-col bg-[#131314] overflow-hidden">
          {selectedUser ? (
            <>
              {/* Selected User Header */}
              <div className="p-3.5 sm:p-4 bg-[#1e1f20]/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 font-bold flex items-center justify-center text-sm">
                    {selectedUser.name?.slice(0, 1) || "؟"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{selectedUser.name}</span>
                      <span className="text-[10px] text-slate-400">ID: {selectedUser.id}</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-[#a8c7fa] font-mono" dir="ltr">
                        <Phone className="w-3 h-3" />
                        {selectedUser.phone}
                      </span>
                      <span>•</span>
                      <span>سجل في: {new Date(selectedUser.createdAt).toLocaleDateString("ar-EG")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* WhatsApp Direct Link */}
                  {selectedUser.phone && (
                    <a
                      href={`https://wa.me/${selectedUser.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">واتساب</span>
                    </a>
                  )}

                  {/* Export Chat */}
                  <button
                    onClick={handleExportChat}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition"
                    title="تصدير المحادثة كملف نصي"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">تصدير المحادثة</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {loadingChats ? (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                    جاري تحميل المحادثة...
                  </div>
                ) : userChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs space-y-2">
                    <MessageSquare className="w-8 h-8 opacity-40" />
                    <span>المستخدم مسجل ولكن لم يبدأ محادثات بعد</span>
                  </div>
                ) : (
                  userChats.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? "items-start" : "items-end"} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-sm text-right ${
                            isUser
                              ? "bg-[#282a2c] text-white rounded-tl-sm border border-white/5"
                              : "bg-gradient-to-r from-purple-950/40 to-[#1e1f20] text-slate-100 rounded-tr-sm border border-purple-500/20"
                          }`}
                        >
                          {/* Sender Header */}
                          <div className="flex items-center gap-2 mb-1.5 text-[10px] text-slate-400">
                            <span className="font-bold text-white">
                              {isUser ? selectedUser.name : "لوكي (Loki)"}
                            </span>
                            <span>•</span>
                            <span>{msg.timestamp || new Date(msg.createdAt).toLocaleTimeString("ar-EG")}</span>
                          </div>

                          {/* Image Attachment (if user sent an image/file) */}
                          {msg.image && (
                            <div className="mb-2 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                              <img
                                src={msg.image}
                                alt="مرفق المستخدم"
                                onClick={() => setZoomedImage(msg.image)}
                                className="max-h-60 w-auto rounded-xl object-contain cursor-zoom-in hover:opacity-90 transition"
                              />
                              <p className="text-[10px] text-slate-400 p-1 text-center">
                                انقر لتكبير الصورة
                              </p>
                            </div>
                          )}

                          {/* Message Text */}
                          <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                            {msg.text}
                          </p>

                          {/* Suggestions displayed by Loki */}
                          {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                              {msg.suggestions.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-purple-300"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Users className="w-12 h-12 mb-3 opacity-30" />
              <h3 className="text-sm font-semibold text-slate-400">اختر مستخدم من القائمة الجانبية</h3>
              <p className="text-xs text-slate-500 mt-1">
                لعرض سجله الكامل مع لوكي والمرفقات والفضفضة النفسية
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <img
            src={zoomedImage}
            alt="صورة مكبرة"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
