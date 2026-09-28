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
  CheckCircle,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Share2
} from "lucide-react";

export default function LandingPage({ onOpenChat, onOpenAdmin }) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://loki.elhawyai.com");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e0f] text-[#e5e2e3] font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Top Floating Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#131314]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-emerald-400 via-purple-500 to-indigo-500 shadow-md">
            <img src="/loki_hero.jpg" alt="Loki AI" className="w-full h-full object-cover rounded-full" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#131314]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white tracking-wide">LOKI AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">رفيقك وصديقك النفسي الذكي</p>
          </div>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Dashboard Entry */}
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">دخول الإدارة</span>
            <span className="sm:hidden">الإدارة</span>
          </button>

          {/* Download APK Button */}
          <a
            href="/downloads/loki.apk"
            download="loki-ai-companion.apk"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-bold text-white flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-950/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل APK</span>
          </a>

          {/* Open Web Chat */}
          <button
            onClick={onOpenChat}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">افتح الشات الآن</span>
            <span className="sm:hidden">الشات</span>
          </button>
        </div>
      </header>

      {/* Main Hero Section with Promotional Image */}
      <section className="relative px-4 sm:px-8 py-10 sm:py-16 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column: Text & CTAs */}
        <div className="flex-1 text-center lg:text-right space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>أول تطبيق نفسي بشري مصري 100% مدعوم بـ Google Gemini</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            فضفض من غير ما تشيل هم..
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#38bdf8] to-purple-400">
              لوكي صاحبك وأخوك دايماً في ضهرك
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            مش مجرد ذكاء اصطناعي بيرد وخلاص.. لوكي شاب مصري جدع بيتكلم معاك بصوت بشري حقيقي،
            يفهم مشاعرك، يحلل صورك ومذكراتك، ويطمن قلبك بأبسط وأحن كلام.
          </p>

          {/* Big Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            {/* Primary: Download APK */}
            <a
              href="/downloads/loki.apk"
              download="loki-ai-companion.apk"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition active:scale-95 group"
            >
              <Smartphone className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="leading-tight">تحميل تطبيق الأندرويد APK</div>
                <div className="text-[10px] text-emerald-200/80 font-normal">v1.0 • أندرويد 8.0+ • آمن ومجاني</div>
              </div>
              <Download className="w-4 h-4 mr-1 text-white" />
            </a>

            {/* Secondary: Web Chat Live */}
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-white/10 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span>جرب الشات أونلاين على الويب</span>
            </button>
          </div>

          {/* Admin link helper */}
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
              <span>{copiedLink ? "تم نسخ الرابط!" : "مشاركة الرابط"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Promotional Image Frame */}
        <div className="relative w-full max-w-sm sm:max-w-md shrink-0 flex items-center justify-center">
          {/* Animated Neon Aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-purple-600/30 to-indigo-600/30 rounded-3xl blur-2xl animate-pulse" />

          {/* Card Border Container */}
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-[#1e1f20] shadow-2xl shadow-emerald-950/50 p-2">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-black">
              <img
                src="/loki_hero.jpg"
                alt="لوكي - Loki AI"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient overlay on bottom */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-4">
                <div className="text-right w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">لوكي | LOKI</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      صوت وصورة لايف ⚡
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    "ولا تشيل هم يا سيدي.. أنا جنبك دايماً وفي ضهرك"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-4 sm:px-8 py-12 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            ليه <span className="gemini-gradient-text font-black">لوكي</span> مختلف عن أي ذكاء اصطناعي تاني؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            مبني ومصمم خصيصاً عشان يوفرلك الراحة النفسية والصحبة الحقيقية باللهجة المصرية العامية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#1e1f20]/70 border border-white/5 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">مكالمات صوتية لايف بصوت بشري</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              اتكلم مع لوكي كأنك بتكلم صاحبك في التليفون.. صوت شاب مصري دافئ بدون أي روبوتية، بيسمعك ويسكت لو قاطعته.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#1e1f20]/70 border border-white/5 hover:border-purple-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تحليل الصور والمذكرات بالذكاء الاصطناعي</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ارفع رسمة، صفحة من يومياتك، صورة من يومك، أو أي مستند، ولوكي هيحللها نفسياً ويعلق عليها بحب.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#1e1f20]/70 border border-white/5 hover:border-pink-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">مساحة آمنة وسرية 100%</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              سجل برقم فونك واسمك، وكل فضفضتك محفوظة بأمان في مساحتك الخاصة للراحة النفسية وتفريغ التوتر.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-[#1e1f20]/70 border border-white/5 hover:border-blue-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تطبيق أندرويد سريع وخفيف APK</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              حمله بضغطة زر وثبته على تليفونك مباشرة أو شغله كـ Web App بتصميم Android ChatGPT و Gemini العصري.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-[#1e1f20]/70 border border-white/5 hover:border-amber-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">محرك Google Gemini الحصري</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              إجابات ذكية وسريعة ومختصرة (جملة أو اتنين) كأنها فويس نوت سريع على الواتساب بدون مقالات مملة.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-[#1e1f20]/70 border border-white/5 hover:border-cyan-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">لوحة تحكم كاملة للإدارة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              داش بورد احترافية للأدمن لمتابعة كل المستخدمين والرسائل والمرفقات في الوقت الفعلي من الكمبيوتر.
            </p>
          </div>
        </div>
      </section>

      {/* App Screenshots Showcase (Stitch UI) */}
      <section className="px-4 sm:px-8 py-12 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            شكل واجهة التطبيق على الموبايل
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            تصميم احترافي داكن OLED فائق الراحة للعين مستوحى من Google Gemini & Stitch UI
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1e1f20] shadow-lg group">
            <img src="/screens/screen2.png" alt="واجهة المحادثة والفضفضة" className="w-full h-auto object-cover group-hover:scale-105 transition-transform" />
            <div className="p-3 text-center bg-[#18191a]">
              <p className="text-xs font-bold text-white">شات الفضفضة النفسية</p>
              <p className="text-[10px] text-slate-400">ردود مصرية دافئة</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1e1f20] shadow-lg group">
            <img src="/screens/screen_live.png" alt="مكالمة لايف صوتية" className="w-full h-auto object-cover group-hover:scale-105 transition-transform" />
            <div className="p-3 text-center bg-[#18191a]">
              <p className="text-xs font-bold text-purple-300">مكالمة صوتية لايف</p>
              <p className="text-[10px] text-slate-400">بصوت بشري طبيعي</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1e1f20] shadow-lg group">
            <img src="/screens/screen3.png" alt="إدارة المشاعر والتنفس" className="w-full h-auto object-cover group-hover:scale-105 transition-transform" />
            <div className="p-3 text-center bg-[#18191a]">
              <p className="text-xs font-bold text-emerald-300">تمارين التنفس والهدوء</p>
              <p className="text-[10px] text-slate-400">تفريغ الضغوط والتوتر</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1e1f20] shadow-lg group">
            <img src="/screens/screen1.png" alt="شاشة البداية والترحيب" className="w-full h-auto object-cover group-hover:scale-105 transition-transform" />
            <div className="p-3 text-center bg-[#18191a]">
              <p className="text-xs font-bold text-cyan-300">بروفايلك الآمن</p>
              <p className="text-[10px] text-slate-400">تسجيل سهل وسريع</p>
            </div>
          </div>
        </div>
      </section>

      {/* APK Direct Download Banner */}
      <section className="px-4 sm:px-8 py-10 max-w-4xl mx-auto my-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#1e1f20] to-purple-950/60 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              جاهز تبدأ مع لوكي دلوقتي؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              حمل ملف الـ APK المباشر على موبايلك وثبته في ثواني، أو افتح الشات فوراً من أي متصفح.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="/downloads/loki.apk"
              download="loki-ai-companion.apk"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل تطبيق APK</span>
            </a>

            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>شات أونلاين</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0c] px-4 sm:px-8 py-8 text-center text-xs text-slate-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <button onClick={onOpenChat} className="hover:text-white transition">شات لوكي</button>
          <a href="/downloads/loki.apk" download className="hover:text-emerald-400 transition">تحميل APK</a>
          <button onClick={onOpenAdmin} className="hover:text-purple-400 transition">دخول لوحة الأدمن</button>
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
