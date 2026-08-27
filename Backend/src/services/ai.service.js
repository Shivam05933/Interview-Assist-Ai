const { runCareerAnalysisPipeline } = require("./ai/analysisPipeline");

/**
 * Main Entry Point for AI Interview Report Generation
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    const reportData = await runCareerAnalysisPipeline({ resume, selfDescription, jobDescription });

    return {
      ...reportData,
      technicalQuestions: Array.isArray(reportData.technicalQuestions)
        ? reportData.technicalQuestions.map(q => ({
            question: q.question || "",
            answer: q.answer || q.expectedAnswer || "",
            intention: q.intention || q.difficulty || "general"
          }))
        : [],
      behavioralQuestions: Array.isArray(reportData.behavioralQuestions)
        ? reportData.behavioralQuestions.map(q => ({
            question: q.question || "",
            answer: q.answer || q.sampleAnswer || "",
            intention: q.intention || q.trait || "behavioral"
          }))
        : [],
      roadmap: Array.isArray(reportData.roadmap)
        ? reportData.roadmap.map(r => ({
            step: String(r.step || ""),
            title: r.title || "",
            description: r.description || r.project || ""
          }))
        : [],
      resume: reportData.resume || {},
    };

  } catch (err) {
    console.error("ai.service.js error:", err);
    throw new Error("AI generation failed: " + err.message);
  }
}

module.exports = { generateInterviewReport };