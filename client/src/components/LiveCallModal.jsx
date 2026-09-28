import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff, Sparkles, AlertCircle, MessageSquare } from "lucide-react";

export default function LiveCallModal({
  isOpen,
  onClose,
  onSendMessage,
  voice,
  apiKey,
  groqApiKey,
  provider,
  currentMood
}) {
  const [callState, setCallState] = useState("listening"); // "listening" | "thinking" | "speaking"
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lokiReplyText, setLokiReplyText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [simulatedInput, setSimulatedInput] = useState("");

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const latestSpeechRef = useRef("");
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      cleanupCall();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      setCallState("listening");
    } else {
      setHasSpeechSupport(true);
      startCallSession(SpeechRecognition);
    }

    return () => {
      cleanupCall();
    };
  }, [isOpen]);

  const cleanupCall = () => {
    stopCurrentAudio();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    isSpeakingRef.current = false;
  };

  const startCallSession = (SpeechRecognition) => {
    try {
      const rec = new SpeechRecognition();
      rec.lang = "ar-EG";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        setCallState("listening");
      };

      rec.onresult = (event) => {
        // BARGE-IN INTERRUPTION: When user speaks while Loki is speaking, cut audio off immediately!
        if (isSpeakingRef.current) {
          stopCurrentAudio();
          setCallState("listening");
        }

        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = final || interim;
        if (currentText.trim()) {
          setLiveTranscript(currentText);
          latestSpeechRef.current = currentText;

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (latestSpeechRef.current.trim()) {
              handleUserSpoke(latestSpeechRef.current.trim());
              latestSpeechRef.current = "";
            }
          }, 1100);
        }
      };

      rec.onerror = (e) => {
        console.warn("Live mic error:", e);
        if (isOpen && !isMuted) {
          setTimeout(() => {
            try { rec.start(); } catch {}
          }, 600);
        }
      };

      rec.onend = () => {
        if (isOpen && !isMuted) {
          try { rec.start(); } catch {}
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn("Mic start failed, fallback to manual talk:", err);
      setHasSpeechSupport(false);
    }
  };

  const handleUserSpoke = async (spokenText) => {
    if (!spokenText || isSpeakingRef.current) return;

    setCallState("thinking");
    setLiveTranscript(spokenText);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: spokenText,
          userMood: currentMood,
          apiKey,
          groqApiKey,
          provider: groqApiKey ? "groq" : provider
        })
      });

      const data = await res.json();
      const reply = data.reply || "معاك يا غالي وسامعك.. كمل أنا في ضهرك.";

      setLokiReplyText(reply);
      onSendMessage(spokenText, reply, data.suggestions);

      await playLokiVoice(reply);
    } catch (err) {
      console.error("Live call error:", err);
      setCallState("listening");
    }
  };

  const playLokiVoice = async (text) => {
    isSpeakingRef.current = true;
    setCallState("speaking");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice })
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();

        audioRef.current.onended = () => {
          isSpeakingRef.current = false;
          setCallState("listening");
          setLiveTranscript("");
        };

        audioRef.current.onpause = () => {
          isSpeakingRef.current = false;
        };
      }
    } catch (err) {
      console.warn("TTS error in call:", err);
      isSpeakingRef.current = false;
      setCallState("listening");
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      try { recognitionRef.current?.start(); } catch {}
    } else {
      setIsMuted(true);
      try { recognitionRef.current?.stop(); } catch {}
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-slate-950/95 backdrop-blur-2xl animate-fade-in text-white select-none">
      <audio ref={audioRef} className="hidden" />

      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-semibold tracking-wide text-purple-200">
            مكالمة لايف مع لوكي
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/10 text-xs text-slate-300">
          {provider === "groq" || groqApiKey ? "🚀 فائق السرعة (Groq)" : "✨ ذكاء حي (Gemini)"}
        </div>
      </div>

      {/* Center Living Sphere */}
      <div className="flex flex-col items-center justify-center my-auto relative">
        {/* Dynamic Glowing Rings */}
        <div
          className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
            callState === "speaking"
              ? "w-80 h-80 bg-gradient-to-tr from-pink-500/30 to-purple-600/30 blur-3xl scale-125 animate-pulse"
              : callState === "thinking"
              ? "w-72 h-72 bg-gradient-to-tr from-indigo-500/25 to-purple-500/25 blur-2xl animate-spin"
              : "w-64 h-64 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 blur-2xl scale-100"
          }`}
        />

        {/* Click sphere to interrupt immediately */}
        <div
          onClick={() => {
            if (isSpeakingRef.current) {
              stopCurrentAudio();
              setCallState("listening");
            }
          }}
          className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-all duration-500 border-2 ${
            callState === "speaking"
              ? "bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 border-pink-400/50 shadow-pink-500/40 scale-110 animate-pulse-glow"
              : callState === "thinking"
              ? "bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 border-indigo-400/40 shadow-purple-900/40 animate-pulse"
              : "bg-gradient-to-br from-purple-800 via-slate-900 to-teal-900 border-teal-400/30 shadow-teal-500/20 hover:scale-105"
          }`}
        >
          <img
            src="/logo.svg"
            alt="Loki"
            className={`w-24 h-24 object-contain transition-transform duration-300 ${
              callState === "speaking" ? "scale-110" : "scale-100"
            }`}
          />
        </div>

        {/* State Label */}
        <div className="mt-8 text-center px-4 max-w-sm">
          <h2 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
            {callState === "speaking"
              ? "لوكي بيتكلم معاك..."
              : callState === "thinking"
              ? "بيحضر رده بمحبة..."
              : "لوكي سامعك.. اتكلم براحتك"}
          </h2>
          <p className="text-xs text-purple-300/80">
            {callState === "speaking"
              ? "💡 قاطع لوكي في أي ثانية بالكلام أو بلمس الشاشة وهيسكت فوراً"
              : "اتكلم بصوتك بلهجتك المصرية وهو هيرد عليك"}
          </p>
        </div>

        {/* Live Subtitle Transcript */}
        <div className="mt-5 min-h-[45px] max-w-md px-6 text-center">
          {liveTranscript && (
            <p className="text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-2xl animate-fade-in">
              🗣️ "{liveTranscript}"
            </p>
          )}
          {!liveTranscript && lokiReplyText && callState === "speaking" && (
            <p className="text-sm text-purple-200 bg-purple-950/40 border border-purple-500/20 px-4 py-2 rounded-2xl line-clamp-3 animate-fade-in">
              💜 "{lokiReplyText}"
            </p>
          )}
        </div>

        {/* Manual talk fallback if browser doesn't have Web Speech permissions */}
        {!hasSpeechSupport && (
          <div className="mt-4 flex items-center gap-2 max-w-xs w-full">
            <input
              type="text"
              placeholder="اكتب جملتك هنا واضغط إرسال..."
              value={simulatedInput}
              onChange={(e) => setSimulatedInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && simulatedInput.trim()) {
                  handleUserSpoke(simulatedInput.trim());
                  setSimulatedInput("");
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
            <button
              onClick={() => {
                if (simulatedInput.trim()) {
                  handleUserSpoke(simulatedInput.trim());
                  setSimulatedInput("");
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-xs font-semibold"
            >
              قول
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-md flex items-center justify-center gap-6 pb-6">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full border transition cursor-pointer ${
            isMuted
              ? "bg-amber-600/30 border-amber-500/50 text-amber-300"
              : "bg-white/10 hover:bg-white/15 border-white/10 text-white"
          }`}
          title={isMuted ? "إلغاء الكتم" : "كتم المايك"}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={onClose}
          className="p-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-900/50 transition cursor-pointer hover:scale-105 active:scale-95"
          title="إنهاء المكالمة والرجوع للشات"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
