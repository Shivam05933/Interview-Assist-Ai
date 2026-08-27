const getMatchScore = require("./ai/matchScore");

// MAIN FUNCTION
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    // Single unified completion call for ultra-fast response (3-5 seconds) and zero rate limit errors
    const reportData = await getMatchScore(jobDescription, resume, selfDescription);

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