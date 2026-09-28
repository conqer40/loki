import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "loki_store.json");

// Initial DB schema
const DEFAULT_DATA = {
  users: [],
  messages: []
};

let cache = null;
let isWriting = false;
let pendingWrite = false;

// Ensure storage file and directory exist
async function initDB() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DB_FILE, "utf-8");
      cache = JSON.parse(content);
    } catch {
      cache = DEFAULT_DATA;
      await fs.writeFile(DB_FILE, JSON.stringify(cache, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Database initialization error:", err);
    cache = DEFAULT_DATA;
  }
}

// Flush cache to disk safely
async function saveToDisk() {
  if (isWriting) {
    pendingWrite = true;
    return;
  }
  isWriting = true;
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (err) {
    console.error("Database write error:", err);
  } finally {
    isWriting = false;
    if (pendingWrite) {
      pendingWrite = false;
      saveToDisk();
    }
  }
}

// Register or update user info
export async function registerOrUpdateUser({ id, name, phone }) {
  if (!cache) await initDB();

  const now = new Date().toISOString();
  let user = cache.users.find((u) => u.id === id || (phone && u.phone === phone));

  if (user) {
    user.name = name || user.name;
    if (phone) user.phone = phone;
    user.lastActive = now;
  } else {
    user = {
      id: id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name || "صديق جديد",
      phone: phone || "غير محدد",
      createdAt: now,
      lastActive: now,
      messageCount: 0
    };
    cache.users.unshift(user);
  }

  await saveToDisk();
  return user;
}

// Save chat message
export async function saveMessage({
  userId,
  userName,
  userPhone,
  sender, // 'user' | 'loki'
  text,
  image = null,
  suggestions = []
}) {
  if (!cache) await initDB();

  const now = new Date().toISOString();
  const timeFormatted = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

  const msg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: userId || "anonymous",
    userName: userName || "مستخدم",
    userPhone: userPhone || "",
    sender,
    text,
    image, // base64 or url
    suggestions,
    timestamp: timeFormatted,
    createdAt: now
  };

  cache.messages.push(msg);

  // Update user stats if userId matches
  if (userId) {
    const user = cache.users.find((u) => u.id === userId);
    if (user) {
      user.lastActive = now;
      user.messageCount = (user.messageCount || 0) + 1;
    }
  }

  await saveToDisk();
  return msg;
}

// Get all registered users sorted by lastActive
export async function getAllUsers() {
  if (!cache) await initDB();
  return [...cache.users].sort((a, b) => new Date(b.lastActive || b.createdAt) - new Date(a.lastActive || a.createdAt));
}

// Get user profile
export async function getUserById(userId) {
  if (!cache) await initDB();
  return cache.users.find((u) => u.id === userId) || null;
}

// Get all messages for a specific user
export async function getUserMessages(userId) {
  if (!cache) await initDB();
  return cache.messages.filter((m) => m.userId === userId);
}

// Admin stats overview
export async function getAdminStats() {
  if (!cache) await initDB();
  const totalUsers = cache.users.length;
  const totalMessages = cache.messages.length;
  
  const today = new Date().toISOString().slice(0, 10);
  const messagesToday = cache.messages.filter((m) => m.createdAt && m.createdAt.startsWith(today)).length;
  const activeToday = cache.users.filter((u) => u.lastActive && u.lastActive.startsWith(today)).length;
  const mediaCount = cache.messages.filter((m) => Boolean(m.image)).length;

  return {
    totalUsers,
    totalMessages,
    messagesToday,
    activeToday,
    mediaCount
  };
}

// Initialize on module load
initDB();
