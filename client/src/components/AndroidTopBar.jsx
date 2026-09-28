import React from "react";
import { Menu, Plus, Sparkles, Wind, Settings } from "lucide-react";

export default function AndroidTopBar({
  onOpenDrawer,
  onNewChat,
  onOpenSettings,
  onOpenBreathing,
}) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#131314]/90 backdrop-blur-md border-b border-white/5 z-20 select-none">
      {/* Drawer Hamburger Menu Button */}
      <button
        onClick={onOpenDrawer}
        className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition active:scale-95"
        title="القائمة الجانبية والمحادثات"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Model Indicator: Powered Exclusively by Google Gemini */}
      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e1f20] border border-white/5 text-xs font-semibold text-slate-200 shadow-sm">
        <span className="gemini-gradient-text font-bold">Loki</span>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#a8c7fa]" />
          Gemini 3.5
        </span>
      </div>

      {/* Right Actions: Breathing & Settings & New Chat */}
      <div className="flex items-center gap-1">
        <button
          onClick={onOpenBreathing}
          className="p-2 rounded-full hover:bg-white/10 text-purple-400 hover:text-purple-300 transition active:scale-95"
          title="تمرين التنفس والاسترخاء"
        >
          <Wind className="w-5 h-5" />
        </button>

        <button
          onClick={onNewChat}
          className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition active:scale-95"
          title="محادثة جديدة"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition active:scale-95"
          title="الإعدادات"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
