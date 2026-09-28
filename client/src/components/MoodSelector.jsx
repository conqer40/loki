import React from "react";

const MOODS = [
  { id: "happy", emoji: "😊", label: "مبسوط وفرحان", color: "from-amber-500/20 to-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  { id: "calm", emoji: "🌿", label: "رايق وهادي", color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "stressed", emoji: "🤯", label: "مضغوط ومشوش", color: "from-orange-500/20 to-amber-500/20 text-orange-300 border-orange-500/30" },
  { id: "sad", emoji: "💔", label: "زعلان ومخنوق", color: "from-purple-500/20 to-rose-500/20 text-rose-300 border-rose-500/30" },
  { id: "tired", emoji: "🥱", label: "طاقتي خلصانة", color: "from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30" },
];

export default function MoodSelector({ currentMood, onSelectMood }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
      <span className="text-xs text-purple-200/80 font-medium px-2 py-1">حاسس بإيه دلوقتي؟</span>
      <div className="flex flex-wrap gap-1.5">
        {MOODS.map((mood) => {
          const isSelected = currentMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-r ${mood.color} border shadow-lg shadow-purple-950/50 scale-105 font-medium`
                  : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-transparent"
              }`}
            >
              <span className="text-sm">{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
