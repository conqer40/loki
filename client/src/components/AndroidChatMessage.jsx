import React, { useState } from "react";
import { Play, Square, Copy, Check, Sparkles, Volume2 } from "lucide-react";

export default function AndroidChatMessage({
  msg,
  isLatest,
  isPlayingAudio,
  currentPlayingId,
  onSpeak,
  onSelectSuggestion,
  onZoomImage,
}) {
  const isLoki = msg.sender === "loki";
  const [copied, setCopied] = useState(false);
  const isPlayingThis = isPlayingAudio && currentPlayingId === msg.id;

  const handleCopy = () => {
    navigator.clipboard?.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!isLoki) {
    // User Message (ChatGPT / Gemini Android right-aligned rounded bubble)
    return (
      <div className="flex flex-col items-start my-3 animate-fade-in">
        <div className="max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-[22px] rounded-tl-md bg-[#282a2c] text-white text-sm leading-relaxed shadow-sm select-text space-y-2">
          {/* User Attached Image (if any) */}
          {msg.image && (
            <div className="rounded-xl overflow-hidden border border-white/10 max-w-xs">
              <img
                src={msg.image}
                alt="مرفق المستخدم"
                onClick={() => onZoomImage && onZoomImage(msg.image)}
                className="w-full h-auto max-h-56 object-cover rounded-xl cursor-pointer hover:opacity-95 transition"
              />
            </div>
          )}

          {msg.text && <p className="whitespace-pre-line text-right">{msg.text}</p>}
        </div>
      </div>
    );
  }

  // Loki Assistant Message (Flat, clean, highly readable like Gemini Android)
  return (
    <div className="flex flex-col items-end my-4 animate-fade-in w-full">
      <div className="flex gap-3 max-w-[95%] sm:max-w-[90%] w-full">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shrink-0 shadow-md">
          <img src="/logo.svg" alt="Loki" className="w-full h-full object-cover rounded-full" />
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-2 text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold gemini-gradient-text">Loki</span>
            <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
          </div>

          <p className="text-sm sm:text-[15px] leading-relaxed text-slate-100 whitespace-pre-line select-text font-normal">
            {msg.text}
          </p>

          {/* Action Row Under Message (Gemini / ChatGPT style) */}
          <div className="flex items-center gap-2 pt-1 text-slate-400">
            {/* Play / Stop Audio */}
            <button
              onClick={() => onSpeak(msg.text, msg.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition active:scale-95 ${
                isPlayingThis
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300"
              }`}
            >
              {isPlayingThis ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current text-purple-400" />
                  <span>اسمع لوكي</span>
                </>
              )}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="نسخ النص"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Suggested Reply Chips */}
          {isLatest && msg.suggestions && msg.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 animate-fade-in">
              {msg.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="px-3 py-1.5 rounded-full bg-[#1e1f20] hover:bg-[#282a2c] border border-white/10 text-xs text-purple-200 hover:text-white transition active:scale-95 flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-[#a8c7fa] shrink-0" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
