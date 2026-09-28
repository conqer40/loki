// Loki Audio Engine - Authentic Egyptian Young Man Voice
// Guaranteed: NEVER female, NEVER robotic, 100% natural Egyptian brother/friend

let currentAudio = null;
let isAudioPlaying = false;
let activeCallbacks = null;

// Clean text for speech output
export function cleanTextForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/<<<[\s\S]*?>>>/g, "")
    .replace(/[*_#`~>\[\]\(\)\{\}\-]/g, " ")
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    )
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 15 High-Definition Egyptian Young Male Neural Voice Clips (ar-EG-ShakirNeural)
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
      t.includes("سامعك يا صاحبي") ||
      t.includes("مركز معاك") ||
      t.includes("كمل أنا في ضهرك"),
  },
  {
    id: "listening_more",
    url: "/audio/listening_more.mp3",
    matches: (t) =>
      t.includes("احكيلي") ||
      t.includes("كل اللي في قلبك") ||
      t.includes("متقلقش خالص"),
  },
  {
    id: "im_here",
    url: "/audio/im_here.mp3",
    matches: (t) =>
      t.includes("أنا معاك وفي ضهرك") ||
      t.includes("ولا تشغل بالك") ||
      t.includes("موجود جنبك"),
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
    id: "advice_calm",
    url: "/audio/advice_calm.mp3",
    matches: (t) =>
      t.includes("بص يا صاحبي") ||
      t.includes("نفس عميق") ||
      t.includes("خطوة خطوة") ||
      t.includes("هتتظبط"),
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
    id: "laughter_cheer",
    url: "/audio/laughter_cheer.mp3",
    matches: (t) =>
      t.includes("ضحكتك") ||
      t.includes("بالدنيا كلها") ||
      t.includes("ربنا يفرح قلبك"),
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
    id: "good_night",
    url: "/audio/good_night.mp3",
    matches: (t) =>
      t.includes("تصبح على خير") ||
      t.includes("ارتاح وبكره") ||
      t.includes("نوم الهنا"),
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

// Potential TTS backend endpoints (local reverse, LAN IP, standard port)
const TTS_BACKEND_HOSTS = [
  "http://127.0.0.1:5000",
  "http://localhost:5000",
  "http://192.168.100.204:5000",
  "",
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

// Play Natural Male Egyptian Voice (NEVER female, NEVER robotic)
export async function playLokiVoice(text, callbacks = {}) {
  stopLokiVoice();

  const clean = cleanTextForSpeech(text);
  if (!clean) {
    callbacks?.onEnd?.();
    return;
  }

  // 1. Direct match with our pre-generated 15 Egyptian Male HD Clips
  const matchedClip = HD_MALE_CLIPS.find((clip) => clip.matches(clean));
  if (matchedClip) {
    playAudioFile(matchedClip.url, callbacks);
    return;
  }

  // 2. Dynamic synthesis via local/network Edge-TTS backend (ar-EG-ShakirNeural)
  for (const host of TTS_BACKEND_HOSTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const url = host ? `${host}/api/tts` : "/api/tts";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, voice: "ar-EG-ShakirNeural" }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 1000) {
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
      }
    } catch {
      // Try next endpoint
    }
  }

  // 3. Fallback: select best matching clip from the authentic Egyptian male bank
  // NEVER allow female or robotic TTS
  let fallbackClip = "/audio/im_here.mp3";
  if (clean.includes("؟") || clean.includes("ايه") || clean.includes("إيه")) {
    fallbackClip = "/audio/listening_more.mp3";
  } else if (clean.includes("تعب") || clean.includes("هم") || clean.includes("زعل")) {
    fallbackClip = "/audio/reassure_heavy.mp3";
  } else if (clean.includes("فرح") || clean.includes("حلو") || clean.includes("جميل")) {
    fallbackClip = "/audio/cheer_happy.mp3";
  }

  playAudioFile(fallbackClip, callbacks);
}

export function isLokiSpeaking() {
  return isAudioPlaying;
}
