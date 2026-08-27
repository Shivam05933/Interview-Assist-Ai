const { safeAICall } = require("./utils");

async function getRoadmap(jobTitle) {
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

Create roadmap for ${jobTitle}

Return JSON:
{
  "roadmap": [
    {
      "step": 1,
      "title": "",
      "topics": [],
      "project": ""
    }
  ]
}

Rules:
- Minimum 8 steps
- Beginner to advanced
- Each step must include project
`;

  return await safeAICall(prompt);
}

module.exports = getRoadmap;