import React, { useState, useEffect, useRef } from "react";
import AndroidTopBar from "./components/AndroidTopBar";
import AndroidDrawer from "./components/AndroidDrawer";
import AndroidInputBar from "./components/AndroidInputBar";
import AndroidChatMessage from "./components/AndroidChatMessage";
import GeminiLiveModal from "./components/GeminiLiveModal";
import BreathingModal from "./components/BreathingModal";
import SettingsModal from "./components/SettingsModal";
import MoodSelector from "./components/MoodSelector";
import UserOnboardingModal from "./components/UserOnboardingModal";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";

export default function App() {
  // Routing: Landing Page vs Chat View vs Admin Dashboard
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith("/admin") || hash === "#admin") return "admin";
    if (path.startsWith("/chat") || hash === "#chat") return "chat";
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
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Modals & Navigation
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
  }, []);

  const openAdminDashboard = () => {
    window.history.pushState({}, "", "/admin");
    setCurrentView("admin");
  };

  const openChat = () => {
    window.history.pushState({}, "", "/chat");
    setCurrentView("chat");
  };

  const openLanding = () => {
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
      alert("خاصية الإملاء الصوتي تتطلب متصفح Chrome أو Edge.");
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

  // Play Gemini Human Voice directly
  const speakMessage = async (text, messageId) => {
    if (!text) return;

    if (isPlayingAudio && currentPlayingId === messageId) {
      stopAudio();
      return;
    }

    stopAudio();
    setIsPlayingAudio(true);
    setCurrentPlayingId(messageId);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, apiKey }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();

        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
          setCurrentPlayingId(null);
        };
        audioRef.current.onpause = () => {
          setIsPlayingAudio(false);
          setCurrentPlayingId(null);
        };
        audioRef.current.onerror = () => {
          setIsPlayingAudio(false);
          setCurrentPlayingId(null);
        };
      }
    } catch (err) {
      console.warn("Audio play error:", err);
      setIsPlayingAudio(false);
      setCurrentPlayingId(null);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          image: currentImg,
          history: newMessages.slice(-6),
          userMood: currentMood,
          apiKey: apiKey || undefined,
          userId: userProfile?.id,
          userName: userProfile?.name,
          userPhone: userProfile?.phone,
        }),
      });

      const data = await res.json();
      if (!data.success && !data.reply) throw new Error(data.error || "خطأ في الرد");

      const lokiMsgId = (Date.now() + 1).toString();
      const lokiMsg = {
        id: lokiMsgId,
        sender: "loki",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, lokiMsg]);

      if (autoSpeak) {
        speakMessage(data.reply, lokiMsgId);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: "loki",
        text: "يا صاحبي حصل تشويش بسيط.. أنا جنبك، ابعت تاني.",
        timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        suggestions: ["هحاول أبعت تاني", "إزيك يا لوكي؟"],
      };
      setMessages((prev) => [...prev, errorMsg]);
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
    <div className="flex flex-col h-screen w-full bg-[#131314] text-[#e3e3e3] overflow-hidden relative font-sans">
      <audio ref={audioRef} className="hidden" />

      {/* Top Bar */}
      <AndroidTopBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBreathing={() => setIsBreathingOpen(true)}
      />

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
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 max-w-3xl w-full mx-auto">
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
