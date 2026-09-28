import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { queryGemini, generateFallbackResponse } from "./loki_brain.js";
import { generateGeminiTTS, generateEdgeTTS } from "./tts_helper.js";
import {
  registerOrUpdateUser,
  saveMessage,
  getAllUsers,
  getUserById,
  getUserMessages,
  getAdminStats
} from "./db.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "01065584603";

// Large JSON payload support for base64 image/file uploads
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve downloads (APK and assets)
app.use("/downloads", express.static(path.join(__dirname, "public/downloads")));
app.get("/download/apk", (req, res) => {
  const apkPath = path.join(__dirname, "public/downloads/loki.apk");
  res.download(apkPath, "loki-ai-companion.apk");
});

const DAILY_QUOTES = [
  { quote: "أنت أقوى بكتير من الأيام التقيلة اللي عدت، وبكره شايلك فرحة تعوض قلبك الطيب.", author: "لوكي" },
  { quote: "خد نفس عميق وافتكر: مفيش عاصفة بتفضل مكملة طول العمر، والشمس دايماً بتطلع تاني.", author: "لوكي" },
  { quote: "طبطب على نفسك النهاردة.. أنت عملت اللي تقدر عليه وده في حد ذاته كافي وبطل.", author: "لوكي" },
  { quote: "الحياة مش سباق، عيش يومك على مهلك واستمتع بريحة القهوة أو نسمة هوا حلوة.", author: "لوكي" },
  { quote: "وجودك في الدنيا فارق مع ناس كتير حتى لو مش بيعرفوا يقولوا ده كل يوم.", author: "لوكي" }
];

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Loki Realtime Emotional Assistant (Powered Exclusively by Google Gemini)",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString()
  });
});

app.get("/api/daily-quote", (req, res) => {
  const randomIndex = Math.floor(Math.random() * DAILY_QUOTES.length);
  res.json(DAILY_QUOTES[randomIndex]);
});

// User Registration & Onboarding Endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    const { id, name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "الاسم ورقم الموبايل مطلوبين" });
    }

    const user = await registerOrUpdateUser({ id, name, phone });
    res.json({ success: true, user });
  } catch (err) {
    console.error("User registration error:", err);
    res.status(500).json({ error: "فشل تسجيل المستخدم" });
  }
});

// Get User Profile & History
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    const messages = await getUserMessages(req.params.id);
    res.json({ success: true, user, messages });
  } catch (err) {
    res.status(500).json({ error: "فشل جلب بيانات المستخدم" });
  }
});

// Chat Endpoint: Exclusively powered by Google Gemini (Supports Text + Vision + DB Persistence)
app.post("/api/chat", async (req, res) => {
  const {
    message = "",
    image = null,
    history = [],
    userMood = "calm",
    apiKey,
    userId,
    userName,
    userPhone
  } = req.body;

  if (!message && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  // 1. Save user's incoming message and image to DB
  if (userId) {
    await saveMessage({
      userId,
      userName,
      userPhone,
      sender: "user",
      text: message || (image ? "أرسل صورة/ملف" : ""),
      image: image ? image.data : null
    });
  }

  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
  let reply = "";
  let suggestions = [];
  let source = "gemini";

  if (effectiveKey && effectiveKey.trim()) {
    try {
      const result = await queryGemini(effectiveKey.trim(), history, message, userMood, image);
      reply = result.reply;
      suggestions = result.suggestions;
    } catch (err) {
      console.warn("Gemini API call failed:", err.message);
    }
  }

  if (!reply) {
    const fallback = generateFallbackResponse(message, userMood, Boolean(image));
    reply = fallback.reply;
    suggestions = fallback.suggestions;
    source = "local-brain";
  }

  // 2. Save Loki's reply to DB
  if (userId) {
    await saveMessage({
      userId,
      userName,
      userPhone,
      sender: "loki",
      text: reply,
      suggestions
    });
  }

  return res.json({
    success: true,
    source,
    reply,
    suggestions
  });
});

// Text-to-Speech Endpoint: Authentic Egyptian Male Neural Voice (ar-EG-ShakirNeural)
app.post("/api/tts", async (req, res) => {
  const { text, voice = "ar-EG-ShakirNeural", apiKey } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  // 1. Primary: Microsoft Edge Neural TTS (ar-EG-ShakirNeural - Natural Egyptian Male Voice)
  try {
    const mp3Buffer = await generateEdgeTTS(text, voice);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", mp3Buffer.length);
    res.setHeader("Cache-Control", "no-cache");
    return res.send(mp3Buffer);
  } catch (edgeErr) {
    console.warn("Edge TTS failed, falling back to Gemini:", edgeErr.message);
  }

  // 2. Fallback: Google Gemini Native Audio
  try {
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    const wavBuffer = await generateGeminiTTS(text, "Puck", effectiveKey);
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", wavBuffer.length);
    res.setHeader("Cache-Control", "no-cache");
    return res.send(wavBuffer);
  } catch (err) {
    console.error("All TTS generation methods failed:", err);
    res.status(500).json({ error: err.message || "Failed to generate human voice" });
  }
});

// ==========================================
// ADMIN DASHBOARD ENDPOINTS
// ==========================================

// Simple Admin Authentication
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: "loki_admin_authorized_2026" });
  }
  return res.status(401).json({ success: false, error: "كلمة المرور غير صحيحة" });
});

// Admin Middleware check
function checkAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer loki_admin_authorized_2026" || req.query.key === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ error: "غير مصرح لك بالدخول" });
}

// Admin: Get overall statistics
app.get("/api/admin/stats", checkAdminAuth, async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ error: "فشل جلب الإحصائيات" });
  }
});

// Admin: Get all registered users
app.get("/api/admin/users", checkAdminAuth, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: "فشل جلب قائمة المستخدمين" });
  }
});

// Admin: Get full chat transcript of a specific user
app.get("/api/admin/users/:userId/chats", checkAdminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    const messages = await getUserMessages(userId);
    res.json({ success: true, user, messages });
  } catch (err) {
    res.status(500).json({ error: "فشل جلب محادثة المستخدم" });
  }
});

// Serve production client build
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/downloads")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`✨ Loki Assistant Backend running on http://localhost:${PORT} (Gemini Powered & DB Enabled)`);
});
