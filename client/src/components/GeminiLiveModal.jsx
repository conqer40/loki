import React, { useState, useEffect, useRef } from "react";
import { PhoneOff, Mic, MicOff, Volume2, Sparkles, MessageSquare, Radio, Keyboard, X, Send, Hand } from "lucide-react";
import { askLoki } from "../services/lokiBrain";
import { playLokiVoice, stopLokiVoice } from "../services/lokiAudio";

export default function GeminiLiveModal({
  isOpen,
  onClose,
  onSendMessage,
  apiKey,
  currentMood,
}) {
  const [callStatus, setCallStatus] = useState("connecting"); // "connecting" | "active" | "ended"
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLokiSpeakingState, setIsLokiSpeakingState] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastLokiReply, setLastLokiReply] = useState("");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [manualText, setManualText] = useState("");

  const recognitionRef = useRef(null);
  const isCallActiveRef = useRef(false);
  const isLokiTalkingRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const latestSpeechRef = useRef("");
  const timerIntervalRef = useRef(null);

  // Format call duration MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!isOpen) {
      endCallSession();
      return;
    }

    isCallActiveRef.current = true;
    setCallStatus("connecting");
    setCallDuration(0);
    setLiveTranscript("");
    setLastLokiReply("");
    setIsLokiSpeakingState(false);
    isLokiTalkingRef.current = false;

    // Call duration timer
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Connect call and start session
    const connectTimer = setTimeout(() => {
      if (!isCallActiveRef.current) return;
      setCallStatus("active");

      // Loki speaks welcoming greeting on phone connection
      const greeting = "ألو يا صاحبي، معاك وسامعك.. احكيلي عامل إيه النهاردة وطمني عليك؟";
      setLastLokiReply(greeting);
      speakLoki(greeting);
    }, 700);

    return () => {
      clearTimeout(connectTimer);
      endCallSession();
    };
  }, [isOpen]);

  // Clean up and end call session
  const endCallSession = () => {
    isCallActiveRef.current = false;
    isLokiTalkingRef.current = false;
    stopLokiVoice();
    setIsLokiSpeakingState(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    stopMicSafely();
  };

  // Safely stop microphone
  const stopMicSafely = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
  };

  // Start Clean Microphone Session (Only active when Loki is NOT talking to avoid self-echo)
  const startContinuousMic = () => {
    if (!isCallActiveRef.current || isMuted || isLokiTalkingRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not available on this device");
      return;
    }

    try {
      stopMicSafely();

      const rec = new SpeechRecognition();
      rec.lang = "ar-EG";
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onresult = (event) => {
        if (!isCallActiveRef.current || isLokiTalkingRef.current) return;

        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentSpeech = (final || interim).trim();
        if (currentSpeech) {
          setLiveTranscript(currentSpeech);
          latestSpeechRef.current = currentSpeech;

          // Natural conversational pause detection (900ms silence = user finished talking)
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            const textToProcess = latestSpeechRef.current.trim();
            if (textToProcess && isCallActiveRef.current && !isLokiTalkingRef.current) {
              handleUserSpokeInCall(textToProcess);
              latestSpeechRef.current = "";
            }
          }, 900);
        }
      };

      rec.onend = () => {
        // Only restart if call is still active and Loki is not talking
        if (isCallActiveRef.current && !isMuted && !isLokiTalkingRef.current) {
          setTimeout(() => {
            if (isCallActiveRef.current && !isMuted && !isLokiTalkingRef.current) {
              try { rec.start(); } catch {}
            }
          }, 200);
        }
      };

      rec.onerror = (e) => {
        if (isCallActiveRef.current && !isMuted && !isLokiTalkingRef.current) {
          setTimeout(() => {
            if (isCallActiveRef.current && !isMuted && !isLokiTalkingRef.current) {
              try { rec.start(); } catch {}
            }
          }, 300);
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn("Could not start continuous speech recognition:", err);
    }
  };

  // Process user speech in real-time
  const handleUserSpokeInCall = async (userText) => {
    if (!userText || !isCallActiveRef.current) return;

    // Immediately stop mic so user's phone speaker won't loop into the mic
    stopMicSafely();
    setLiveTranscript("");

    try {
      const data = await askLoki({
        message: userText,
        userMood: currentMood,
        apiKey,
      });

      if (!isCallActiveRef.current) return;

      const reply = data.reply || "سامعك يا صاحبي ومركز معاك.. كمل أنا في ضهرك.";
      setLastLokiReply(reply);

      // Pass message to main chat history
      onSendMessage(userText, reply, data.suggestions);

      // Speak reply out loud
      speakLoki(reply);
    } catch (err) {
      if (isCallActiveRef.current) {
        const fallback = "معاك وسامعك يا غالي، كمل كلامك أنا سامعك.";
        setLastLokiReply(fallback);
        speakLoki(fallback);
      }
    }
  };

  // Loki Speak: Stops mic while speaking, and restarts mic immediately on finish
  const speakLoki = (text) => {
    if (!isCallActiveRef.current) return;

    // 1. Mute mic hardware cleanly while Loki is talking
    stopMicSafely();
    isLokiTalkingRef.current = true;
    setIsLokiSpeakingState(true);

    playLokiVoice(text, {
      onStart: () => {
        if (isCallActiveRef.current) {
          isLokiTalkingRef.current = true;
          setIsLokiSpeakingState(true);
        }
      },
      onEnd: () => {
        if (isCallActiveRef.current) {
          isLokiTalkingRef.current = false;
          setIsLokiSpeakingState(false);
          // 2. Restart mic smoothly the instant Loki finishes
          setTimeout(() => {
            if (isCallActiveRef.current && !isLokiTalkingRef.current) {
              startContinuousMic();
            }
          }, 150);
        }
      },
      onError: () => {
        if (isCallActiveRef.current) {
          isLokiTalkingRef.current = false;
          setIsLokiSpeakingState(false);
          startContinuousMic();
        }
      },
    });
  };

  // User Interrupt: Tapping to interrupt Loki
  const handleUserInterrupt = () => {
    if (!isCallActiveRef.current) return;
    stopLokiVoice();
    isLokiTalkingRef.current = false;
    setIsLokiSpeakingState(false);
    startContinuousMic();
  };

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startContinuousMic();
    } else {
      setIsMuted(true);
      stopMicSafely();
    }
  };

  // Manual text send
  const handleSendManual = (e) => {
    e?.preventDefault();
    if (!manualText.trim()) return;
    const text = manualText.trim();
    setManualText("");
    setShowKeyboardInput(false);
    handleUserSpokeInCall(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-[#061017] via-[#091520] to-[#04090e] text-white select-none overflow-hidden animate-fade-in safe-top safe-bottom">
      {/* Ambient Phone Glow Waves */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full transition-all duration-700 pointer-events-none ${
          isLokiSpeakingState
            ? "bg-emerald-500/25 blur-3xl scale-125"
            : "bg-teal-500/15 blur-3xl scale-100"
        }`}
      />

      {/* 1. Call Header Info */}
      <div className="flex flex-col items-center pt-2 sm:pt-4 text-center z-10 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>مكالمة هاتفية لايف 🔒</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">لوكي (Loki) 💚</h2>

        <p className="text-xs sm:text-sm font-semibold text-emerald-400">
          {callStatus === "connecting"
            ? "جاري الاتصال بـ لوكي... 📞"
            : `متصل الآن • ${formatTime(callDuration)}`}
        </p>
      </div>

      {/* 2. Center Stage: Loki Caller Mascot with Live Pulsing Audio Waves */}
      <div className="flex flex-col items-center justify-center my-auto z-10 py-6">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Wave Rings when Loki speaks */}
          {isLokiSpeakingState && (
            <>
              <span className="absolute w-48 h-48 rounded-full bg-emerald-400/20 animate-ping" />
              <span className="absolute w-56 h-56 rounded-full border-2 border-emerald-400/30 animate-pulse" />
            </>
          )}

          {/* Caller Avatar */}
          <div
            className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden p-1 shadow-2xl transition-all duration-300 ${
              isLokiSpeakingState
                ? "bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-300 scale-105 shadow-emerald-500/50"
                : "bg-gradient-to-tr from-emerald-600 to-slate-700 shadow-black/80"
            }`}
          >
            <img
              src="/loki_hero.jpg"
              alt="لوكي"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Live Call Dynamic Status & User Interruption Button */}
        <div className="mt-5 text-center px-4 max-w-xs sm:max-w-md">
          {isLokiSpeakingState ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm sm:text-base animate-pulse">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <span>لوكي بيتكلم معاك دلوقتي...</span>
              </div>
              <button
                onClick={handleUserInterrupt}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition active:scale-95 shadow-sm"
              >
                <Hand className="w-3.5 h-3.5" />
                <span>اضغط للمقاطعة والكلام ✋</span>
              </button>
            </div>
          ) : liveTranscript ? (
            <div className="flex items-center justify-center gap-2 text-teal-300 font-medium text-xs sm:text-sm">
              <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="truncate">سامعك: "{liveTranscript}"</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-emerald-400/90 text-xs sm:text-sm font-medium">
              <Mic className="w-4 h-4 animate-pulse" />
              <span>المايك مفتوح.. اتكلم ولوكي سامعك زي الفون</span>
            </div>
          )}
        </div>

        {/* Real-time Subtitles Bubble */}
        {showSubtitles && lastLokiReply && (
          <div className="mt-4 px-4 py-2.5 max-w-sm rounded-2xl bg-[#0e1a24]/90 border border-emerald-500/20 text-xs text-slate-200 text-center shadow-lg animate-fade-in">
            <span className="text-emerald-400 font-bold ml-1">لوكي:</span>
            <span>{lastLokiReply}</span>
          </div>
        )}

        {/* Keyboard Input Overlay */}
        {showKeyboardInput && (
          <form
            onSubmit={handleSendManual}
            className="mt-3 flex items-center gap-2 w-full max-w-sm px-2 animate-fade-in"
          >
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="اكتب رسالتك ولوكي هيرد بصوته..."
              className="flex-1 py-2 px-3 rounded-full bg-[#12202c] border border-emerald-500/30 text-xs text-white placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-emerald-500 text-black font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* 3. Bottom Phone Call Controls */}
      <div className="flex flex-col items-center pb-4 z-10 space-y-4">
        {/* Secondary Utilities Row */}
        <div className="flex items-center gap-4">
          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-3.5 rounded-full transition active:scale-95 shadow-md flex items-center justify-center ${
              isMuted
                ? "bg-rose-500/30 border border-rose-500 text-rose-300"
                : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
            }`}
            title={isMuted ? "إلغاء كتم المايك" : "كتم المايك"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Subtitles Toggle */}
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`p-3.5 rounded-full transition active:scale-95 shadow-md flex items-center justify-center ${
              showSubtitles
                ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
                : "bg-white/10 hover:bg-white/20 text-slate-400 border border-white/10"
            }`}
            title="إظهار/إخفاء النص المكتوب"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Keyboard Input Toggle */}
          <button
            onClick={() => setShowKeyboardInput(!showKeyboardInput)}
            className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition active:scale-95 shadow-md"
            title="كتابة نص"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>

        {/* PRIMARY BIG RED "END CALL" BUTTON */}
        <button
          onClick={() => {
            endCallSession();
            onClose();
          }}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-2xl shadow-rose-950/80 flex items-center justify-center transition active:scale-90 border-2 border-white/20"
          title="إنهاء المكالمة"
        >
          <PhoneOff className="w-8 h-8 sm:w-9 sm:h-9" />
        </button>
        <span className="text-[11px] text-slate-400 font-medium">إنهاء المكالمة</span>
      </div>
    </div>
  );
}
