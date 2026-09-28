import React, { useState } from "react";
import { User, Phone, Sparkles, HeartHandshake, ArrowLeft } from "lucide-react";

export default function UserOnboardingModal({ isOpen, onSaveUser }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("من فضلك اكتب اسمك أو اللقب اللي تحب أندهلك بيه");
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setError("من فضلك اكتب رقم موبايلك للتواصل وحفظ بروفايلك");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const storedId = localStorage.getItem("loki_user_id") || `usr_${Date.now()}`;
      localStorage.setItem("loki_user_id", storedId);

      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: storedId,
          name: name.trim(),
          phone: phone.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        onSaveUser(data.user);
      } else {
        // Fallback local save
        onSaveUser({ id: storedId, name: name.trim(), phone: phone.trim() });
      }
    } catch (err) {
      console.warn("Register error, saving locally:", err);
      onSaveUser({
        id: `usr_${Date.now()}`,
        name: name.trim(),
        phone: phone.trim()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#1e1f20] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-950/50 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#131314] flex items-center justify-center">
              <HeartHandshake className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
              <span>أهلاً بيك يا غالي في</span>
              <span className="gemini-gradient-text font-black">لوكي</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
              أنا صاحبك وأخوك اللي تقدر تفضفض معاه في أي وقت براحتك ومن غير كسوف 🌿
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 relative z-10">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center animate-shake">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 justify-end">
              <span>اسمك أو اللقب</span>
              <User className="w-3.5 h-3.5 text-purple-400" />
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أحمد، مريم، صاحبك"
              className="w-full py-3 px-4 rounded-2xl bg-[#282a2c] border border-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-right"
              autoFocus
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 justify-end">
              <span>رقم الموبايل / واتساب</span>
              <Phone className="w-3.5 h-3.5 text-[#a8c7fa]" />
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: 01012345678"
              dir="ltr"
              className="w-full py-3 px-4 rounded-2xl bg-[#282a2c] border border-white/5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#a8c7fa]/50 transition-colors text-right"
            />
            <p className="text-[10px] text-slate-500 text-right">
              * عشان نربط محادثاتك ونحفظ بروفايلك وتفضل دايمًا متصل بصاحبك لوكي.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition active:scale-98"
          >
            {isSubmitting ? (
              <span>بنجهزلك مكانك...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>يلا نبدأ الفضفضة</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-[10px] text-slate-500">
            🔒 مساحتك آمنة وخاصة ومحادثاتك محفوظة بعناية
          </p>
        </div>
      </div>
    </div>
  );
}
