import React, { useState, useEffect } from "react";
import { X, Heart, Wind } from "lucide-react";

export default function BreathingModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState("شهيق"); // شهيق, اكتم, زفير
  const [timer, setTimer] = useState(4);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    let currentPhase = "inhale";
    let count = 4;
    setPhase("شهيق عميق بالراحة...");
    setTimer(4);
    setScale(1.35);

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (currentPhase === "inhale") {
          currentPhase = "hold";
          count = 4;
          setPhase("احبس نفسك ثواني...");
          setScale(1.35);
        } else if (currentPhase === "hold") {
          currentPhase = "exhale";
          count = 4;
          setPhase("زفير بطيء وطلع كل التوتر...");
          setScale(0.9);
        } else {
          currentPhase = "inhale";
          count = 4;
          setPhase("شهيق عميق بالراحة...");
          setScale(1.35);
        }
      }
      setTimer(count);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 text-center shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-purple-300">
            <Wind className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-sm">تمرين التنفس مع لوكي</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-8">
          غمض عينك، رخي كتافك، وركز مع الدائرة.. كل التوتر هيمشي بهدوء
        </p>

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center h-64 my-4">
          {/* Animated pulsing outer halo */}
          <div
            className="absolute rounded-full bg-gradient-to-tr from-purple-600/20 via-pink-500/20 to-indigo-500/20 blur-xl transition-all duration-1000 ease-in-out"
            style={{
              width: "220px",
              height: "220px",
              transform: `scale(${scale * 1.1})`,
            }}
          />

          {/* Main Visual Circle */}
          <div
            className="relative flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-purple-700 via-pink-600 to-indigo-600 shadow-2xl transition-all duration-1000 ease-in-out border border-white/20"
            style={{
              width: "170px",
              height: "170px",
              transform: `scale(${scale})`,
            }}
          >
            <Heart className="w-7 h-7 text-white/90 mb-1 animate-pulse" />
            <span className="text-3xl font-bold text-white tracking-wider">{timer}</span>
            <span className="text-[11px] text-purple-200 mt-1">ثواني</span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200">
            {phase}
          </h3>
          <p className="text-xs text-purple-300/70 mt-2">
            "أنت في أمان دلوقتي، سيب كل حاجة وحس بأنفاسك"
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-medium text-sm transition cursor-pointer"
        >
          أنا بقيت أحسن الحمد لله ✨
        </button>
      </div>
    </div>
  );
}
