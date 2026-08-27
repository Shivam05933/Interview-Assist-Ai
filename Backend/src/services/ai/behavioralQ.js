const { safeAICall } = require("./utils");

async function getBehavioralQuestions() {
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

Generate behavioral interview questions.

Return JSON:
{
  "questions": [
    {
      "question": "",
      "trait": "",
      "sampleAnswer": ""
    }
  ]
}

Rules:
- Use STAR method in answers
- Real interview scenarios
`;

  return await safeAICall(prompt);
}

module.exports = getBehavioralQuestions;