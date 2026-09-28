import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Keyboard, Sparkles, Volume2 } from "lucide-react";

export default function GeminiLiveModal({
  isOpen,
  onClose,
  onSendMessage,
  voice,
  apiKey,
  groqApiKey,
  provider,
  currentMood,
}) {
  const [callState, setCallState] = useState("listening"); // "listening" | "thinking" | "speaking"
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lokiReplyText, setLokiReplyText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [manualInput, setManualInput] = useState("");

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const latestSpeechRef = useRef("");
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      setCallState("listening");
    } else {
      setHasSpeechSupport(true);
      startLiveVoiceSession(SpeechRecognition);
    }

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    stopAudio();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    isSpeakingRef.current = false;
  };

  const startLiveVoiceSession = (SpeechRecognition) => {
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
          stopAudio();
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
              handleUserSpeech(latestSpeechRef.current.trim());
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
      console.warn("Voice session failed:", err);
      setHasSpeechSupport(false);
    }
  };

  const handleUserSpeech = async (spokenText) => {
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
          provider: groqApiKey ? "groq" : provider,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "معاك وسامعك يا صاحبي.. كمل أنا في ضهرك.";

      setLokiReplyText(reply);
      onSendMessage(spokenText, reply, data.suggestions);

      await playVoiceResponse(reply);
    } catch (err) {
      console.error("Live voice error:", err);
      setCallState("listening");
    }
  };

  const playVoiceResponse = async (text) => {
    isSpeakingRef.current = true;
    setCallState("speaking");

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, apiKey }),
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
      console.warn("TTS error in Live call:", err);
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
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 bg-[#0a0a0c] text-white select-none overflow-hidden animate-fade-in">
      <audio ref={audioRef} className="hidden" />

      {/* Top Bar: Close (X) + Mode Pill */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition active:scale-95"
          title="الرجوع للشات الكتابي"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gemini Live style status pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1f20] border border-white/10 text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              callState === "speaking"
                ? "bg-rose-400 animate-ping"
                : callState === "thinking"
                ? "bg-purple-400 animate-pulse"
                : "bg-[#a8c7fa] animate-pulse"
            }`}
          />
          <span className="text-slate-200">
            {callState === "speaking"
              ? "لوكي بيتكلم..."
              : callState === "thinking"
              ? "بيحضر رده..."
              : "لوكي سامعك لايف"}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition active:scale-95"
          title="شات كتابي"
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </div>

      {/* Center: The Iconic Gemini Live Fluid Morphing Orb */}
      <div className="my-auto flex flex-col items-center justify-center relative">
        {/* Ambient atmospheric backdrop glow */}
        <div
          className={`absolute rounded-full blur-[90px] transition-all duration-1000 pointer-events-none ${
            callState === "speaking"
              ? "w-96 h-96 bg-gradient-to-tr from-pink-600/30 via-purple-600/30 to-amber-500/25 scale-125"
              : callState === "thinking"
              ? "w-80 h-80 bg-gradient-to-tr from-indigo-600/25 via-purple-600/25 to-pink-500/20 animate-spin"
              : "w-80 h-80 bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 scale-100"
          }`}
        />

        {/* The Fluid Morphing Living Orb (Gemini Live Signature Visual) */}
        <div
          onClick={() => {
            if (isSpeakingRef.current) {
              stopAudio();
              setCallState("listening");
            }
          }}
          className={`relative w-56 h-56 rounded-full cursor-pointer flex items-center justify-center transition-all duration-700 active:scale-95 shadow-2xl ${
            callState === "speaking"
              ? "animate-morph-orb bg-gradient-to-tr from-[#ec4899] via-[#8b5cf6] to-[#f59e0b] shadow-purple-500/50 scale-110"
              : callState === "thinking"
              ? "animate-spin bg-gradient-to-tr from-[#6366f1] via-[#a855f7] to-[#ec4899] shadow-indigo-500/40"
              : "animate-morph-orb bg-gradient-to-tr from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6] shadow-cyan-500/30 hover:scale-105"
          }`}
        >
          {/* Inner core reflection */}
          <div className="w-40 h-40 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/25">
            <img
              src="/logo.svg"
              alt="Loki"
              className={`w-24 h-24 object-contain transition-transform duration-500 ${
                callState === "speaking" ? "scale-115" : "scale-100"
              }`}
            />
          </div>
        </div>

        {/* Helpful user cue */}
        <div className="mt-10 text-center px-4 max-w-sm">
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            {callState === "speaking"
              ? "💡 اتكلم في أي ثانية أو المس الشاشة ولوكي هيسكت فوراً عشان يسمعك"
              : "اتكلم بصوتك بلهجتك المصرية الطبيعية وهو هيرد عليك كإنسان حقيقي"}
          </p>
        </div>

        {/* Live Subtitle Transcript Bar */}
        <div className="mt-6 min-h-[52px] max-w-md w-full px-4 text-center">
          {liveTranscript && (
            <p className="text-sm font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2.5 rounded-2xl animate-fade-in shadow-lg">
              🗣️ "{liveTranscript}"
            </p>
          )}
          {!liveTranscript && lokiReplyText && callState === "speaking" && (
            <p className="text-sm font-normal text-purple-200 bg-purple-950/40 border border-purple-500/20 px-4 py-2.5 rounded-2xl line-clamp-3 animate-fade-in shadow-lg">
              💜 "{lokiReplyText}"
            </p>
          )}
        </div>

        {/* Manual Input Fallback */}
        {!hasSpeechSupport && (
          <div className="mt-4 flex items-center gap-2 max-w-xs w-full">
            <input
              type="text"
              placeholder="اكتب كلامك هنا..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && manualInput.trim()) {
                  handleUserSpeech(manualInput.trim());
                  setManualInput("");
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-[#1e1f20] border border-white/10 text-xs text-white"
            />
            <button
              onClick={() => {
                if (manualInput.trim()) {
                  handleUserSpeech(manualInput.trim());
                  setManualInput("");
                }
              }}
              className="px-3 py-2 rounded-xl bg-purple-600 text-xs font-semibold"
            >
              إرسال
            </button>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar (ChatGPT / Gemini Android style) */}
      <div className="w-full flex items-center justify-center gap-8 pb-4 z-10">
        {/* Mute Mic Button */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full border transition active:scale-95 ${
            isMuted
              ? "bg-amber-600/30 border-amber-500/50 text-amber-300"
              : "bg-[#1e1f20] border-white/10 hover:bg-[#282a2c] text-slate-200"
          }`}
          title={isMuted ? "إلغاء كتم المايك" : "كتم المايك"}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* End Call / Close Live Button (Red circular button) */}
        <button
          onClick={onClose}
          className="p-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-950/60 transition active:scale-95"
          title="إنهاء الجلسة الصوتية"
        >
          <X className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
