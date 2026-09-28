import React from "react";
import { PhoneCall, MessageSquare, Sparkles, Smile, Heart, Zap, ArrowLeft, Volume2, Shield } from "lucide-react";

export default function WelcomeChoiceModal({
  isOpen,
  onStartCall,
  onStartChat,
  currentMood,
  onChangeMood,
  onClose,
}) {
  if (!isOpen) return null;

  const moods = [
    { id: "calm", label: "رايق ومبسوط 😄", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300" },
    { id: "stressed", label: "مضغوط ومجهد 😮‍💨", color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300" },
    { id: "sad", label: "محتاج أفضفض 🫂", color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300" },
    { id: "vent", label: "محتار وبفكر 🤔", color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#0a1118]/90 via-[#0a0f14]/95 to-[#060a0e] backdrop-blur-xl animate-fade-in select-none overflow-y-auto">
      {/* Cheerful Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md my-auto flex flex-col items-center text-center">
        {/* Loki Mascot Avatar with Cheerful Glow */}
        <div className="relative mb-4 group cursor-pointer">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 shadow-2xl">
            <img
              src="/loki_hero.jpg"
              alt="لوكي"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {/* Active Online Badge */}
          <span className="absolute bottom-1 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black shadow-lg flex items-center gap-1 border-2 border-[#0a1118]">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
            أونلاين
          </span>
        </div>

        {/* Cheerful Greeting Typography */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>رفيقك الشخصي الذكي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
            يا هلا بيك يا صاحبي! 💚
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
            أنا لوكي.. جاهز أسمعك وأفضفض معاك في أي وقت. حابب نبدأ بإيه دلوقتي؟
          </p>
        </div>

        {/* TWO PRIMARY CHOICE CARDS */}
        <div className="w-full space-y-3.5 mb-6">
          {/* 1. Live Voice Call Card */}
          <button
            onClick={() => {
              onStartCall();
            }}
            className="w-full relative group overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900/60 via-teal-900/40 to-slate-900/80 border-2 border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-emerald-950/50 transition-all duration-300 active:scale-[0.98] text-right"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl group-hover:scale-150 transition pointer-events-none" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30 shrink-0 group-hover:rotate-6 transition">
                  <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                </div>
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition">
                      مكالمة صوتية لايف 🎙️
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      صوت فوري
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 mt-1 leading-snug">
                    تكلم واسمعني مباشرة كأننا في مكالمة حقيقية
                  </span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition shrink-0">
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </button>

          {/* 2. Text Chat Card */}
          <button
            onClick={() => {
              onStartChat();
            }}
            className="w-full relative group overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-violet-900/60 via-purple-900/40 to-slate-900/80 border-2 border-purple-500/40 hover:border-purple-400 shadow-xl shadow-purple-950/50 transition-all duration-300 active:scale-[0.98] text-right"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-xl group-hover:scale-150 transition pointer-events-none" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0 group-hover:-rotate-6 transition">
                  <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                </div>
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-white group-hover:text-purple-300 transition">
                      شات وفضفضة كتابية 💬
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                      كتابة وصور
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 mt-1 leading-snug">
                    اكتب براحتك أو شاركني صور ويومياتك
                  </span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-400 group-hover:text-white transition shrink-0">
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </button>
        </div>

        {/* Quick Mood Pills */}
        <div className="w-full bg-[#131c26]/80 border border-white/10 rounded-2xl p-3 sm:p-4 text-right">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              حاسس بإيه النهاردة؟
            </span>
            <span className="text-[10px] text-slate-500">اختر مزاجك</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {moods.map((m) => {
              const isSelected = currentMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onChangeMood && onChangeMood(m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-center active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400 text-emerald-200 shadow-sm"
                      : "bg-white/5 border-white/5 hover:border-white/20 text-slate-300"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safe & Private Badge */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>محادثاتك خاصة ومشفرة بالكامل بينك وبين لوكي فقط</span>
        </div>
      </div>
    </div>
  );
}
