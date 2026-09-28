import React from "react";
import { Menu, Plus, Sparkles, Wind, Settings, Download, Lock } from "lucide-react";

export default function AndroidTopBar({
  onOpenDrawer,
  onNewChat,
  onOpenSettings,
  onOpenBreathing,
  onOpenAdmin,
}) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[#131314]/90 backdrop-blur-md border-b border-white/5 z-20 select-none">
      {/* Right side: Drawer Toggle + Loki Brand */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenDrawer}
          className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition active:scale-95"
          title="القائمة والمحادثات"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#38bdf8] via-[#a855f7] to-[#ec4899] shadow-sm">
            <img src="/loki_hero.jpg" alt="Loki" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="hidden xs:flex flex-col text-right">
            <span className="text-sm font-bold text-white tracking-wide">لوكي</span>
            <span className="text-[9px] text-[#8ed5ff]">رفيقك النفسي</span>
          </div>
        </div>
      </div>

      {/* Center: Gemini 3.5 Model Status Pill */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1f20] border border-white/10 text-xs font-semibold text-slate-200 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#38bdf8] animate-pulse" />
        <span className="text-[11px] text-transparent bg-clip-text bg-gradient-to-r from-[#8ed5ff] to-[#ddb7ff]">
          Gemini 3.5 Flash
        </span>
      </div>

      {/* Left Actions: APK Download + Admin + Breathing + New Chat */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Direct APK Download Button */}
        <a
          href="/downloads/loki.apk"
          download="loki-ai-companion.apk"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 transition active:scale-95 shadow-sm"
          title="تحميل تطبيق الأندرويد APK"
        >
          <Download className="w-3 h-3 text-emerald-400" />
          <span>تحميل APK</span>
        </a>

        {/* Admin Dashboard Entry */}
        <button
          onClick={onOpenAdmin}
          className="p-2 rounded-full hover:bg-purple-900/30 text-purple-300 hover:text-white transition active:scale-95"
          title="دخول لوحة تحكم الأدمن"
        >
          <Lock className="w-4 h-4 text-purple-400" />
        </button>

        {/* Breathing Exercise */}
        <button
          onClick={onOpenBreathing}
          className="p-2 rounded-full hover:bg-white/10 text-primary-container hover:text-white transition active:scale-95 text-[#38bdf8]"
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
