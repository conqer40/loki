import React from "react";
import { Menu, Plus, Sparkles, Wind, Settings, Download, Lock, PhoneCall } from "lucide-react";

export default function AndroidTopBar({
  onOpenDrawer,
  onNewChat,
  onOpenSettings,
  onOpenBreathing,
  onOpenAdmin,
  onOpenLiveVoice,
  isNativeApp = false,
}) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[#0d1622]/95 backdrop-blur-md border-b border-emerald-500/20 z-20 select-none shadow-md">
      {/* Right side: Drawer Toggle + Loki Brand */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenDrawer}
          className="p-2 rounded-full hover:bg-white/10 text-emerald-300 hover:text-white transition active:scale-95"
          title="القائمة والمحادثات"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={onNewChat}>
          <div className="relative w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 shadow-sm">
            <img src="/loki_hero.jpg" alt="Loki" className="w-full h-full object-cover rounded-full" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
          </div>
          <div className="hidden xs:flex flex-col text-right">
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
              لوكي 💚
            </span>
            <span className="text-[9px] text-emerald-400/80 font-medium">رفيقك الذكي</span>
          </div>
        </div>
      </div>

      {/* Center: Live Call Direct Button (Prominent & Cheerful) */}
      <button
        onClick={onOpenLiveVoice}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition active:scale-95 animate-pulse"
        title="بدء مكالمة صوتية لايف مباشرة مع لوكي"
      >
        <PhoneCall className="w-3.5 h-3.5" />
        <span>مكالمة صوتية لايف 🎙️</span>
      </button>

      {/* Left Actions: New Chat + Breathing + Settings */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Breathing Exercise */}
        <button
          onClick={onOpenBreathing}
          className="p-2 rounded-full hover:bg-emerald-500/15 text-emerald-400 hover:text-white transition active:scale-95"
          title="جلسة تنفس واسترخاء"
        >
          <Wind className="w-4 h-4" />
        </button>

        {/* New Chat */}
        <button
          onClick={onNewChat}
          className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition active:scale-95"
          title="محادثة جديدة"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition active:scale-95"
          title="الإعدادات"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
