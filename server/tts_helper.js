import dotenv from "dotenv";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
dotenv.config();

// Generate Natural Egyptian Male Voice via Microsoft Edge Neural TTS
export async function generateEdgeTTS(text, voiceName = "ar-EG-ShakirNeural") {
  const cleanText = sanitizeForSpeech(text);
  if (!cleanText) throw new Error("Empty text");

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(cleanText);

  const chunks = [];
  return new Promise((resolve, reject) => {
    audioStream.on("data", (chunk) => chunks.push(chunk));
    audioStream.on("end", () => resolve(Buffer.concat(chunks)));
    audioStream.on("error", reject);
  });
}

// Convert raw 24000Hz 16-bit mono PCM into standard WAV format
export function pcmToWav(pcmBuffer, sampleRate = 24000) {
  const header = Buffer.alloc(44);
  const totalDataLen = pcmBuffer.length;
  const totalFileLen = totalDataLen + 36;
  header.write("RIFF", 0);
  header.writeUInt32LE(totalFileLen, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(totalDataLen, 40);
  return Buffer.concat([header, pcmBuffer]);
}

export function ensureWav(buffer, sampleRate = 24000) {
  if (buffer.length >= 4 && buffer.subarray(0, 4).toString() === "RIFF") {
    return buffer;
  }
  return pcmToWav(buffer, sampleRate);
}

export function sanitizeForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/<<<SUGGESTIONS:[\s\S]*?>>>/gi, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_#~>]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .trim();
}

// Gemini Native Human Voice Models Pool (Rotates across models to maximize quota)
const GEMINI_TTS_MODELS = [
  "gemini-3.8-flash-lite-tts",
  "gemini-3.8-flash-tts",
  "gemini-3.1-flash-tts-preview",
  "gemini-2.5-flash-preview-tts"
];

// Generate Human Voice directly via Google Gemini
export async function generateGeminiTTS(text, voiceName = "Puck", apiKey = null) {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
  if (!effectiveKey) throw new Error("No Gemini API key available");

  const cleanText = sanitizeForSpeech(text);
  if (!cleanText) throw new Error("Empty text");

  let lastError = null;

  for (const model of GEMINI_TTS_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: cleanText }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (b64) {
          const rawBuffer = Buffer.from(b64, "base64");
          return ensureWav(rawBuffer, 24000);
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        lastError = new Error(`Gemini ${model} error: ${errJson.error?.message || res.statusText}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate voice with Gemini");
}
