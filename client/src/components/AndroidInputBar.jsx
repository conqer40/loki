import React, { useRef } from "react";
import { Send, Mic, MicOff, Smile, Radio, Image as ImageIcon, X } from "lucide-react";

export default function AndroidInputBar({
  input,
  setInput,
  onSend,
  isLoading,
  isListening,
  onToggleListening,
  onOpenLiveVoice,
  onToggleMood,
  attachedImage,
  setAttachedImage,
}) {
  const fileInputRef = useRef(null);
  const hasText = Boolean(input.trim());
  const hasContent = hasText || Boolean(attachedImage);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("من فضلك اختر ملف صورة (JPEG, PNG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({
        data: reader.result,
        name: file.name,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
  };

  return (
    <div className="p-3 sm:p-4 bg-gradient-to-t from-[#131314] via-[#131314]/95 to-transparent z-20">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex flex-col gap-2 max-w-3xl mx-auto"
      >
        {/* Attached Image Preview Chip */}
        {attachedImage && (
          <div className="flex items-center gap-2 p-1.5 pr-3 pl-2 rounded-2xl bg-[#1e1f20] border border-purple-500/30 w-fit shadow-md animate-fade-in">
            <img
              src={attachedImage.data}
              alt="معاينة المرفق"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xs text-purple-200 truncate max-w-[160px]">
              {attachedImage.name || "صورة مرفقة"}
            </span>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="إزالة الصورة"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Floating Capsule Input Pill */}
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#121c27] border border-emerald-500/30 shadow-lg focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            {/* Mood / Extras toggle icon */}
            <button
              type="button"
              onClick={onToggleMood}
              className="p-2 rounded-full hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition active:scale-95 shrink-0"
              title="حالتك المزاجية"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Image / Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full transition active:scale-95 shrink-0 ${
                attachedImage
                  ? "bg-emerald-500/30 text-emerald-300"
                  : "hover:bg-white/10 text-slate-400 hover:text-emerald-300"
              }`}
              title="إرفاق صورة أو رسمة أو مذكرة للوكي"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? "سامعك يا صاحبي.. اتكلم براحتك..."
                  : attachedImage
                  ? "اكتب تعليق على الصورة أو اضغط إرسال..."
                  : "فضفض مع لوكي.. احكي أي حاجة في بالك..."
              }
              disabled={isLoading}
              className="flex-1 py-2 px-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />

            {/* Mic Button (Speech-to-Text) */}
            <button
              type="button"
              onClick={onToggleListening}
              className={`p-2 rounded-full transition active:scale-95 shrink-0 ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "hover:bg-white/10 text-emerald-400 hover:text-emerald-300"
              }`}
              title={isListening ? "إيقاف الاستماع" : "إملاء صوتي"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          {/* Action Button: Send or Gemini Live Voice Button */}
          {hasContent ? (
            <button
              type="submit"
              disabled={isLoading}
              className="p-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-95 transition active:scale-95 shadow-lg shadow-emerald-950/60 flex items-center justify-center shrink-0 border border-emerald-400/30"
              title="إرسال"
            >
              <Send className="w-4 h-4 transform rotate-180" />
            </button>
          ) : (
            /* The Iconic Gemini Live Voice Mode Button */
            <button
              type="button"
              onClick={onOpenLiveVoice}
              className="relative p-3.5 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white hover:opacity-95 transition active:scale-95 shadow-xl shadow-emerald-950/70 flex items-center justify-center shrink-0 group border border-emerald-400/40"
              title="مكالمة صوتية لايف مباشرة مع لوكي"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 blur-xs animate-ping pointer-events-none" />
              <Radio className="w-5 h-5 relative z-10 animate-pulse text-white" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
