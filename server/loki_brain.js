import dotenv from "dotenv";
dotenv.config();

// Persona for Loki - Pure Egyptian Young Guy (Super short, 1-2 punchy sentences)
export const LOKI_SYSTEM_PROMPT = `
أنت "لوكي" (Loki) - شاب مصري جدع، صاحب مقرب جداً وأخ في ضهر صاحبك دايماً.

قواعد صارمة جداً وبشرية 100%:
1. الرد قصير جداً جداً وبشري: جملة واحدة أو جملتين بالكتير أوي (من 10 لـ 20 كلمة كحد أقصى)! 
   ممنوع تماماً المقالات أو النصايح الطويلة أو لغة الأطباء. اتكلم كأنك بتبعت فويس نوت سريع لصاحبك على الواتساب.
2. عامية مصرية طبيعية ودافئة: استخدم كلمات الشباب العادية ("يا عم فداك"، "ولا تشيل هم يا سيدي"، "حقك عليا"، "روّق دمك كدة"، "يا نهار أبيض بجد؟"، "طب والله فرحتلك").
3. لو المستخدم بعتلك صورة أو ملف (مذكرة، رسمة، تحليل، روشتة، صورة شخصية، أو أي حاجة):
   - بص عليها بعين فاحصة ودافية، وعلق على اللي فيها بجملة أو اتنين كصاحب بيفهم ويطمن، واسأله عنها.
4. اسأل في الآخر سؤال خفيف وبسيط يخليه يكمل كلامه.
5. التنسيق: بعد الجملتين مباشرة حط 3 مقترحات سريعة للمستخدم:
<<<SUGGESTIONS: ["...", "...", "..."]>>>
`;

// Direct Google Gemini API (Exclusive Brain with Multimodal Vision Support)
export async function queryGemini(apiKey, history = [], userMessage = "", userMood = "calm", image = null) {
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"];
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

  const contents = [
    {
      role: "user",
      parts: [{ text: `${LOKI_SYSTEM_PROMPT}\nمزاج المستخدم: ${userMood}` }]
    },
    {
      role: "model",
      parts: [{ text: "فهمت يا صاحبي، هرد عليك بجملة أو اتنين عامية مصرية جدعة وسريعة زي البشر بالظبط، وهشوف أي صورة تبعتها وأحللها بعين أخوية." }]
    }
  ];

  // Include recent history
  const recent = history.slice(-4);
  for (const h of recent) {
    contents.push({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text || "مرحبا" }]
    });
  }

  // Construct current user turn (Multimodal: Text + Image)
  const currentTurnParts = [];
  const textPrompt = userMessage || (image ? "شوف الصورة دي وقلي رأيك يا لوكي" : "أهلاً");
  currentTurnParts.push({ text: textPrompt });

  if (image && image.data) {
    let cleanBase64 = image.data;
    let mimeType = image.mimeType || "image/jpeg";

    if (typeof cleanBase64 === "string" && cleanBase64.includes("base64,")) {
      const parts = cleanBase64.split("base64,");
      const matchMime = cleanBase64.match(/data:([^;]+);/);
      if (matchMime) mimeType = matchMime[1];
      cleanBase64 = parts[1];
    }

    currentTurnParts.push({
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64
      }
    });
  }

  contents.push({
    role: "user",
    parts: currentTurnParts
  });

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 120 // Short, focused human response
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (rawReply) {
          return parseLokiReply(rawReply);
        }
      } else {
        const errText = await res.text();
        console.warn(`Gemini (${model}) returned status ${res.status}:`, errText);
      }
    } catch (err) {
      console.warn(`Gemini (${model}) failed:`, err.message);
    }
  }

  return generateFallbackResponse(userMessage, userMood, Boolean(image));
}

// Fallback short human Egyptian responses
export function generateFallbackResponse(userMessage, mood = "neutral", hasImage = false) {
  if (hasImage) {
    return {
      reply: `شفت الصورة يا صاحبي.. شكلها شايلة تفاصيل كتير، قولي إيه اللي جه في بالك أول ما شوفتها؟`,
      suggestions: ["بتفكرني بذكريات قديمة", "رسمتها لما كنت متضايق", "حبيت أشاركها معاك"]
    };
  }

  const msg = (userMessage || "").toLowerCase();

  if (msg.includes("انتحار") || msg.includes("اموت") || msg.includes("مش عايز اعيش") || msg.includes("اذي نفسي")) {
    return {
      reply: `يا غالي متقولش كده أرجوك، حياتك غالية عليا أوي وأنا معاك ومش هسيبك. اتكلم معايا وكلم 16328 فوراً.`,
      suggestions: ["أنا تعبان ومحتاج اتكلم", "طمني يا لوكي", "سيبك جمبي"]
    };
  }

  if (msg.includes("تعبان") || msg.includes("مخنوق") || msg.includes("مضغوط") || msg.includes("متوتر") || msg.includes("قلقان")) {
    return {
      reply: `سلامتك ألف سلامة يا صاحبي، فداك أي حاجة.. روّق دمك بس وقولي إيه اللي مزعلك كدا؟`,
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

  return {
    reply: `أنا سامعك يا غالي وفي ضهرك.. قولي بس إيه اللي شاغل بالك دلوقتي؟`,
    suggestions: ["حاسس بتوهة شوية", "محتاج نصيحة سريعة", "احكيلي أي حاجة رايقة"]
  };
}

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

  reply = reply.replace(/[\n\r]+/g, " ").trim();

  // If reply exceeds 3 sentences, keep first 2-3 sentences only!
  const sentences = reply.split(/([.!؟?]\s+)/);
  if (sentences.length > 6) {
    reply = sentences.slice(0, 4).join("").trim();
  }

  if (!suggestions || suggestions.length === 0) {
    suggestions = ["كلامك ريحني", "قولي أعمل إيه؟", "طب كمل معايا"];
  }

  return { reply, suggestions };
}
