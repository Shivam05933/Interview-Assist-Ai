const { safeAICall } = require("./utils");

async function generateResume(resume, selfDescription, jobDescription) {
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

Create ATS-friendly resume.

Return JSON:
{
  "name": "",
  "title": "",
  "skills": [],
  "experience": [
    {
      "role": "",
      "company": "",
      "points": []
    }
  ],
  "projects": []
}

Rules:
- Use bullet points
- No paragraphs
- Use action verbs
`;

  return await safeAICall(prompt);
}

module.exports = generateResume;