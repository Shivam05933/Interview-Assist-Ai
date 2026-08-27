const { safeAICall } = require("./utils");

async function getTechnicalQuestions(jobTitle) {
  const prompt = `
  You MUST return ONLY valid JSON.
Do NOT include:
- markdown
- explanation
- text before or after JSON
- bullet points
- stars (*)

If you do, the system will crash.

Return EXACT JSON only.

Act as senior ${jobTitle} interviewer.

Return JSON:
{
  "questions": [
    {
      "question": "",
      "difficulty": "easy | medium | hard",
      "expectedAnswer": ""
    }
  ]
}

Rules:
- EXACTLY 5 questions
- Real-world scenario based
- Avoid theory-only
- Answer min 80 words
`;

  return await safeAICall(prompt);
}

module.exports = getTechnicalQuestions;