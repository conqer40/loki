import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Download,
  MessageSquare,
  Shield,
  Sparkles,
  Smartphone,
  Radio,
  Eye,
  Heart,
  Zap,
  Lock,
  Share2,
  Cpu,
  Layers,
  CheckCircle2,
  Send,
  RefreshCw,
  Activity,
  Smile,
  Frown,
  Meh,
  AlertCircle
} from "lucide-react";

export default function LandingPage({ onOpenChat, onOpenAdmin }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [copiedLink, setCopiedLink] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Interactive Live Chat Simulator in Hero
  const [simulatedMood, setSimulatedMood] = useState("calm");
  const [simulatedMessages, setSimulatedMessages] = useState([
    {
      id: 1,
      sender: "loki",
      text: "يا مرحب يا غالي نورتني! عامل إيه النهاردة؟ حاسس بضغط ومحتاج ترتب أفكارك، ولا حابب نفضفض مع بعض بهدوء؟",
      time: "الآن"
    }
  ]);
  const [isLokiTyping, setIsLokiTyping] = useState(false);

  // Interactive Mood Selector in Hero/Showcase
  const moodPresets = [
    {
      id: "stressed",
      label: "مضغوط ومخنوق",
      emoji: "😣",
      color: "from-rose-500/20 to-orange-500/20 border-rose-500/40 text-rose-300",
      userPrompt: "يومي كان متعب جداً وحاسس إني مضغوط ومخنوق من كذا حاجة",
      reply: "سلامتك من الخنقة والضغط يا صاحبي.. أول حاجة خد نفس عميق دلوقتي حالا، وركز معايا: مفيش حاجة تستاهل تدمر صحتك علشانها.. فضفضلي براحتك إيه اللي حصل؟"
    },
    {
      id: "overthinking",
      label: "محتار وتعبان تفكير",
      emoji: "🤔",
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300",
      userPrompt: "دماغي مش بتبطل تفكير في كذا سيناريو ومش عارف أقرر إيه",
      reply: "يا غالي التفكير الزايد كأنه دوامة بتاكلك على الفاضي.. تعال نجزأ الموضوع ده حتة حتة ونرتب الأولويات واحدة واحدة سوا."
    },
    {
      id: "happy",
      label: "رايق ومبسوط",
      emoji: "😊",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
      userPrompt: "الحمد لله رايق النهاردة ومبسوط وعايز أشاركك إحساسي",
      reply: "يا رب دايماً رايق ومبتسم يا أخي! فرحتك دي بتفرحني، كمل يومك بالطاقة الحلوة دي واستمتع بكل دقيقة! 🌟"
    },
    {
      id: "lonely",
      label: "عايز ونس وفضفضة",
      emoji: "🌿",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300",
      userPrompt: "حاسس بوحدة شوية ومحتاج حد يفهمني بجد",
      reply: "أنا جنبك وفي ضهرك يا صاحبي في أي ثانية.. مش هسيبك، اتكلم معايا في أي حاجة تيجي على بالك أنا سامعك بكل ود."
    }
  ];

  const handleSimulatedPrompt = (preset) => {
    if (isLokiTyping) return;
    setSimulatedMood(preset.id);

    // Trigger subtle confetti on happy mood
    if (preset.id === "happy") {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#10b981", "#38bdf8", "#a855f7"]
        });
      } catch {
        // ignore
      }
    }

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: preset.userPrompt,
      time: "الآن"
    };

    setSimulatedMessages((prev) => [...prev, userMsg]);
    setIsLokiTyping(true);

    setTimeout(() => {
      setIsLokiTyping(false);
      setSimulatedMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "loki",
          text: preset.reply,
          time: "الآن"
        }
      ]);
    }, 1100);
  };

  const handleResetChatSim = () => {
    setSimulatedMessages([
      {
        id: 1,
        sender: "loki",
        text: "يا مرحب يا غالي نورتني! عامل إيه النهاردة؟ حاسس بضغط ومحتاج ترتب أفكارك، ولا حابب نفضفض مع بعض بهدوء؟",
        time: "الآن"
      }
    ]);
    setIsLokiTyping(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://loki.elhawyai.com");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Track scroll position for sticky download capsule
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#07080a] text-[#e5e2e3] font-sans selection:bg-emerald-500 selection:text-black antialiased relative">
      {/* Dynamic Animated Ambient Celestial Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-emerald-500/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none -z-10 animate-glow-shift" />
      <div className="fixed -bottom-20 right-0 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-float-slow" />
      <div className="fixed top-1/3 -left-48 w-[500px] h-[500px] bg-purple-600/12 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-gentle" />

      {/* Grid Pattern Texture Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f242d12_1px,transparent_1px),linear-gradient(to_bottom,#1f242d12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#07080a]/85 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-emerald-400 via-[#38bdf8] to-purple-500 shadow-lg shadow-emerald-950/50 group cursor-pointer">
            <img
              src="/loki_hero.jpg"
              alt="Loki AI"
              className="w-full h-full object-cover rounded-[14px] group-hover:scale-110 transition-transform duration-500"
            />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07080a] animate-ping" />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07080a]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white tracking-wider font-mono">LOKI AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                PRO v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>الرفيق النفسي الذكي الأول في مصر</span>
            </p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Dashboard */}
          <button
            onClick={onOpenAdmin}
            className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/30 text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-sm hover:shadow-purple-900/30"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline font-semibold">لوحة الأدمن</span>
          </button>

          {/* Download APK */}
          <a
            href="/downloads/loki.apk"
            download="loki-ai-companion.apk"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-xs font-bold text-black flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-emerald-950/40 hover:shadow-emerald-500/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل APK</span>
          </a>

          {/* Open Chat */}
          <button
            onClick={onOpenChat}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 shadow-md hover:shadow-white/20"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">افتح الشات الآن</span>
            <span className="sm:hidden">الشات</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-10 pb-16 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column (Content & Interactive Simulated Chat) */}
        <div className="flex-1 text-center lg:text-right space-y-6">
          {/* Animated Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-purple-500/10 to-transparent border border-emerald-500/30 text-xs text-emerald-300 font-semibold shadow-inner animate-pulse-halo">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>الجيل الأحدث من الذكاء النفسي • مدعوم بـ Google Gemini</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
            فضفض من غير كسوف..
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#38bdf8] to-purple-400">
              لوكي صاحبك وأخوك الجدع
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
            مش مجرد ذكاء اصطناعي بيرد مقالات جافة.. لوكي شاب مصري أصيل، يفهم تعبك من كلامك،
            يحلل صورك ومذكراتك، ويطمن قلبك بأحن وأصدق كلام في أي وقت.
          </p>

          {/* Interactive Live Chat Simulator Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#121316]/95 border border-white/10 shadow-2xl space-y-3.5 max-w-xl mx-auto lg:mx-0 text-right backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChatSim}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="إعادة ضبط التجربة"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-400 font-mono">جرّب دردشة حية فورية الآن ⚡</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-bold text-white">لوكي متصل الآن</span>
              </div>
            </div>

            {/* Chat Bubble List */}
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {simulatedMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {m.sender === "loki" && (
                    <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 border border-emerald-500/40">
                      <img src="/loki_hero.jpg" alt="Loki" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[85%] ${
                      m.sender === "user"
                        ? "bg-gradient-to-l from-emerald-500 to-teal-600 text-black font-semibold rounded-tr-none shadow-md"
                        : "bg-[#1f2024] border border-white/5 text-slate-200 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isLokiTyping && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse pt-1">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-emerald-500/30">
                    <img src="/loki_hero.jpg" alt="Loki" className="w-full h-full object-cover" />
                  </div>
                  <span className="bg-[#1f2024] px-3 py-1.5 rounded-full border border-white/5 text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="mr-1">لوكي بيكتبلك...</span>
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Prompt Pills */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-[11px] text-slate-400 mb-2">اضغط على أي شعور وجرب رد لوكي التفاعلي:</p>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {moodPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSimulatedPrompt(preset)}
                    disabled={isLokiTyping}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 shadow-sm hover:scale-105 ${
                      simulatedMood === preset.id
                        ? `${preset.color} ring-1 ring-white/20`
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/5"
                    }`}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            {/* Download APK Primary */}
            <a
              href="/downloads/loki.apk"
              download="loki-ai-companion.apk"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-3 transition-all active:scale-95 group hover:-translate-y-1"
            >
              <Smartphone className="w-5 h-5 text-black group-hover:rotate-12 transition-transform duration-300" />
              <div className="text-right">
                <div className="leading-tight text-sm font-black">تحميل تطبيق الأندرويد APK</div>
                <div className="text-[10px] text-black/80 font-medium">إصدار v1.0 • حجم 5.1 MB • تثبيت مباشر فوري</div>
              </div>
              <Download className="w-4 h-4 mr-1 text-black animate-bounce" />
            </a>

            {/* Web Chat Secondary */}
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-white/10 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 hover:-translate-y-1 hover:border-[#38bdf8]/40"
            >
              <MessageSquare className="w-5 h-5 text-[#38bdf8]" />
              <span>جرب الشات الكامل على الويب</span>
            </button>
          </div>

          {/* Admin link footnote */}
          <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 pt-1">
            <button
              onClick={onOpenAdmin}
              className="hover:text-purple-300 underline flex items-center gap-1 transition"
            >
              <Lock className="w-3 h-3 text-purple-400" />
              <span>دخول لوحة تحكم الأدمن (كلمة السر: 01065584603)</span>
            </button>
            <span>•</span>
            <button onClick={handleShare} className="hover:text-white flex items-center gap-1 transition">
              <Share2 className="w-3 h-3" />
              <span>{copiedLink ? "تم نسخ الرابط!" : "مشاركة الموقع"}</span>
            </button>
          </div>
        </div>

        {/* Right Column (Hero 3D Animated Showcase Card) */}
        <div className="relative w-full max-w-sm sm:max-w-md shrink-0 flex items-center justify-center">
          {/* Animated Glowing Radial Halos */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/35 via-purple-600/35 to-[#38bdf8]/35 rounded-3xl blur-3xl animate-glow-shift" />

          {/* Frame Container with Floating Motion */}
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-[#121316] shadow-2xl shadow-emerald-950/70 p-2.5 animate-float-gentle group transition-transform duration-500 hover:scale-[1.02]">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-black">
              <img
                src="/loki_hero.jpg"
                alt="لوكي - Loki AI"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Holographic Live Status Pill */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/50 text-[11px] font-bold text-emerald-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>رفيقك النفسي 24/7</span>
              </div>

              {/* Floating Stat Pill Left */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-medium text-slate-200 flex items-center gap-1.5 shadow-lg">
                <Activity className="w-3 h-3 text-[#38bdf8]" />
                <span>استجابة فورية</span>
              </div>

              {/* Bottom Card Bar */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-end p-4">
                <div className="text-right w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">لوكي | LOKI AI</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      شاب مصري جدع ⚡
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-light">
                    "ولا تشيل هم يا صاحبي.. أنا جنبك دايماً وفي ضهرك"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive App Screenshots Showcase (Stitch UI Tabs) */}
      <section className="px-4 sm:px-8 py-16 max-w-6xl mx-auto border-t border-white/10 relative">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>واجهات أندرويد حقيقية فائقة الجمال</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            شاهد شاشات التطبيق الأصلية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            تصميم OLED Dark هادئ مريح للعين، مستوحى من نظام Stitch UI و Material You
          </p>

          {/* Interactive Screen Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "chat", label: "💬 شات الفضفضة", desc: "محادثة مريحة تشبه الواتساب مع اقتراحات مشاعر" },
              { id: "live", label: "🎙️ مكالمة حية مباشرة", desc: "صوت مصري دافئ مع مقاطعة فورية Barge-in" },
              { id: "breathe", label: "🌿 جلسات التنفس", desc: "تمارين استرخاء لتفريغ نوبات القلق والتوتر" },
              { id: "profile", label: "🔒 بروفايلك الخاص", desc: "تسجيل فوري بالاسم ورقم التليفون لحفظ محادثاتك" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 border flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black border-transparent shadow-lg shadow-emerald-950/50 scale-105"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Screen Mockup Showcase with Interactive Frame */}
        <div className="max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-white/10 bg-[#121316] shadow-2xl p-2 relative group hover:border-emerald-500/40 transition-all duration-500 animate-float-slow">
          <div className="rounded-2xl overflow-hidden bg-black shadow-inner">
            {activeTab === "chat" && (
              <img
                src="/screens/screen2.png"
                alt="واجهة الشات والفضفضة"
                className="w-full h-auto object-cover transition-all duration-500 hover:scale-105"
              />
            )}
            {activeTab === "live" && (
              <img
                src="/screens/screen_live.png"
                alt="واجهة المكالمة الصوتية اللايف"
                className="w-full h-auto object-cover transition-all duration-500 hover:scale-105"
              />
            )}
            {activeTab === "breathe" && (
              <img
                src="/screens/screen3.png"
                alt="تمارين التنفس والهدوء"
                className="w-full h-auto object-cover transition-all duration-500 hover:scale-105"
              />
            )}
            {activeTab === "profile" && (
              <img
                src="/screens/screen1.png"
                alt="تسجيل بروفايل المستخدم"
                className="w-full h-auto object-cover transition-all duration-500 hover:scale-105"
              />
            )}
          </div>
        </div>
      </section>

      {/* 6 Superpowers Grid with Interactive Tilt & Hover Glows */}
      <section className="px-4 sm:px-8 py-16 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قوة الذكاء الاصطناعي مع قلب إنسان</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            مميزات غير مسبوقة في تطبيق واحد
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            تقنيات صممت خصيصاً لتجعل لوكي أقرب صاحب يفهمك في لحظات الضيق والفضفضة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-emerald-500/40 hover:-translate-y-2 transition-all duration-300 space-y-3 group shadow-lg hover:shadow-emerald-950/40">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">صوت مصري بشري 100%</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              نبرة صوت طبيعية دافئة بدون أي برود أو صوت آلي.. لوكي بيتكلم بلهجتنا العامية كأنه باعتلك فويس نوت على الواتساب.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-purple-500/40 hover:-translate-y-2 transition-all duration-300 space-y-3 group shadow-lg hover:shadow-purple-950/40">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">تحليل الصور والمذكرات</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              ارفع رسمة، ورقة بخط يدك، تقرير، أو صورة من يومك، ولوكي هيحللها نفسياً ويعلق عليها بذكاء وأسلوب مريح للقلب.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-cyan-500/40 hover:-translate-y-2 transition-all duration-300 space-y-3 group shadow-lg hover:shadow-cyan-950/40">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">مقاطعة صوتية حية (Barge-In)</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              لو لوكي بيتكلم وأنت بدأت تتكلم، بيسكت في نفس اللحظة ويسمعك فوراً، كأنك في مكالمة هاتفية مع إنسان حقيقي.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-pink-500/40 hover:-translate-y-2 transition-all duration-300 space-y-3 group shadow-lg hover:shadow-pink-950/40">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">تمارين التنفس وتفريغ التوتر</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              جلسات استرخاء تفاعلية بالشهيق والزفير مع موجات ضوئية مهدئة تساعدك على التخلص من نوبات القلق والضغط النفسي.
            </p>
          </div>

          {/* 5 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-amber-500/40 hover:-translate-y-2 transition-all duration-300 space-y-3 group shadow-lg hover:shadow-amber-950/40">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">محرك Google Gemini الذكي</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              استجابة سريعة ومختصرة (جملة أو جملتين بالكتير)، يفهمك بدون فلسفة أو رغي زايد، عشان تحس باهتمامه الفعلي.
            </p>
          </div>

          {/* 6 */}
          <div className="p-6 rounded-3xl bg-[#121316] border border-white/5 hover:border-emerald-500/40 hover:-translate-y-2 transition-all duration-300 space-y-3 group shadow-lg hover:shadow-emerald-950/40">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">لوحة تحكم كاملة للإدارة</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              داش بورد احترافية للأدمن لمتابعة كل المستخدمين والرسائل والمرفقات في الوقت الفعلي ومحمية بكلمة مرور.
            </p>
          </div>
        </div>
      </section>

      {/* APK Specs & Download Callout */}
      <section className="px-4 sm:px-8 py-16 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-[#121316] to-purple-950/50 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
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
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition active:scale-95 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف APK</span>
            </a>

            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-200 text-black font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>فتح الشات ويب</span>
            </button>
          </div>
        </div>
      </section>

      {/* Floating Sticky Download Capsule (appears on scroll) */}
      {scrollY > 300 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#121316]/90 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-white hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>لوكي جاهز يسمعك</span>
          </div>
          <a
            href="/downloads/loki.apk"
            download="loki-ai-companion.apk"
            className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition active:scale-95 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل APK</span>
          </a>
          <button
            onClick={onOpenChat}
            className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-200 text-black text-xs font-black flex items-center gap-1.5 transition active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>الشات</span>
          </button>
        </div>
      )}

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
