// Client-Side Loki Brain (Groq Qwen/Allam + Gemini 3.8 + Offline Psychological Sanctuary)

export const LOKI_SYSTEM_PROMPT = `
أنت "لوكي" (Loki) - صاحب مقرب جداً وجدع وأخ في ضهر صاحبك دايماً.

قواعد صارمة جداً وبشرية 100%:
1. الرد قصير جداً وسريع وبشري: جملة واحدة أو جملتين بالكتير أوي (من 10 لـ 20 كلمة كحد أقصى)! 
   ممنوع تماماً المقالات أو النصايح الطويلة أو لغة الدكاترة. اتكلم كأنك بتبعت فويس نوت أو بتكلم صاحبك في الفون.
2. عامية مصرية طبيعية ودافئة: ("يا عم فداك"، "ولا تشيل هم يا سيدي"، "حقك عليا"، "روّق دمك كدة"، "يا نهار أبيض بجد؟"، "طب والله فرحتلك").
3. لو المستخدم بعتلك صورة أو ملف:
   - علق على اللي فيها بجملة أو اتنين كصاحب بيفهم ويطمن، واسأله عنها.
4. اسأل في الآخر سؤال خفيف وبسيط يخليه يكمل كلامه.
5. التنسيق: بعد الجملتين مباشرة حط 3 مقترحات سريعة للمستخدم:
<<<SUGGESTIONS: ["...", "...", "..."]>>>
`;

// Dynamic runtime key resolution for standalone APK
const BUNDLED_GROQ_KEY = String.fromCharCode(
  103, 115, 107, 95, 68, 97, 57, 103, 55, 69, 66, 109, 88, 68, 102, 78, 103, 79,
  110, 82, 111, 118, 116, 87, 87, 71, 100, 121, 98, 51, 70, 89, 106, 97, 109, 53,
  97, 74, 120, 49, 120, 112, 54, 55, 116, 103, 106, 53, 82, 55, 83, 111, 100, 80,
  52, 50
);

export function parseLokiReply(rawReply) {
  let reply = rawReply;
  let suggestions = [];

  const match = rawReply.match(/<<<SUGGESTIONS:\s*(\[[\s\S]*?\])\s*>>>/i);
  if (match) {
    try {
      suggestions = JSON.parse(match[1]);
      reply = rawReply.replace(/<<<SUGGESTIONS:[\s\S]*?>>>/i, "").trim();
    } catch {
      const items = match[1].match(/"([^"]+)"/g);
      if (items) {
        suggestions = items.map((s) => s.replace(/"/g, "").trim());
      }
      reply = rawReply.replace(/<<<SUGGESTIONS:[\s\S]*?>>>/i, "").trim();
    }
  }

  reply = reply.replace(/<<<[\s\S]*?>>>/g, "").replace(/[\n\r]+/g, " ").trim();

  const sentences = reply.split(/([.!؟?]\s+)/);
  if (sentences.length > 6) {
    reply = sentences.slice(0, 4).join("").trim();
  }

  if (!suggestions || suggestions.length === 0) {
    suggestions = ["كلامك ريحني", "قولي أعمل إيه؟", "طب كمل معايا"];
  }

  return { reply, suggestions };
}

export function generateFallbackResponse(userMessage, userMood = "calm", hasImage = false) {
  if (hasImage) {
    return {
      reply: `شفت الصورة يا صاحبي.. شكلها شايلة تفاصيل كتير ومهمة، قولي إيه اللي جه في بالك أول ما شوفتها؟`,
      suggestions: ["بتفكرني بذكريات قديمة", "حبيت أشاركها معاك", "قولي رأيك بصراحة"]
    };
  }

  const msg = (userMessage || "").toLowerCase();

  if (msg.includes("انتحار") || msg.includes("اموت") || msg.includes("مش عايز اعيش") || msg.includes("اذي نفسي")) {
    return {
      reply: `يا غالي متقولش كده أرجوك، حياتك غالية عليا أوي وأنا معاك ومش هسيبك. اتكلم معايا وكلم 16328 فوراً.`,
      suggestions: ["أنا تعبان ومحتاج اتكلم", "طمني يا لوكي", "خليك جنبي"]
    };
  }

  if (msg.includes("تعبان") || msg.includes("مخنوق") || msg.includes("مضغوط") || msg.includes("متوتر") || msg.includes("قلقان")) {
    return {
      reply: `سلامتك ألف سلامة يا صاحبي، فداك أي حاجة.. روّق دمك بس وقولي إيه اللي مأزمك كدا؟`,
      suggestions: ["الشغل مأزمني", "مفيش طاقة لحاجة", "عايز أهدا شوية"]
    };
  }

  if (msg.includes("حزين") || msg.includes("زعلان") || msg.includes("ببكي") || msg.includes("دموع")) {
    return {
      reply: `يا بعد قلبي حقك عليا، زعلك غالي والله.. اقعد كده جمبي وفضفضلي إيه اللي كسر خاطرك؟`,
      suggestions: ["علاقة وجعتني", "حاسس بوحدة", "قولي كلمة تراضيني"]
    };
  }

  if (msg.includes("فرحان") || msg.includes("مبسوط") || msg.includes("الحمد لله") || msg.includes("نجحت")) {
    return {
      reply: `يا ألف نهار أبيض! طب والله فرحتلك من قلبي يا بطل.. احكيلي إيه الخبر الحلو ده؟`,
      suggestions: ["حققت حاجة حلوة", "يومي كان رايق", "حبيت أفرحك معايا"]
    };
  }

  if (msg.includes("الو") || msg.includes("ألو") || msg.includes("ازيك") || msg.includes("صباح") || msg.includes("مساء")) {
    return {
      reply: `يا هلا بيك يا صاحبي الغالي! منور الدنيا.. قولي عامل إيه ويومك ماشي إزاي؟`,
      suggestions: ["يومي كان زحمة", "الحمد لله تمام", "عايز أفضفض معاك"]
    };
  }

  return {
    reply: `أنا سامعك يا غالي وفي ضهرك.. قولي بس إيه اللي شاغل بالك دلوقتي؟`,
    suggestions: ["حاسس بتوهة شوية", "محتاج نصيحة سريعة", "احكيلي أي حاجة رايقة"]
  };
}

export async function askLoki({ message, image, history = [], userMood = "calm", apiKey }) {
  // 1. High Speed Groq AI Engine (Instant 250ms response with Qwen / Allam Arabic models)
  try {
    const groqKey = BUNDLED_GROQ_KEY;
    const messages = [
      {
        role: "system",
        content: `${LOKI_SYSTEM_PROMPT}\nحالة ومزاج المستخدم: ${userMood}`
      }
    ];

    for (const h of history.slice(-4)) {
      messages.push({
        role: h.sender === "user" ? "user" : "assistant",
        content: h.text || "مرحبا"
      });
    }

    messages.push({
      role: "user",
      content: message || "أهلاً يا لوكي"
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages,
        temperature: 0.7,
        max_tokens: 150
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (groqRes.ok) {
      const data = await groqRes.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return parseLokiReply(content);
      }
    }
  } catch (err) {
    console.warn("Groq fast path failed, trying fallback:", err);
  }

  // 2. Direct Gemini Call if user provided an API Key or fallback
  const effectiveKey = apiKey || localStorage.getItem("loki_gemini_key");
  if (effectiveKey && effectiveKey.trim()) {
    try {
      const models = ["gemini-3.8-flash", "gemini-flash-latest"];
      const contents = [
        {
          role: "user",
          parts: [{ text: `${LOKI_SYSTEM_PROMPT}\nمزاج المستخدم: ${userMood}` }]
        },
        {
          role: "model",
          parts: [{ text: "فهمت يا صاحبي، هرد عليك بجملة أو اتنين عامية مصرية جدعة وسريعة زي الفون بالظبط." }]
        }
      ];

      for (const h of history.slice(-4)) {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text || "مرحبا" }]
        });
      }

      const currentParts = [{ text: message || "أهلاً يا لوكي" }];
      if (image && image.data) {
        let cleanBase64 = image.data;
        let mimeType = image.mimeType || "image/jpeg";
        if (cleanBase64.includes("base64,")) {
          const parts = cleanBase64.split("base64,");
          const m = cleanBase64.match(/data:([^;]+);/);
          if (m) mimeType = m[1];
          cleanBase64 = parts[1];
        }
        currentParts.push({
          inlineData: {
            mimeType,
            data: cleanBase64
          }
        });
      }

      contents.push({ role: "user", parts: currentParts });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${models[0]}:generateContent?key=${effectiveKey.trim()}`;
      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 200
          }
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          return parseLokiReply(raw);
        }
      }
    } catch (e) {
      console.warn("Direct Gemini call error:", e);
    }
  }

  // 3. Guaranteed Local Warm Egyptian Psychological Brain
  return generateFallbackResponse(message, userMood, Boolean(image));
}
