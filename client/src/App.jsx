import React, { useState, useEffect, useRef } from "react";
import AndroidTopBar from "./components/AndroidTopBar";
import AndroidDrawer from "./components/AndroidDrawer";
import AndroidInputBar from "./components/AndroidInputBar";
import AndroidChatMessage from "./components/AndroidChatMessage";
import AndroidBottomNav from "./components/AndroidBottomNav";
import GeminiLiveModal from "./components/GeminiLiveModal";
import BreathingModal from "./components/BreathingModal";
import SettingsModal from "./components/SettingsModal";
import MoodSelector from "./components/MoodSelector";
import UserOnboardingModal from "./components/UserOnboardingModal";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";
import WelcomeChoiceModal from "./components/WelcomeChoiceModal";
import { askLoki } from "./services/lokiBrain";
import { playLokiVoice, stopLokiVoice } from "./services/lokiAudio";

export default function App() {
  // Detect if running inside native Android App (Capacitor or WebView)
  const isNativeApp =
    typeof window !== "undefined" &&
    (window.Capacitor?.isNativePlatform?.() ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      navigator.userAgent.includes("wv") ||
      navigator.userAgent.includes("Capacitor"));

  // Routing: Companion Chat vs Admin Dashboard vs Landing
  const [currentView, setCurrentView] = useState(() => {
    // If inside native Android APK, ALWAYS show the companion chat! NEVER landing!
    if (isNativeApp) return "chat";
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith("/admin") || hash === "#admin") return "admin";
    if (path.startsWith("/chat") || hash === "#chat") return "chat";
    // By default on the website, show the luxury Landing Page!
    return "landing";
  });

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("loki_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!userProfile && currentView === "chat") {
      setShowOnboarding(true);
    }
  }, [userProfile, currentView]);

  // Initial welcome message (customized with name if exists)
  const getInitialWelcome = (name) => ({
    id: "welcome",
    sender: "loki",
    text: name
      ? `يا مرحب يا ${name} يا غالي! نورتني.. إيه الأخبار وإزاي يومك ماشي؟`
      : "يا مرحب يا صاحبي! نورتني.. إيه الأخبار وإزاي يومك ماشي؟",
    timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    suggestions: [
      "يومي كان متعب شوية ومخنوق",
      "الحمد لله رايق أهو",
      "عايز أفضفض معاك في كلمتين",
    ],
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("loki_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [getInitialWelcome(userProfile?.name)];
      }
    }
    return [getInitialWelcome(userProfile?.name)];
  });

  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState("calm");
  const [showMoodBar, setShowMoodBar] = useState(false);

  // Settings: Powered exclusively by Google Gemini
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("loki_gemini_key") || "");
  const [voice, setVoice] = useState(() => localStorage.getItem("loki_voice") || "Puck");
  const [autoSpeak, setAutoSpeak] = useState(() => localStorage.getItem("loki_autospeak") !== "false");

  // Modals & Navigation
  const [showWelcomeChoice, setShowWelcomeChoice] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audio & Speech
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  // Handle URL change
  useEffect(() => {
    const handlePopState = () => {
      if (isNativeApp) {
        setCurrentView("chat");
        return;
      }
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith("/admin") || hash === "#admin") {
        setCurrentView("admin");
      } else if (path.startsWith("/chat") || hash === "#chat") {
        setCurrentView("chat");
      } else {
        setCurrentView("landing");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isNativeApp]);

  const openAdminDashboard = () => {
    window.history.pushState({}, "", "/admin");
    setCurrentView("admin");
  };

  const openChat = () => {
    window.history.pushState({}, "", "/chat");
    setCurrentView("chat");
  };

  const openLanding = () => {
    if (isNativeApp) return;
    window.history.pushState({}, "", "/");
    setCurrentView("landing");
  };

  const handleSaveUser = (user) => {
    setUserProfile(user);
    localStorage.setItem("loki_user", JSON.stringify(user));
    setShowOnboarding(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem("loki_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Web Speech STT for quick mic input
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "ar-EG";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => stopAudio();
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("خاصية الإملاء الصوتي تتطلب متصفح يدعم الميكروفون مثل Chrome أو WebView.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopAudio();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Mic start failed:", err);
      }
    }
  };

  // Fallback Native Speech Synthesis
  const fallbackSpeech = (text, messageId) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/<<<[\s\S]*?>>>/g, "").replace(/[*_#]/g, "").trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = "ar-EG";
        utterance.rate = 1.0;
        utterance.pitch = 0.95;
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setCurrentPlayingId(null);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          setCurrentPlayingId(null);
        };
        setIsPlayingAudio(true);
        setCurrentPlayingId(messageId);
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsPlayingAudio(false);
        setCurrentPlayingId(null);
      }
    } else {
      setIsPlayingAudio(false);
      setCurrentPlayingId(null);
    }
  };

  // Play Loki Warm Voice directly using robust lokiAudio service
  const speakMessage = (text, messageId) => {
    if (!text) return;

    if (isPlayingAudio && currentPlayingId === messageId) {
      stopAudio();
      return;
    }

    stopAudio();
    setIsPlayingAudio(true);
    setCurrentPlayingId(messageId);

    playLokiVoice(text, {
      onStart: () => {
        setIsPlayingAudio(true);
        setCurrentPlayingId(messageId);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setCurrentPlayingId(null);
      },
      onError: () => {
        setIsPlayingAudio(false);
        setCurrentPlayingId(null);
      },
    });
  };

  const stopAudio = () => {
    stopLokiVoice();
    setIsPlayingAudio(false);
    setCurrentPlayingId(null);
  };

  // Send message with optional image attachment
  const handleSendMessage = async (textToSend) => {
    const content = (textToSend || input).trim();
    const currentImg = attachedImage;

    if ((!content && !currentImg) || isLoading) return;

    stopAudio();
    setInput("");
    setAttachedImage(null);
    setShowMoodBar(false);

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: content,
      image: currentImg ? currentImg.data : null,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const data = await askLoki({
        message: content,
        image: currentImg,
        history: newMessages.slice(-6),
        userMood: currentMood,
        apiKey: apiKey || undefined,
      });

      const lokiMsgId = (Date.now() + 1).toString();
      const lokiMsg = {
        id: lokiMsgId,
        sender: "loki",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, lokiMsg]);

      // Async sync to server database in background for Admin monitoring
      if (userProfile?.id) {
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            image: currentImg,
            history: [],
            userId: userProfile.id,
            userName: userProfile.name,
            userPhone: userProfile.phone,
          }),
        }).catch(() => {});
      }

      if (autoSpeak) {
        speakMessage(data.reply, lokiMsgId);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg = "يا صاحبي أنا معاك وسامعك.. احكيلي تاني وسيبك من أي دوشة.";
      const lokiMsgId = (Date.now() + 1).toString();
      const errorMsg = {
        id: lokiMsgId,
        sender: "loki",
        text: fallbackMsg,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        suggestions: ["هحاول أبعت تاني", "إزيك يا لوكي؟"],
      };
      setMessages((prev) => [...prev, errorMsg]);
      if (autoSpeak) {
        speakMessage(fallbackMsg, lokiMsgId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiveVoiceMessage = (userSpoke, lokiReplied, suggestions = []) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: userSpoke,
      timestamp: time,
    };
    const lokiMsg = {
      id: (Date.now() + 1).toString(),
      sender: "loki",
      text: lokiReplied,
      timestamp: time,
      suggestions,
    };
    setMessages((prev) => [...prev, userMsg, lokiMsg]);

    // Send to backend in background so admin sees live voice chats too!
    if (userProfile?.id) {
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userSpoke,
          history: [],
          userId: userProfile.id,
          userName: userProfile.name,
          userPhone: userProfile.phone,
        }),
      }).catch(() => {});
    }
  };

  const handleNewChat = () => {
    stopAudio();
    setMessages([getInitialWelcome(userProfile?.name)]);
    localStorage.removeItem("loki_chat_history");
    setShowWelcomeChoice(true);
    setIsDrawerOpen(false);
  };

  // Render Admin Dashboard
  if (currentView === "admin") {
    return <AdminDashboard onBackToChat={openChat} />;
  }

  // Render Landing Page (Website on LOKI.ELHAWYAI.COM)
  if (currentView === "landing") {
    return <LandingPage onOpenChat={openChat} onOpenAdmin={openAdminDashboard} />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-[#0a1219] via-[#0d1722] to-[#070b0f] text-[#f1f5f9] overflow-hidden relative font-sans">
      <audio ref={audioRef} className="hidden" />

      {/* Cheerful Ambient Backdrops */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <AndroidTopBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBreathing={() => setIsBreathingOpen(true)}
        onOpenAdmin={openAdminDashboard}
        onOpenLiveVoice={() => {
          stopAudio();
          setIsLiveVoiceOpen(true);
        }}
        isNativeApp={isNativeApp}
      />

      {/* Cheerful Emotional Sanctuary Sub-Bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 bg-[#0e1722]/85 border-b border-emerald-500/15 backdrop-blur-md text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] font-bold text-emerald-300">مساحتك الآمنة مع لوكي مشفرة بالكامل 🌿</span>
        </div>

        {!isNativeApp && (
          <div className="flex items-center gap-1.5">
            <a
              href="/downloads/loki.apk"
              download="loki-ai-companion.apk"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition active:scale-95"
              title="تحميل تطبيق الأندرويد"
            >
              <span>تحميل APK</span>
            </a>
            <button
              onClick={openAdminDashboard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold border border-purple-500/30 transition active:scale-95"
            >
              <span>لوحة الأدمن</span>
            </button>
          </div>
        )}
      </div>

      {/* Mood Selector Dropdown */}
      {showMoodBar && (
        <div className="p-2 bg-[#1e1f20] border-b border-white/5 animate-fade-in">
          <MoodSelector
            currentMood={currentMood}
            onSelectMood={(m) => {
              setCurrentMood(m);
              setShowMoodBar(false);
            }}
          />
        </div>
      )}

      {/* Messages Scroll Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 max-w-3xl w-full mx-auto">
        {/* Stitch Psychological Welcoming Sanctuary Card */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#2a2a2b]/95 to-[#201f20]/90 rounded-3xl p-4 sm:p-6 border border-white/10 shadow-xl my-2 animate-fade-in">
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#38bdf8]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#a855f7]/15 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-13 h-13 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-[#38bdf8] via-[#a855f7] to-[#ec4899] shrink-0 shadow-lg">
              <img src="/loki_hero.jpg" alt="Loki" className="w-full h-full object-cover rounded-2xl" />
            </div>

            <div className="flex-1 min-w-0 text-right">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center justify-end gap-1.5">
                <span>{userProfile?.name ? `مساء الخير يا ${userProfile.name} يا غالي..` : "مساء الخير يا صاحبي.."}</span>
                <span className="text-lg">👋</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                عامل إيه النهاردة؟ حاسس بضغط ومحتاج ترتب أفكارك، ولا حابب نفضفض مع بعض بهدوء؟
              </p>

              {/* Quick Sentiment Selector Chips (from Stitch UI) */}
              <div className="mt-3.5 flex flex-wrap gap-1.5 justify-end">
                {[
                  { label: "مرتاح", emoji: "😊", msg: "الحمد لله حاسس بروقان وراحة النهاردة" },
                  { label: "متوتر ومضغوط", emoji: "😣", msg: "مضغوط شوية ومتوتر من الشغل واليوم" },
                  { label: "محتار وتعبان", emoji: "🤔", msg: "محتار في كذا حاجة وتعبت من التفكير" },
                  { label: "محتاج هدوء", emoji: "🌿", msg: "محتاج هدوء ونفس عميق ومش عايز دوشة" },
                  { label: "فرحان", emoji: "🚀", msg: "مبسوط وفرحان الحمد لله وحبيت أشاركك" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.msg)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#353436] hover:bg-[#39393a] text-xs text-slate-200 hover:text-white border border-white/5 active:scale-95 transition-all shadow-sm"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {messages.map((msg, index) => (
          <AndroidChatMessage
            key={msg.id || index}
            msg={msg}
            isLatest={index === messages.length - 1}
            isPlayingAudio={isPlayingAudio}
            currentPlayingId={currentPlayingId}
            onSpeak={speakMessage}
            onSelectSuggestion={handleSendMessage}
            onZoomImage={(img) => setZoomedImage(img)}
          />
        ))}

        {isLoading && (
          <div className="flex gap-3 my-4 animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shrink-0 shadow-md">
              <img src="/logo.svg" alt="Loki" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="px-4 py-2 rounded-full bg-[#1e1f20] border border-white/5 text-xs text-purple-300 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c48df6] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span>بيفكر وبيشوف...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Bottom Floating Android Capsule Input Bar */}
      <AndroidInputBar
        input={input}
        setInput={setInput}
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
        isListening={isListening}
        onToggleListening={toggleListening}
        onOpenLiveVoice={() => {
          stopAudio();
          setIsLiveVoiceOpen(true);
        }}
        onToggleMood={() => setShowMoodBar(!showMoodBar)}
        attachedImage={attachedImage}
        setAttachedImage={setAttachedImage}
      />

      {/* Welcome Choice Modal: Interactive Choice on Launch */}
      <WelcomeChoiceModal
        isOpen={showWelcomeChoice}
        onStartCall={() => {
          setShowWelcomeChoice(false);
          stopAudio();
          setIsLiveVoiceOpen(true);
        }}
        onStartChat={() => {
          setShowWelcomeChoice(false);
        }}
        currentMood={currentMood}
        onChangeMood={setCurrentMood}
        onClose={() => setShowWelcomeChoice(false)}
      />

      {/* Navigation Drawer */}
      <AndroidDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        userProfile={userProfile}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenAdmin={openAdminDashboard}
        onOpenLanding={openLanding}
      />

      {/* User Onboarding / Mobile Registration Modal */}
      <UserOnboardingModal
        isOpen={showOnboarding}
        onSaveUser={handleSaveUser}
      />

      {/* Gemini Live Fullscreen Voice Mode */}
      <GeminiLiveModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        onSendMessage={handleLiveVoiceMessage}
        voice={voice}
        apiKey={apiKey}
        currentMood={currentMood}
      />

      {/* Breathing Meditation Modal */}
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        voice={voice}
        setVoice={setVoice}
        autoSpeak={autoSpeak}
        setAutoSpeak={setAutoSpeak}
        onClearHistory={handleNewChat}
      />

      {/* Zoom Image Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <img
            src={zoomedImage}
            alt="صورة مكبرة"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
