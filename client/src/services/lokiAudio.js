// Loki Audio Engine - Bulletproof Voice Playback for Android APK & Web
// Combines Google Translate Natural Audio Streaming with Android Native SpeechSynthesis

let currentAudio = null;
let isAudioPlaying = false;
let activeCallbacks = null;

// Clean text for speech
export function cleanTextForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/<<<[\s\S]*?>>>/g, "")
    .replace(/[*_#`~>\[\]\(\)\{\}\-]/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Split into short sentences for natural pacing (max ~120 chars)
export function splitTextIntoChunks(text, maxLen = 120) {
  const clean = cleanTextForSpeech(text);
  if (!clean) return [];

  const rawParts = clean.split(/([.،!؟\n\r]+)/);
  const chunks = [];
  let buffer = "";

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;

    if (buffer.length + part.length <= maxLen) {
      buffer += part;
    } else {
      if (buffer.trim()) chunks.push(buffer.trim());
      buffer = part;
    }
  }

  if (buffer.trim()) chunks.push(buffer.trim());

  return chunks.filter((c) => c.trim().length > 0);
}

// Stop any current speech
export function stopLokiVoice() {
  isAudioPlaying = false;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = "";
    } catch {}
    currentAudio = null;
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  if (activeCallbacks?.onEnd) {
    try {
      activeCallbacks.onEnd();
    } catch {}
  }
  activeCallbacks = null;
}

// Play via Native SpeechSynthesis (Built-in to Android Google TTS)
function playViaSpeechSynthesis(cleanText, callbacks) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    callbacks?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Android WebView fix: resume speech synthesis if paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ar"; // Matches ar-EG, ar-SA, ar-XA on Android!
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best Arabic voice if available
    const voices = window.speechSynthesis.getVoices() || [];
    const arabicVoice =
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("ar")) ||
      voices.find((v) => v.name && v.name.toLowerCase().includes("ar")) ||
      null;

    if (arabicVoice) {
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
    }

    utterance.onstart = () => {
      isAudioPlaying = true;
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      isAudioPlaying = false;
      callbacks?.onEnd?.();
    };

    utterance.onerror = () => {
      isAudioPlaying = false;
      callbacks?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    isAudioPlaying = false;
    callbacks?.onEnd?.();
  }
}

// Main Play Function
export function playLokiVoice(text, callbacks = {}) {
  stopLokiVoice();

  const clean = cleanTextForSpeech(text);
  if (!clean) {
    callbacks?.onEnd?.();
    return;
  }

  isAudioPlaying = true;
  activeCallbacks = callbacks;
  callbacks.onStart?.();

  const chunks = splitTextIntoChunks(clean);
  if (chunks.length === 0) {
    stopLokiVoice();
    return;
  }

  let chunkIndex = 0;

  const playChunk = () => {
    if (!isAudioPlaying) return;

    if (chunkIndex >= chunks.length) {
      stopLokiVoice();
      return;
    }

    const chunk = chunks[chunkIndex];
    chunkIndex++;

    // NOTE: DO NOT set crossOrigin = "anonymous" because Google Translate TTS does not include CORS headers!
    // Standard HTML5 Audio elements can play cross-origin audio streams freely without CORS.
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(
      chunk
    )}`;

    const audio = new Audio();
    currentAudio = audio;
    audio.src = ttsUrl;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audio.onended = () => {
            playChunk();
          };
          audio.onerror = () => {
            // Fallback to native Android SpeechSynthesis
            playViaSpeechSynthesis(clean, callbacks);
          };
        })
        .catch(() => {
          // In case of autoplay policy restriction or network error, fallback to SpeechSynthesis
          playViaSpeechSynthesis(clean, callbacks);
        });
    } else {
      audio.onended = () => {
        playChunk();
      };
      audio.onerror = () => {
        playViaSpeechSynthesis(clean, callbacks);
      };
    }
  };

  playChunk();
}

export function isLokiSpeaking() {
  return isAudioPlaying;
}
