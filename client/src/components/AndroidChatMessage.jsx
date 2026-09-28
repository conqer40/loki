import React, { useState } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown, Sparkles, Volume2, Square, Play, ArrowLeft } from "lucide-react";

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
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null
  const isPlayingThis = isPlayingAudio && currentPlayingId === msg.id;

  const handleCopy = () => {
    navigator.clipboard?.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!isLoki) {
    // User Message: Vibrant cheerful gradient bubble
    return (
      <div className="flex flex-col items-start self-start max-w-[88%] my-3 animate-fade-in">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-lg shadow-emerald-950/40 space-y-2 border border-emerald-400/20">
          {/* User Attached Image (if any) */}
          {msg.image && (
            <div className="rounded-xl overflow-hidden border border-white/20 max-w-xs bg-black/40">
              <img
                src={msg.image}
                alt="مرفق المستخدم"
                onClick={() => onZoomImage && onZoomImage(msg.image)}
                className="w-full h-auto max-h-56 object-cover rounded-xl cursor-pointer hover:opacity-95 transition"
              />
            </div>
          )}

          {msg.text && (
            <p className="text-sm sm:text-base leading-relaxed text-right whitespace-pre-line font-medium text-emerald-50">
              {msg.text}
            </p>
          )}
        </div>
        <span className="text-[11px] text-emerald-400/80 mt-1 px-1 font-medium">
          أنت • {msg.timestamp || "الآن"}
        </span>
      </div>
    );
  }

  // Loki Assistant Message: Cheerful, warm and engaging companion card
  return (
    <div className="flex flex-col w-full my-4 animate-fade-in">
      <div className="flex flex-col w-full bg-gradient-to-b from-[#131e29]/95 via-[#101923]/95 to-[#0b121a]/95 border border-emerald-500/25 rounded-3xl p-4 sm:p-5 shadow-xl shadow-black/50 relative overflow-hidden">
        {/* Cheerful iridescent glow in corner */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Companion Header Row */}
        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div className="flex items-center gap-2.5">
            {/* Loki Mascot Avatar with Glowing Ring */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 shrink-0">
              <img
                src="/loki_hero.jpg"
                alt="لوكي"
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#101923]" />
            </div>

            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 via-teal-200 to-cyan-200">
                  لوكي | صاحبك الذكي 💚
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-emerald-400/90 font-medium">حاضر وسامعك بكل اهتمام</span>
            </div>
          </div>

          <span className="text-[10px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-full font-medium">
            {msg.timestamp || "الآن"}
          </span>
        </div>

        {/* Counselor Empathetic Body */}
        <div className="text-sm sm:text-base leading-relaxed text-[#f1f5f9] pr-1 space-y-2 text-right relative z-10 font-normal">
          <p className="whitespace-pre-line">{msg.text}</p>
        </div>

        {/* Action Utilities Pill Row */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            {/* Voice Synthesis Player Button */}
            <button
              onClick={() => onSpeak(msg.text, msg.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition active:scale-95 shadow-md ${
                isPlayingThis
                  ? "bg-rose-500/25 text-rose-200 border border-rose-500/40 animate-pulse"
                  : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {isPlayingThis ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>إيقاف الصوت</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  <span>استمع لصوت لوكي 🔊</span>
                </>
              )}

              {/* Micro Audio Visualizer Wave */}
              <div className="flex items-center gap-0.5 h-3 px-0.5">
                <span className={`w-0.5 rounded-full ${isPlayingThis ? "bg-rose-300 h-3 animate-bounce" : "bg-emerald-400 h-1.5"}`} />
                <span className={`w-0.5 rounded-full ${isPlayingThis ? "bg-rose-300 h-4 animate-bounce" : "bg-emerald-400 h-2.5"}`} style={{ animationDelay: "100ms" }} />
                <span className={`w-0.5 rounded-full ${isPlayingThis ? "bg-rose-300 h-2 animate-bounce" : "bg-emerald-400 h-1"}`} style={{ animationDelay: "200ms" }} />
                <span className={`w-0.5 rounded-full ${isPlayingThis ? "bg-rose-300 h-3.5 animate-bounce" : "bg-emerald-400 h-2"}`} style={{ animationDelay: "300ms" }} />
              </div>
            </button>

            {/* Interaction Feedback (Thumb Up / Down) */}
            <div className="flex items-center bg-white/5 rounded-full px-1 py-0.5">
              <button
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
                className={`p-1.5 rounded-full transition-colors ${
                  feedback === "up" ? "text-emerald-400" : "text-slate-400 hover:text-[#8ed5ff]"
                }`}
                title="إجابة مفيدة"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFeedback(feedback === "down" ? null : "down")}
                className={`p-1.5 rounded-full transition-colors ${
                  feedback === "down" ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
                }`}
                title="بحاجة لتحسين"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Copy Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="نسخ"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Suggested Quick Reply Chips (Stitch UI style) */}
        {isLatest && msg.suggestions && msg.suggestions.length > 0 && (
          <div className="mt-4 pt-2 flex flex-col gap-2 relative z-10 animate-fade-in">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 text-right">
              <Sparkles className="w-3.5 h-3.5 text-[#ddb7ff]" />
              اقتراحات لمساعدتك الآن:
            </span>
            <div className="flex flex-col gap-1.5">
              {msg.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-right shadow-sm border border-white/5 group"
                >
                  <span className="text-xs sm:text-sm text-slate-200 group-hover:text-white">
                    {suggestion}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#8ed5ff] transition-transform group-hover:-translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
