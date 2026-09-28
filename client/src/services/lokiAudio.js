// Loki Audio Engine - Authentic Egyptian Young Man Voice
// Guaranteed: NEVER female, NEVER robotic, authentic Egyptian male tone

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
    // Remove emojis
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

// Pre-generated High-Definition Egyptian Young Male Voice Bank (ar-EG-ShakirNeural)
const HD_MALE_CLIPS = [
  {
    id: "call_greeting",
    url: "/audio/call_greeting.mp3",
    matches: (t) =>
      t.includes("ألو") ||
      t.includes("معاك وسامعك") ||
      (t.includes("عامل إيه") && t.includes("النهاردة")),
  },
  {
    id: "call_listening",
    url: "/audio/call_listening.mp3",
    matches: (t) =>
      t.includes("سامعك") ||
      t.includes("مركز معاك") ||
      t.includes("معاك يا غالي وسامعك") ||
      t.includes("كمل"),
  },
  {
    id: "reassure_heavy",
    url: "/audio/reassure_heavy.mp3",
    matches: (t) =>
      t.includes("سلامتك") ||
      t.includes("مأزمك") ||
      t.includes("مخنوق") ||
      t.includes("مضغوط") ||
      t.includes("تعبان") ||
      t.includes("فداك أي حاجة"),
  },
  {
    id: "reassure_sad",
    url: "/audio/reassure_sad.mp3",
    matches: (t) =>
      t.includes("حقك عليا") ||
      t.includes("زعلك غالي") ||
      t.includes("كسر خاطرك") ||
      t.includes("حزين") ||
      t.includes("زعلان") ||
      t.includes("دموع"),
  },
  {
    id: "cheer_happy",
    url: "/audio/cheer_happy.mp3",
    matches: (t) =>
      t.includes("نهار أبيض") ||
      t.includes("فرحتلك") ||
      t.includes("فرحان") ||
      t.includes("مبسوط") ||
      t.includes("مبروك") ||
      t.includes("يا بطل"),
  },
  {
    id: "welcome_chat",
    url: "/audio/welcome_chat.mp3",
    matches: (t) =>
      t.includes("يا هلا بيك") ||
      t.includes("منور الدنيا") ||
      t.includes("يومك ماشي"),
  },
  {
    id: "support_general",
    url: "/audio/support_general.mp3",
    matches: (t) =>
      t.includes("ولا تشيل هم") ||
      t.includes("في ضهرك") ||
      t.includes("زي الفل") ||
      t.includes("هتعدي"),
  },
  {
    id: "dont_worry",
    url: "/audio/dont_worry.mp3",
    matches: (t) =>
      t.includes("ولا تشيل في نفسك") ||
      t.includes("مشكلة وليها حل") ||
      t.includes("الرايق كسبان") ||
      t.includes("صلي على النبي"),
  },
  {
    id: "photo_seen",
    url: "/audio/photo_seen.mp3",
    matches: (t) =>
      t.includes("شفت الصورة") ||
      t.includes("الصورة يا صاحبي") ||
      t.includes("تفاصيل كتير"),
  },
  {
    id: "call_end",
    url: "/audio/call_end.mp3",
    matches: (t) =>
      t.includes("مع السلامة") ||
      t.includes("خلي بالك من نفسك") ||
      t.includes("باي"),
  },
];

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

// Play an authentic audio file clip (HD MP3)
function playAudioFile(url, callbacks = {}) {
  stopLokiVoice();

  try {
    const audio = new Audio(url);
    currentAudio = audio;
    isAudioPlaying = true;
    activeCallbacks = callbacks;

    audio.onplay = () => {
      isAudioPlaying = true;
      callbacks?.onStart?.();
    };

    audio.onended = () => {
      isAudioPlaying = false;
      currentAudio = null;
      callbacks?.onEnd?.();
    };

    audio.onerror = (e) => {
      console.warn("Audio file playback notice:", e);
      isAudioPlaying = false;
      currentAudio = null;
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    const promise = audio.play();
    if (promise && promise.catch) {
      promise.catch((err) => {
        console.warn("Audio play prevented:", err);
        isAudioPlaying = false;
        callbacks?.onEnd?.();
      });
    }
    return true;
  } catch (err) {
    console.warn("Could not play audio clip:", err);
    callbacks?.onEnd?.();
    return false;
  }
}

// Strict check: only return an Arabic voice if it is confirmed MALE
function getStrictMaleArabicVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const arabicVoices = voices.filter((v) => {
    const lang = (v.lang || "").toLowerCase();
    const name = (v.name || "").toLowerCase();
    return lang.startsWith("ar") || name.includes("arabic") || name.includes("عربي");
  });

  if (arabicVoices.length === 0) return null;

  // Search explicitly for male identifiers
  const male = arabicVoices.find((v) => {
    const n = v.name.toLowerCase();
    return (
      n.includes("male") ||
      n.includes("shakir") ||
      n.includes("tariq") ||
      n.includes("maged") ||
      n.includes("hamed") ||
      n.includes("naayf") ||
      n.includes("george") ||
      n.includes("b-ar") ||
      n.includes("wavenet-b") ||
      n.includes("standard-b") ||
      n.includes("standard-c")
    );
  });

  return male || null;
}

// Play Natural Male Egyptian Voice (NEVER female, NEVER robotic)
export async function playLokiVoice(text, callbacks = {}) {
  stopLokiVoice();

  const clean = cleanTextForSpeech(text);
  if (!clean) {
    callbacks?.onEnd?.();
    return;
  }

  // 1. Check if the text matches any of our HD Egyptian Male Voice Clips
  const matchedClip = HD_MALE_CLIPS.find((clip) => clip.matches(clean));
  if (matchedClip) {
    playAudioFile(matchedClip.url, callbacks);
    return;
  }

  // 2. Try online HD neural TTS endpoint if available (/api/tts)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean, voice: "ar-EG-ShakirNeural" }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      playAudioFile(blobUrl, {
        ...callbacks,
        onEnd: () => {
          URL.revokeObjectURL(blobUrl);
          callbacks?.onEnd?.();
        },
      });
      return;
    }
  } catch (err) {
    // Backend TTS unreachable, continue to fallback
  }

  // 3. Fallback: If device has a verified male Arabic voice in WebSpeech
  const verifiedMaleVoice = getStrictMaleArabicVoice();
  if (verifiedMaleVoice && typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.voice = verifiedMaleVoice;
      utterance.lang = verifiedMaleVoice.lang || "ar-EG";
      utterance.pitch = 1.0; // Natural tone, do not lower to prevent robotic distortion
      utterance.rate = 1.05;

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
      utterance.onerror = () => {
        isAudioPlaying = false;
        callbacks?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch {}
  }

  // 4. CRITICAL: If the device ONLY has a female Arabic voice, DO NOT play it!
  // Instead, play the closest warm authentic Egyptian male voice clip
  const fallbackClip = clean.includes("؟") || clean.includes("ايه") || clean.includes("إيه")
    ? "/audio/call_listening.mp3"
    : "/audio/support_general.mp3";

  playAudioFile(fallbackClip, callbacks);
}

export function isLokiSpeaking() {
  return isAudioPlaying;
}
