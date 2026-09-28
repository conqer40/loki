import React from "react";
import { Plus, MessageSquare, Settings, Sparkles, X, ShieldCheck, Shield, User, Edit3, Globe } from "lucide-react";

export default function AndroidDrawer({
  isOpen,
  onClose,
  onNewChat,
  onOpenSettings,
  userProfile,
  onOpenOnboarding,
  onOpenAdmin,
}) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 max-w-[82vw] bg-[#1e1f20] border-l border-white/5 flex flex-col justify-between transition-transform duration-300 ease-out select-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/40 bg-purple-950/50">
                <img src="/logo.svg" alt="Loki" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">لوكي | Loki</h2>
                <p className="text-[10px] text-purple-300">مساعدك وصديقك النفسي</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          {userProfile && (
            <div className="p-3 mx-3 my-2 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs">
                  {userProfile.name ? userProfile.name.slice(0, 1) : "؟"}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">
                    {userProfile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono" dir="ltr">
                    {userProfile.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenOnboarding();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="تعديل بيانات البروفايل"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#282a2c] hover:bg-[#333538] text-white text-xs font-semibold transition shadow-sm active:scale-98"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#a8c7fa]" />
                محادثة جديدة
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                جديد
              </span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="px-3 py-1 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 px-3 py-1 block">
              المحادثات الأخيرة
            </span>

            <div
              onClick={() => onClose()}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] text-slate-200 text-xs hover:bg-white/[0.08] cursor-pointer transition truncate"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">فضفضة اليوم مع لوكي</span>
            </div>
            <div
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 text-xs hover:bg-white/[0.04] cursor-pointer transition truncate"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">تفريغ ضغوط الشغل والحياة</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {/* Landing Page & APK Download */}
          {onOpenLanding && (
            <button
              onClick={() => {
                onClose();
                onOpenLanding();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-300 text-xs font-semibold transition"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>الموقع الرئيسي وتحميل APK</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                Loki
              </span>
            </button>
          )}

          {/* Admin Dashboard Entry */}
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-purple-200 text-xs font-semibold transition"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>لوحة تحكم الأدمن (Dashboard)</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs transition"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>إعدادات التطبيق والصوت</span>
          </button>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>مساحتك الآمنة والسرية للفضفضة والراحة النفسية</span>
          </div>
        </div>
      </aside>
    </>
  );
}
