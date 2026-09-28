import React from "react";
import { MessageSquare, Mic, Wind, User, Settings } from "lucide-react";

export default function AndroidBottomNav({
  activeTab = "chat",
  onSelectTab,
  onOpenLiveVoice,
  onOpenBreathing,
  onOpenProfile,
  onOpenSettings,
}) {
  return (
    <nav className="fixed bottom-3 inset-x-3 sm:max-w-md sm:mx-auto z-30 select-none">
      <div className="bg-[#1e1f20]/90 backdrop-blur-2xl border border-white/10 rounded-full px-3 py-2 shadow-2xl flex items-center justify-around">
        {/* Chat / Companion */}
        <button
          onClick={() => onSelectTab("chat")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all active:scale-95 ${
            activeTab === "chat"
              ? "text-emerald-400 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">فضفضة</span>
        </button>

        {/* Live Voice Call - Highlighted Center Aurora Action */}
        <button
          onClick={onOpenLiveVoice}
          className="flex flex-col items-center -mt-5 transition-all active:scale-90 group"
          title="مكالمة صوتية حية مع لوكي"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#38bdf8] via-[#a855f7] to-[#ec4899] p-0.5 shadow-xl shadow-purple-900/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#131314] flex items-center justify-center">
              <Mic className="w-6 h-6 text-white group-hover:text-[#38bdf8] transition-colors animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#ec4899] mt-0.5">
            مكالمة لايف
          </span>
        </button>

        {/* Breathing Sanctuary */}
        <button
          onClick={onOpenBreathing}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all active:scale-95 ${
            activeTab === "breathe"
              ? "text-emerald-400 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Wind className="w-5 h-5" />
          <span className="text-[10px]">استرخاء</span>
        </button>

        {/* Profile */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">بروفايلي</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">إعدادات</span>
        </button>
      </div>
    </nav>
  );
}
