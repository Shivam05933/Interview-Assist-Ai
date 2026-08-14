const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callAI(prompt) {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return res.choices[0].message.content;
}

// Extract JSON safely
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid JSON");
  return JSON.parse(match[0]);
}

// Retry wrapper
async function safeAICall(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await callAI(prompt);
      return extractJSON(res);
    } catch (err) {
      console.error("❌ AI ERROR:", err.message);
  console.error("FULL ERROR:", err);

  console.log("Retrying AI...");
    }
  }
  throw new Error("AI failed after retries");
}

module.exports = { safeAICall };