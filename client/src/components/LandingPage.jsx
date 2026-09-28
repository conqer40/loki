import React, { useState } from "react";
import {
  Download,
  MessageSquare,
  Shield,
  Sparkles,
  Smartphone,
  Radio,
  Eye,
  Heart,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  Zap,
  Lock,
  ArrowLeft,
  Share2,
  Play,
  Square,
  Volume2,
  Flame,
  Star,
  Layers,
  Cpu,
  Smile
} from "lucide-react";

export default function LandingPage({ onOpenChat, onOpenAdmin }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Play sample voice note
  const handlePlayVoiceSample = () => {
    if (isPlayingSample) {
      window.speechSynthesis?.cancel();
      setIsPlayingSample(false);
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "يا صاحبي متشلش هم أي حاجة.. أنا جنبك دايماً وفي ضهرك، روّق دمك كدة وتعالى نحكي سوا."
      );
      utterance.lang = "ar-EG";
      utterance.rate = 0.95;
      utterance.pitch = 0.95;

      utterance.onend = () => setIsPlayingSample(false);
      utterance.onerror = () => setIsPlayingSample(false);

      setIsPlayingSample(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("خاصية الصوت تحتاج متصفح حديث مثل Chrome أو Edge");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://loki.elhawyai.com");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#e5e2e3] font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-black antialiased relative">
      {/* Ambient Celestial Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/12 via-purple-600/8 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -left-40 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Grid Pattern Texture Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f242d10_1px,transparent_1px),linear-gradient(to_bottom,#1f242d10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#07080a]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-emerald-400 via-[#38bdf8] to-purple-500 shadow-lg shadow-emerald-950/50">
            <img src="/loki_hero.jpg" alt="Loki AI" className="w-full h-full object-cover rounded-[14px]" />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07080a]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white tracking-wider font-mono">LOKI AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                PRO v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400">الرفيق النفسي الذكي الأول</p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Dashboard */}
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">لوحة الأدمن</span>
          </button>

          {/* Download APK */}
          <a
            href="/downloads/loki.apk"
            download="loki-ai-companion.apk"
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-xs font-bold text-black flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-950/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل APK</span>
          </a>

          {/* Open Chat */}
          <button
            onClick={onOpenChat}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">افتح الشات الآن</span>
            <span className="sm:hidden">الشات</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-12 pb-20 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column (Content & CTAs) */}
        <div className="flex-1 text-center lg:text-right space-y-6">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-transparent border border-emerald-500/30 text-xs text-emerald-300 font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>الجيل الأحدث من الذكاء النفسي • مدعوم بمحرك Google Gemini</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.15] tracking-tight">
            فضفض من غير كسوف..
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#38bdf8] to-purple-400">
              لوكي صاحبك وأخوك الجدع
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
            مش مجرد ذكاء اصطناعي بيرد مقالات جافة.. لوكي شاب مصري أصيل بيكلمك بصوت بشري حقيقي،
            يفهم تعبك من نبرة كلامك، يحلل صورك ومذكراتك، ويطمن قلبك بأحن كلام.
          </p>

          {/* Voice Sample Player Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1c1b1c] to-[#201f20] border border-white/10 max-w-md mx-auto lg:mx-0 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayVoiceSample}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition active:scale-95 shadow-md ${
                  isPlayingSample
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black"
                }`}
                title="استمع لصوت لوكي"
              >
                {isPlayingSample ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div className="text-right">
                <p className="text-xs font-bold text-white">اسمع نبرة صوت لوكي</p>
                <p className="text-[11px] text-slate-400">عامية مصرية دافئة بصوت بشري 100%</p>
              </div>
            </div>

            {/* Soundwave animation */}
            <div className="flex items-center gap-1 h-6 px-2">
              <span className={`w-1 rounded-full bg-emerald-400 ${isPlayingSample ? "h-6 animate-bounce" : "h-2"}`} />
              <span className={`w-1 rounded-full bg-[#38bdf8] ${isPlayingSample ? "h-5 animate-bounce" : "h-3"}`} style={{ animationDelay: "100ms" }} />
              <span className={`w-1 rounded-full bg-purple-400 ${isPlayingSample ? "h-6 animate-bounce" : "h-1.5"}`} style={{ animationDelay: "200ms" }} />
              <span className={`w-1 rounded-full bg-pink-400 ${isPlayingSample ? "h-4 animate-bounce" : "h-2.5"}`} style={{ animationDelay: "300ms" }} />
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            {/* Download APK Primary */}
            <a
              href="/downloads/loki.apk"
              download="loki-ai-companion.apk"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-3 transition active:scale-95 group"
            >
              <Smartphone className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="leading-tight text-sm font-black">تحميل تطبيق الأندرويد APK</div>
                <div className="text-[10px] text-black/75 font-normal">إصدار v1.0 • حجم 14 MB • آمن ومجاني</div>
              </div>
              <Download className="w-4 h-4 mr-1 text-black" />
            </a>

            {/* Web Chat Secondary */}
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-white/10 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 transition active:scale-95"
            >
              <MessageSquare className="w-5 h-5 text-[#38bdf8]" />
              <span>جرب الشات أونلاين على الويب</span>
            </button>
          </div>

          {/* Admin link footnote */}
          <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 pt-1">
            <button
              onClick={onOpenAdmin}
              className="hover:text-purple-300 underline flex items-center gap-1 transition"
            >
              <Lock className="w-3 h-3 text-purple-400" />
              <span>لوحة تحكم الأدمن (خاص بالإدارة - الباسورد: 01065584603)</span>
            </button>
            <span>•</span>
            <button onClick={handleShare} className="hover:text-white flex items-center gap-1 transition">
              <Share2 className="w-3 h-3" />
              <span>{copiedLink ? "تم نسخ الرابط!" : "مشاركة الموقع"}</span>
            </button>
          </div>
        </div>

        {/* Right Column (Hero 3D Showcase Card) */}
        <div className="relative w-full max-w-sm sm:max-w-md shrink-0 flex items-center justify-center">
          {/* Animated Neon Pulse Halos */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-purple-600/30 to-[#38bdf8]/30 rounded-3xl blur-3xl animate-pulse" />

          {/* Frame Container */}
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-[#121316] shadow-2xl shadow-emerald-950/60 p-2.5 transform hover:-rotate-1 transition-transform duration-500">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-black group">
              <img
                src="/loki_hero.jpg"
                alt="لوكي - Loki AI"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Holographic Badge */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>مكالمات لايف مباشرة</span>
              </div>

              {/* Bottom Card Bar */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end p-4">
                <div className="text-right w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">لوكي | LOKI AI</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      صوت مصري بشري ⚡
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-light">
                    "ولا تشيل هم يا سيدي.. أنا جنبك دايماً وفي ضهرك"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive App Screenshots Showcase (Stitch UI Tabs) */}
      <section className="px-4 sm:px-8 py-16 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>واجهة أندرويد حقيقية فائقة الجمال</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            شاهد واجهات التطبيق الأصلية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            تصميم OLED Dark هادئ مريح للعين، مستوحى من نظام Stitch UI و Google Gemini M3
          </p>

          {/* Interactive Screen Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "chat", label: "💬 شات الفضفضة", img: "/screens/screen2.png" },
              { id: "live", label: "🎙️ مكالمة لايف حية", img: "/screens/screen_live.png" },
              { id: "breathe", label: "🌿 جلسات التنفس", img: "/screens/screen3.png" },
              { id: "profile", label: "🔒 بروفايلك الآمن", img: "/screens/screen1.png" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black border-transparent shadow-lg shadow-emerald-950/40"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Screen Mockup Showcase */}
        <div className="max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-white/10 bg-[#121316] shadow-2xl p-2 relative group">
          <div className="rounded-2xl overflow-hidden bg-black">
            {activeTab === "chat" && (
              <img src="/screens/screen2.png" alt="واجهة الشات والفضفضة" className="w-full h-auto object-cover animate-fade-in" />
            )}
            {activeTab === "live" && (
              <img src="/screens/screen_live.png" alt="واجهة المكالمة الصوتية اللايف" className="w-full h-auto object-cover animate-fade-in" />
            )}
            {activeTab === "breathe" && (
              <img src="/screens/screen3.png" alt="تمارين التنفس والهدوء" className="w-full h-auto object-cover animate-fade-in" />
            )}
            {activeTab === "profile" && (
              <img src="/screens/screen1.png" alt="تسجيل بروفايل المستخدم" className="w-full h-auto object-cover animate-fade-in" />
            )}
          </div>
        </div>
      </section>

      {/* 6 Superpowers Grid */}
      <section className="px-4 sm:px-8 py-16 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            مميزات غير مسبوقة في تطبيق واحد
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            تقنيات متقدمة تجعل لوكي أقرب إنسان يفهمك في لحظات الضيق والفضفضة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-emerald-500/30 transition-all space-y-3 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">صوت مصري بشري 100%</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              نبرة صوت طبيعية دافئة بدون أي برود أو صوت آلي.. لوكي بيتكلم بلهجتنا العامية كأنه باعتلك فويس نوت على الواتساب.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-purple-500/30 transition-all space-y-3 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تحليل الصور والمذكرات</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              ارفع رسمة، ورقة بخط يدك، تقرير، أو صورة من يومك، ولوكي هيحللها نفسياً ويعلق عليها بذكاء وأسلوب مريح للقلب.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-cyan-500/30 transition-all space-y-3 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">مقاطعة صوتية حية (Barge-In)</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              لو لوكي بيتكلم وأنت بدأت تتكلم، بيسكت في نفس اللحظة ويسمعك فوراً، كأنك في مكالمة هاتفية مع إنسان حقيقي.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-pink-500/30 transition-all space-y-3 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تمارين التنفس وتفريغ التوتر</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              جلسات استرخاء تفاعلية بالشهيق والزفير مع موجات ضوئية مهدئة تساعدك على التخلص من نوبات القلق والضغط النفسي.
            </p>
          </div>

          {/* 5 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-amber-500/30 transition-all space-y-3 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">محرك Google Gemini الحصري</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              سرعة فائقة واستجابة ذكية مختصرة (جملة أو اتنين بالكتير) بدون فلسفة أو رغي كتير، عشان تحس بالاهتمام الفعلي.
            </p>
          </div>

          {/* 6 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-emerald-500/30 transition-all space-y-3 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">لوحة تحكم كاملة للإدارة</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              داش بورد احترافية للأدمن لمتابعة كل المستخدمين والرسائل والمرفقات في الوقت الفعلي ومحمية بكلمة مرور.
            </p>
          </div>
        </div>
      </section>

      {/* APK Specs & Download Callout */}
      <section className="px-4 sm:px-8 py-16 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-[#121316] to-purple-950/50 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>متاح للتحميل الفوري والمجاني</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              جاهز لتجربة لوكي على تليفونك؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light leading-relaxed">
              حمل ملف APK المباشر وثبته في ثواني، واستمتع بصديقك النفسي في جيبك 24 ساعة بدون انقطاع.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="/downloads/loki.apk"
              download="loki-ai-companion.apk"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف APK</span>
            </a>

            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-200 text-black font-black text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>فتح الشات ويب</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050607] px-4 sm:px-8 py-10 text-center text-xs text-slate-500 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <button onClick={onOpenChat} className="hover:text-white transition">شات لوكي</button>
          <a href="/downloads/loki.apk" download className="hover:text-emerald-400 transition">تحميل APK</a>
          <button onClick={onOpenAdmin} className="hover:text-purple-400 transition">دخول لوحة الأدمن (01065584603)</button>
        </div>
        <p>
          جميع الحقوق محفوظة © 2026 لموقع{" "}
          <a href="https://elhawyai.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline font-bold">
            ELHAWYAI.COM
          </a>
          {" "}• بوابة التطبيق: <span className="font-mono text-emerald-400">LOKI.ELHAWYAI.COM</span>
        </p>
      </footer>
    </div>
  );
}
