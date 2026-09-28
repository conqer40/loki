import React from "react";

export default function AudioVisualizer({ isPlaying, isListening }) {
  if (!isPlaying && !isListening) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-6 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 backdrop-blur-sm">
      <span className="text-xs text-purple-300 font-medium ml-1">
        {isListening ? "بيسمعك..." : "لوكي بيتكلم..."}
      </span>
      <div className="flex items-center gap-1">
        {[40, 75, 55, 90, 60, 80, 45].map((height, i) => (
          <span
            key={i}
            className={`w-1 rounded-full ${
              isListening ? "bg-emerald-400" : "bg-purple-400"
            }`}
            style={{
              height: `${height}%`,
              animation: `pulse 0.8s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
