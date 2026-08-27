const getMatchScore = require("./matchScore");
const {
  sanitizeUserFacts,
  calculateMathematicalMatchScore,
  alignSkillStatuses,
  checkDataCompleteness
} = require("./validator");
const { repairIncompleteSections } = require("./repairService");

/**
 * Complete Dynamic AI Career Analysis Pipeline
 */
async function runCareerAnalysisPipeline({ resume, selfDescription, jobDescription }) {
  const resumeText = resume || "";
  const selfDescText = selfDescription || "";
  const jobDescText = jobDescription || "";

  console.log("🚀 [Analysis Pipeline] Starting career analysis for target:", jobDescText);

  // 1. Initial AI Generation Call
  let rawAiData = await getMatchScore(jobDescText, resumeText, selfDescText);

  if (!rawAiData || typeof rawAiData !== "object") {
    throw new Error("Invalid response object received from AI generation call.");
  }

  // 2. User Facts & Evidence Sanitization (Firewall against user skill/resume hallucination)
  const {
    verifiedKnown,
    verifiedPartial,
    verifiedStrong,
    sanitizedResume
  } = sanitizeUserFacts(rawAiData, selfDescText, resumeText);

  // 3. Dynamic Requirement Matrix Extraction
  let requirementMatrix = Array.isArray(rawAiData.requirementMatrix) ? rawAiData.requirementMatrix : [];
  
  // If AI omitted requirementMatrix, construct dynamic default matrix from missingSkills & target role
  if (requirementMatrix.length === 0) {
    const rawMissing = Array.isArray(rawAiData.missingSkills) ? rawAiData.missingSkills : [];
    requirementMatrix = rawMissing.map(m => ({
      skill: typeof m === "object" && m !== null ? m.skill : String(m),
      category: (typeof m === "object" && m !== null && m.category) || "Core Competency",
      importance: (typeof m === "object" && m !== null && m.priority ? m.priority.toUpperCase() : "HIGH"),
      expectedLevel: "Intermediate",
      whyRequired: (typeof m === "object" && m !== null && m.whyRequired) || `Required for ${rawAiData.targetRole || 'target role'}`
    }));
    
    // Add verified known skills into matrix so overall total requirement count is realistic
    verifiedKnown.forEach(sk => {
      requirementMatrix.push({
        skill: sk,
        category: "Verified Competency",
        importance: "HIGH",
        expectedLevel: "Intermediate",
        whyRequired: "Candidate known skill"
      });
    });
  }

  // 4. BACKEND MATHEMATICAL MATCH SCORE CALCULATION & OVERRIDE
  const calculatedMatchScore = calculateMathematicalMatchScore(
    requirementMatrix,
    verifiedKnown,
    verifiedPartial
  );

  console.log(`📊 [Analysis Pipeline] LLM score: ${rawAiData.matchScore} -> OVERRIDDEN by Backend Calculated Score: ${calculatedMatchScore}%`);

  // 5. Skill Status Alignment & Deduplication
  const { cleanMissing, cleanGaps } = alignSkillStatuses(
    rawAiData,
    verifiedKnown,
    verifiedPartial
  );

  // Combine sanitized data
  let processedData = {
    ...rawAiData,
    matchScore: calculatedMatchScore,
    targetRole: rawAiData.targetRole || rawAiData.title || jobDescText,
    title: rawAiData.title || rawAiData.targetRole || jobDescText,
    knownSkills: verifiedKnown,
    partialSkills: verifiedPartial,
    strongSkills: verifiedStrong,
    missingSkills: cleanMissing,
    criticalGaps: cleanGaps,
    resume: sanitizedResume
  };

  // 6. Section Completeness Check & Targeted Repair
  const completeness = checkDataCompleteness(processedData);

  if (!completeness.isComplete) {
    console.warn("⚠️ [Analysis Pipeline] Incomplete AI payload detected. Triggering targeted repair...", completeness.issues);
    processedData = await repairIncompleteSections(
      processedData,
      jobDescText,
      selfDescText,
      completeness.issues
    );
  }

  // 7. Final Polish & Ordering Safeguards
  // Ensure roadmap starts from unfulfilled learning order
  if (Array.isArray(processedData.learningOrder) && processedData.learningOrder.length > 0) {
    processedData.roadmap = processedData.learningOrder.map((step, idx) => ({
      step: String(idx + 1),
      title: step.skill || `Phase ${idx + 1}`,
      description: step.whyNow || step.expectedOutcome || `Mastery milestone for ${processedData.targetRole}`
    }));
  }

  console.log("✅ [Analysis Pipeline] Analysis complete!", {
    targetRole: processedData.targetRole,
    requirementsCount: requirementMatrix.length,
    knownCount: processedData.knownSkills.length,
    partialCount: processedData.partialSkills.length,
    missingCount: processedData.missingSkills.length,
    calculatedMatchScore: processedData.matchScore,
    technicalQuestionsCount: processedData.technicalQuestions?.length,
    behavioralQuestionsCount: processedData.behavioralQuestions?.length,
    projectsCount: processedData.projectRoadmap?.length,
    learningStepsCount: processedData.learningOrder?.length
  });

  return processedData;
}

module.exports = { runCareerAnalysisPipeline };
