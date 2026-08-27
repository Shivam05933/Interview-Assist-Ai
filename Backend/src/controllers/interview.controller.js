const multer = require("multer");
const pdfParse = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport, generatePdfFromHtml } = require("../services/ai.service");

function validateAIResponse(aiData) {
  if (!aiData) return false;

  if (typeof aiData.matchScore !== "number") {
    if (typeof aiData.matchScore === "string" && !isNaN(Number(aiData.matchScore))) {
      aiData.matchScore = Number(aiData.matchScore);
    } else {
      aiData.matchScore = 50;
    }
  }

  if (!aiData.title && !aiData.targetRole) {
    aiData.title = "Software Engineer";
    aiData.targetRole = "Software Engineer";
  }

  if (!Array.isArray(aiData.technicalQuestions)) aiData.technicalQuestions = [];
  if (!Array.isArray(aiData.behavioralQuestions)) aiData.behavioralQuestions = [];

  return true;
}

/**
 * @description Generate Interview Report
 */
async function generateInterviewReportController(req, res) {
  try {
    let resumeText = "";

    // ✅ Extract text from uploaded PDF
    if (req.file) {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    }

    const { selfDescription, jobDescription } = req.body;

    // ✅ Validation
    if (!resumeText && !selfDescription) {
      return res.status(400).json({
        message: "Either resume or self description is required",
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    // ✅ AI call
    const aiData = await generateInterviewReport({
      resume: resumeText || "",
      selfDescription: selfDescription || "",
      jobDescription: jobDescription || "",
    });

    // 🔥 DEBUG (console me AI ka data dikhega)
    console.log("AI RESPONSE:", JSON.stringify(aiData, null, 2));

    // 🔥 VALIDATION
    if (!validateAIResponse(aiData)) {
      return res.status(500).json({
        message: "AI returned incomplete or invalid data",
      });
    }

    // 🔥 SAFE DATA
    const rawStack = aiData.recommendedStack || {};
    const emptyCategory = { core: [], recommended: [], optional: [] };

    const safeAIData = {
      matchScore: typeof aiData.matchScore === "number" ? aiData.matchScore : 0,
      title: aiData.title || aiData.targetRole || "Untitled Role",
      targetRole: aiData.targetRole || aiData.title || "Full Stack Developer",
      summary: aiData.summary || "",
      currentLevel: aiData.currentLevel || "",

      strongSkills: Array.isArray(aiData.strongSkills) ? aiData.strongSkills : [],
      knownSkills: Array.isArray(aiData.knownSkills) ? aiData.knownSkills : [],
      partialSkills: Array.isArray(aiData.partialSkills) ? aiData.partialSkills : [],
      missingSkills: Array.isArray(aiData.missingSkills)
        ? aiData.missingSkills.map(item => {
            if (typeof item === 'object' && item !== null) {
              return {
                skill: item.skill || "",
                category: item.category || "",
                status: item.status || "missing",
                priority: item.priority || "critical",
                whyRequired: item.whyRequired || "",
                whatToLearn: Array.isArray(item.whatToLearn) ? item.whatToLearn : [],
                recommendedTools: Array.isArray(item.recommendedTools) ? item.recommendedTools : [],
                recommendedFrameworks: Array.isArray(item.recommendedFrameworks || item.frameworks)
                  ? (item.recommendedFrameworks || item.frameworks)
                  : [],
                prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites : [],
                jobReadyOutcome: item.jobReadyOutcome || ""
              };
            }
            return {
              skill: String(item),
              category: "General",
              status: "missing",
              priority: "critical",
              whyRequired: "",
              whatToLearn: [],
              recommendedTools: [],
              recommendedFrameworks: [],
              prerequisites: [],
              jobReadyOutcome: ""
            };
          })
        : [],
      criticalGaps: Array.isArray(aiData.criticalGaps) ? aiData.criticalGaps : [],
      reason: aiData.reason || "",

      recommendedStack: {
        frontend: rawStack.frontend || emptyCategory,
        backend: rawStack.backend || emptyCategory,
        database: rawStack.database || emptyCategory,
        security: rawStack.security || rawStack.authenticationSecurity || emptyCategory,
        tools: rawStack.tools || rawStack.developerTools || emptyCategory,
        testing: rawStack.testing || emptyCategory,
        deployment: rawStack.deployment || emptyCategory
      },

      learningOrder: Array.isArray(aiData.learningOrder)
        ? aiData.learningOrder.map((step, idx) => ({
            step: typeof step.step === 'number' ? step.step : idx + 1,
            skill: step.skill || step.title || "",
            category: step.category || "",
            whyNow: step.whyNow || "",
            prerequisites: Array.isArray(step.prerequisites) ? step.prerequisites : [],
            topics: Array.isArray(step.topics) ? step.topics : [],
            recommendedTools: Array.isArray(step.recommendedTools) ? step.recommendedTools : [],
            recommendedFrameworks: Array.isArray(step.recommendedFrameworks || step.frameworks)
              ? (step.recommendedFrameworks || step.frameworks)
              : [],
            project: step.project || "",
            expectedOutcome: step.expectedOutcome || ""
          }))
        : [],

      projectRoadmap: Array.isArray(aiData.projectRoadmap)
        ? aiData.projectRoadmap.map((p, idx) => ({
            projectNumber: typeof p.projectNumber === 'number' ? p.projectNumber : idx + 1,
            projectName: p.projectName || "",
            skillsPracticed: Array.isArray(p.skillsPracticed) ? p.skillsPracticed : [],
            tools: Array.isArray(p.tools) ? p.tools : [],
            difficulty: p.difficulty || "beginner",
            purpose: p.purpose || ""
          }))
        : [],

      technicalQuestions: (aiData.technicalQuestions || []).map(q => ({
        question: q.question || "",
        intention: q.intention || q.difficulty || "general",
        answer: q.answer || q.expectedAnswer || "No answer provided"
      })),

      behavioralQuestions: (aiData.behavioralQuestions || []).map(q => ({
        question: q.question || "",
        intention: q.intention || q.trait || "behavioral",
        answer: q.answer || q.sampleAnswer || "No answer provided"
      })),

      roadmap: (aiData.roadmap || []).map(r => ({
        step: String(r.step || ""),
        title: r.title || "",
        description: r.description || r.project || "No description provided"
      })),

      resume: aiData.resume || {},
    };

    console.log(
      "SAFE AI DATA:",
      JSON.stringify(safeAIData, null, 2)
    );

    // ✅ Save to DB (clean structured fields)
    const interviewReport = await interviewReportModel.create({
      user: req.user._id,
      resume: resumeText,
      selfDescription,
      jobDescription,

      matchScore: safeAIData.matchScore,
      title: safeAIData.title,
      targetRole: safeAIData.targetRole,
      summary: safeAIData.summary,
      currentLevel: safeAIData.currentLevel,

      missingSkills: safeAIData.missingSkills,
      strongSkills: safeAIData.strongSkills,
      knownSkills: safeAIData.knownSkills,
      partialSkills: safeAIData.partialSkills,
      criticalGaps: safeAIData.criticalGaps,
      reason: safeAIData.reason,

      recommendedStack: safeAIData.recommendedStack,
      learningOrder: safeAIData.learningOrder,
      projectRoadmap: safeAIData.projectRoadmap,

      technicalQuestions: safeAIData.technicalQuestions,
      behavioralQuestions: safeAIData.behavioralQuestions,

      roadmap: safeAIData.roadmap,
      resumeData: safeAIData.resume,
    });

    console.log(
      "SAVED INTERVIEW REPORT:",
      JSON.stringify(interviewReport, null, 2)
    );

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });

  } catch (error) {
    console.error("ERROR:", error.message);
    
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * @description Get single interview report (SECURE)
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });

  } catch (error) {
    console.error("ERROR:", error.message);
    
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

/**
 * @description Get all reports (optimized response)
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user._id})
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -roadmap -resumeData"
      );

    res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
    });

  } catch (error) {
    console.error("ERROR:", error.message);
  
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

/**
 * @description Generate Resume PDF from stored resumeData (NO AI CALL)
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    // ✅ Secure fetch
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const resumeData = interviewReport.resumeData;

    if (!resumeData) {
      return res.status(400).json({
        message: "Resume data not available",
      });
    }

    // ✅ Convert JSON → HTML
    const html = `
      <h1>${resumeData.name || ""}</h1>
      <h2>${resumeData.title || ""}</h2>

      <h3>Skills</h3>
      <ul>
        ${(resumeData.skills || []).map(s => `<li>${s}</li>`).join("")}
      </ul>

      <h3>Experience</h3>
      ${(resumeData.experience || []).map(exp => `
        <h4>${exp.role} - ${exp.company}</h4>
        <ul>
          ${(exp.points || []).map(p => `<li>${p}</li>`).join("")}
        </ul>
      `).join("")}
    `;

    // ✅ HTML → PDF
    const pdfBuffer = await generatePdfFromHtml(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error("ERROR:", error.message);

    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "PDF generation failed",
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};