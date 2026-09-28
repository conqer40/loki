// Loki Audio Engine - Authentic Egyptian Young Man Voice
// Replaces robotic female TTS with Natural Male Egyptian Voice (Pitch 0.84, Warm Tone)

let currentAudio = null;
let isAudioPlaying = false;
let activeCallbacks = null;

// Clean text for speech output
export function cleanTextForSpeech(text) {
  if (!text) return "";
  return text
    // Remove internal markers
    .replace(/<<<[\s\S]*?>>>/g, "")
    // Remove markdown symbols
    .replace(/[*_#`~>\[\]\(\)\{\}\-]/g, " ")
    // Remove emojis that cause speech engines to read "وجه مبتسم"
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    )
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove extra whitespace
    .replace(/\s+/g, " ")
    .trim();
}

// Stop any current voice playback
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

// Find best natural MALE Arabic voice on the device
function getBestMaleArabicVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const arabicVoices = voices.filter((v) => {
    const lang = (v.lang || "").toLowerCase();
    const name = (v.name || "").toLowerCase();
    return lang.startsWith("ar") || name.includes("arabic") || name.includes("عربي");
  });

  if (arabicVoices.length === 0) return null;

  // 1. Explicit Male Egyptian / Arabic Voices
  const maleVoice = arabicVoices.find((v) => {
    const n = v.name.toLowerCase();
    return (
      n.includes("male") ||
      n.includes("shakir") ||
      n.includes("tariq") ||
      n.includes("maged") ||
      n.includes("hamed") ||
      n.includes("naayf") ||
      n.includes("george") ||
      n.includes("-b") ||
      n.includes("-c") ||
      n.includes("wavenet-b") ||
      n.includes("standard-b") ||
      n.includes("standard-c") ||
      n.includes("m-local")
    );
  });

  if (maleVoice) return maleVoice;

  // 2. Reject known female voices
  const nonFemaleVoice = arabicVoices.find((v) => {
    const n = v.name.toLowerCase();
    return !(
      n.includes("female") ||
      n.includes("salma") ||
      n.includes("zari") ||
      n.includes("laila") ||
      n.includes("zeina") ||
      n.includes("hoda") ||
      n.includes("-a") ||
      n.includes("-d") ||
      n.includes("f-local")
    );
  });

  return nonFemaleVoice || arabicVoices[0];
}

// Play Natural Male Egyptian Voice via SpeechSynthesis
export function playLokiVoice(text, callbacks = {}) {
  stopLokiVoice();

  const clean = cleanTextForSpeech(text);
  if (!clean) {
    callbacks?.onEnd?.();
    return;
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    callbacks?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(clean);

    // Warm, Youthful Egyptian Male Pitch (0.83 gives a distinct baritone male resonance)
    utterance.pitch = 0.83;
    // Conversational, lively pace (1.08 prevents the slow robotic drawl)
    utterance.rate = 1.06;
    utterance.lang = "ar-EG";

    const maleVoice = getBestMaleArabicVoice();
    if (maleVoice) {
      utterance.voice = maleVoice;
      utterance.lang = maleVoice.lang || "ar-EG";
    }

    isAudioPlaying = true;
    activeCallbacks = callbacks;

    utterance.onstart = () => {
      isAudioPlaying = true;
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      isAudioPlaying = false;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      isAudioPlaying = false;
      callbacks?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Male voice synthesis error:", err);
    isAudioPlaying = false;
    callbacks?.onEnd?.();
  }
}

export function isLokiSpeaking() {
  return isAudioPlaying;
}
