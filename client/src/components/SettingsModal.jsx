import React, { useState } from "react";
import { X, Key, Volume2, Trash2, CheckCircle2, Sparkles } from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  voice,
  setVoice,
  autoSpeak,
  setAutoSpeak,
  onClearHistory,
}) {
  const [tempGeminiKey, setTempGeminiKey] = useState(apiKey || "");
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempGeminiKey.trim());
    localStorage.setItem("loki_gemini_key", tempGeminiKey.trim());
    localStorage.setItem("loki_voice", voice);

    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 rounded-3xl bg-[#1e1f20] border border-white/10 shadow-2xl text-right max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-[#a8c7fa]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-100">إعدادات Gemini والصوت البشري</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Voice Selection (Gemini Native Human Voices) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-purple-400" />
              صوت لوكي البشري (مبني مباشرة من Gemini):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVoice("Puck")}
                className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col gap-1 ${
                  voice === "Puck"
                    ? "bg-purple-950/70 border-purple-400 text-white shadow-lg"
                    : "bg-[#131314] border-white/5 text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    Gemini Puck (شاب حيوي)
                  </span>
                  {voice === "Puck" && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
                </div>
                <span className="text-[11px] text-pink-200/70">صوت شاب مصري دافئ مع أنفاس ومشاعر حقيقية</span>
              </button>

              <button
                type="button"
                onClick={() => setVoice("Fenrir")}
                className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col gap-1 ${
                  voice === "Fenrir"
                    ? "bg-purple-950/70 border-purple-400 text-white shadow-lg"
                    : "bg-[#131314] border-white/5 text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#a8c7fa]" />
                    Gemini Fenrir (شاب هادئ)
                  </span>
                  {voice === "Fenrir" && <CheckCircle2 className="w-4 h-4 text-[#a8c7fa]" />}
                </div>
                <span className="text-[11px] text-purple-200/70">نبرة أعمق وأهدى مريحة جداً للأعصاب</span>
              </button>
            </div>
          </div>

          {/* Gemini API Key Input */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-200">
                مفتاح Google Gemini API
              </label>
              <span className="text-[10px] text-emerald-400">مربوط ونشط للمخ والصوت ✅</span>
            </div>
            <input
              type="password"
              placeholder="AQ.Ab..."
              value={tempGeminiKey}
              onChange={(e) => setTempGeminiKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-white/10 text-slate-200 text-xs font-mono text-left focus:border-purple-400 outline-none"
              dir="ltr"
            />
          </div>

          {/* Auto Speak Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <p className="text-xs font-medium text-slate-200">نطق الردود بصوت Gemini تلقائياً</p>
              <p className="text-[10px] text-slate-400">تشغيل الصوت البشري فور وصول الرد</p>
            </div>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          {/* Clear History */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <p className="text-xs font-medium text-rose-300">مسح المحادثة الحالية</p>
            </div>
            <button
              onClick={() => {
                if (confirm("هل أنت متأكد من مسح المحادثة والبدء من جديد؟")) {
                  onClearHistory();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
          {savedNotice ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              تم الحفظ بنجاح!
            </span>
          ) : <span />}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-medium shadow-lg transition cursor-pointer"
            >
              حفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
