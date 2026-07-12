const Groq = require("groq-sdk");
const puppeteer = require("puppeteer");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// -----------------------------
// INTERVIEW REPORT
// -----------------------------
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

  const prompt = `
You are an AI interview assistant.

Return ONLY valid JSON in this format:

{
  "matchScore": number,
  "title": "job title",
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low | medium | high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": ["", ""]
    }
  ]
}

Candidate Details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

const response = await groq.chat.completions.create({
   model: "llama-3.3-70b-versatile", // ✅ updated
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

const text = response.choices[0].message.content;

const cleanText = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {
  return JSON.parse(cleanText); 
} catch (err) {
  console.log("Cleaned Response:", cleanText);
  throw new Error("Invalid JSON from AI");
}}

// -----------------------------
// PDF GENERATION (SAME RAHEGA)
// -----------------------------
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

// -----------------------------
// RESUME PDF
// -----------------------------
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

  const prompt = `
Return ONLY JSON:
{
  "html": "<html>...</html>"
}

Generate a professional resume HTML.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.choices[0].message.content;

  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let json;
  try {
    json = JSON.parse(cleanText);
  } catch (err) {
    console.log("Cleaned HTML Response:", cleanText);
    throw new Error("Invalid JSON from AI");
  }

  return json; // ✅ VERY IMPORTANT
}


module.exports = { generateInterviewReport, generateResumePdf };