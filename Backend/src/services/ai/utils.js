const Groq = require("groq-sdk");

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is missing or empty. Please set GROQ_API_KEY in your environment or .env file.");
  }
  return new Groq({ apiKey });
}

let cachedModelList = null;

async function getAvailableModels(groq) {
  if (cachedModelList && cachedModelList.length > 0) {
    return cachedModelList;
  }

  const preferredModels = [
    process.env.GROQ_MODEL,
    "openai/gpt-oss-20b",
    "groq/compound-mini",
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-120b"
  ].filter(Boolean);

  try {
    const response = await groq.models.list();
    const activeModels = (response?.data || [])
      .map(m => m.id)
      .filter(id => id && 
        !id.includes("whisper") && 
        !id.includes("guard") && 
        !id.includes("orpheus") && 
        !id.includes("allam")
      );

    if (activeModels.length > 0) {
      // Prioritize preferred models that exist in active models
      const ordered = [
        ...preferredModels.filter(m => activeModels.includes(m)),
        ...activeModels,
        ...preferredModels
      ];
      cachedModelList = [...new Set(ordered)];
      return cachedModelList;
    }
  } catch (err) {
    console.warn("⚠️ [AI] Could not list models dynamically from Groq API:", err.message);
  }

  cachedModelList = [...new Set(preferredModels)];
  return cachedModelList;
}

async function callAI(prompt) {
  const groq = getGroqClient();
  const modelsToTry = await getAvailableModels(groq);

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[AI] Attempting request using model: '${model}'`);
      const res = await groq.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "You are a specialized AI assistant that strictly returns valid JSON responses." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
        max_tokens: 4096,
      });

      const content = res.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error(`Model '${model}' returned an empty response.`);
      }

      console.log(`[AI] Successfully generated response using model: '${model}'`);
      return content;
    } catch (err) {
      console.error(`❌ [AI] Model '${model}' error:`, err.message || err);
      lastError = err;
      // Continue loop to try next fallback model
    }
  }

  throw lastError || new Error("All fallback AI models failed.");
}

// Extract JSON safely
function extractJSON(text) {
  if (!text) throw new Error("Empty response from AI");
  
  // Strip markdown code blocks (e.g. ```json ... ```)
  let cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Try direct parsing first
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    // Continue to outer brace extraction
  }

  const firstOpen = cleanText.indexOf("{");
  const lastClose = cleanText.lastIndexOf("}");

  if (firstOpen !== -1 && lastClose > firstOpen) {
    const candidate = cleanText.substring(firstOpen, lastClose + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {
      // Fall through to scanner if outer substring had invalid characters
    }
  }

  // Scan balanced braces to collect top-level valid JSON objects
  let depth = 0;
  let inString = false;
  let escape = false;
  let startPos = -1;
  const candidates = [];

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "{") {
        if (depth === 0) {
          startPos = i;
        }
        depth++;
      } else if (char === "}") {
        depth--;
        if (depth === 0 && startPos !== -1) {
          const candidateStr = cleanText.substring(startPos, i + 1);
          try {
            const parsed = JSON.parse(candidateStr);
            candidates.push(parsed);
          } catch (parseErr) {}
          startPos = -1;
        }
      }
    }
  }

  if (candidates.length > 0) {
    // Prioritize object containing key root fields
    const rootObj = candidates.find(
      c => c && (c.matchScore !== undefined || c.targetRole || c.questions || c.roadmap)
    );
    if (rootObj) return rootObj;
    return candidates[0];
  }

  throw new Error("Invalid JSON structure in AI response");
}

// Retry wrapper
async function safeAICall(prompt, retries = 3) {
  let lastErr = null;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await callAI(prompt);
      return extractJSON(res);
    } catch (err) {
      console.error(`❌ [AI Retry ${i + 1}/${retries}]:`, err.message || err);
      lastErr = err;
    }
  }
  throw new Error(`AI failed after retries: ${lastErr?.message || lastErr}`);
}

module.exports = { safeAICall };