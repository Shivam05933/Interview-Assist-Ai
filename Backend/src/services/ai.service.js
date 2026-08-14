const getMatchScore = require("./ai/matchScore");
const getTechnicalQuestions = require("./ai/technicalQ");
const getBehavioralQuestions = require("./ai/behavioralQ");
const getRoadmap = require("./ai/roadmap");
const generateResume = require("./ai/resume");

// MAIN FUNCTION
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    // 1. Match score & comprehensive career gap analysis
    const match = await getMatchScore(jobDescription, resume, selfDescription);
    const roleTitle = match.targetRole || match.title || "Developer";

    // 2. Questions
    const tech = await getTechnicalQuestions(roleTitle);
    const behavioral = await getBehavioralQuestions();

    // 3. Roadmap (fallback)
    const roadmap = await getRoadmap(roleTitle);

    // 4. Resume
    const resumeData = await generateResume(resume, selfDescription, jobDescription);

    return {
      ...match,
      technicalQuestions: (tech?.questions || []).map(q => ({
        question: q.question,
        answer: q.expectedAnswer || "",
        intention: q.difficulty || "general"
      })),

      behavioralQuestions: (behavioral?.questions || []).map(q => ({
        question: q.question,
        answer: q.sampleAnswer || "",
        intention: q.trait || "behavioral"
      })),

      roadmap: (roadmap?.roadmap || []).map(r => ({
        step: String(r.step),
        title: r.title,
        description: r.project || ""
      })),
      resume: resumeData,
    };

  } catch (err) {
    console.error("ai.service.js error:", err);
    throw new Error("AI generation failed");
  }
}

module.exports = { generateInterviewReport };