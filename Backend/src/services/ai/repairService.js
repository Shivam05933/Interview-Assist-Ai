const { safeAICall } = require("./utils");

/**
 * Targeted repair service to complement incomplete AI responses
 */
async function repairIncompleteSections(aiData, jobDescription, selfDescription, missingRequirements) {
  console.log("🛠️ [Repair Engine] Repairing missing section data:", missingRequirements);

  const repairData = { ...aiData };
  const targetRole = aiData.targetRole || aiData.title || jobDescription || "Target Role";

  // Repair Technical / Domain Questions if < 5
  const techCount = Array.isArray(repairData.technicalQuestions) ? repairData.technicalQuestions.length : 0;
  if (techCount < 5) {
    const needed = 5 - techCount;
    try {
      const prompt = `
You MUST return ONLY valid JSON.
Return EXACT JSON format. No markdown, no wrappers.

The user is preparing for the target role: "${targetRole}".
Target Role Description: "${jobDescription}".

Generate EXACTLY ${needed} additional domain-specific or technical interview questions for "${targetRole}".

JSON Structure:
{
  "questions": [
    {
      "question": "Clear domain or technical scenario question for ${targetRole}",
      "intention": "easy | medium | hard",
      "answer": "Concise 2-3 sentence expert model solution."
    }
  ]
}
`;
      const result = await safeAICall(prompt, 2);
      if (result && Array.isArray(result.questions)) {
        const repairedQ = result.questions.map(q => ({
          question: q.question || "",
          intention: q.intention || q.difficulty || "medium",
          answer: q.answer || q.expectedAnswer || "Model answer provided"
        }));
        repairData.technicalQuestions = [...(repairData.technicalQuestions || []), ...repairedQ];
      }
    } catch (err) {
      console.warn("⚠️ [Repair Engine] Technical question repair failed:", err.message);
    }
  }

  // Repair Behavioral Questions if < 5
  const behCount = Array.isArray(repairData.behavioralQuestions) ? repairData.behavioralQuestions.length : 0;
  if (behCount < 5) {
    const needed = 5 - behCount;
    try {
      const prompt = `
You MUST return ONLY valid JSON.
Return EXACT JSON format. No markdown, no wrappers.

The user is preparing for the target role: "${targetRole}".

Generate EXACTLY ${needed} additional behavioral interview questions customized for "${targetRole}".

JSON Structure:
{
  "questions": [
    {
      "question": "Behavioral question for ${targetRole} role",
      "intention": "Teamwork | Leadership | Problem Solving | Conflict | Pressure",
      "answer": "Concise sample answer using STAR method."
    }
  ]
}
`;
      const result = await safeAICall(prompt, 2);
      if (result && Array.isArray(result.questions)) {
        const repairedQ = result.questions.map(q => ({
          question: q.question || "",
          intention: q.intention || q.trait || "behavioral",
          answer: q.answer || q.sampleAnswer || "STAR method sample answer provided"
        }));
        repairData.behavioralQuestions = [...(repairData.behavioralQuestions || []), ...repairedQ];
      }
    } catch (err) {
      console.warn("⚠️ [Repair Engine] Behavioral question repair failed:", err.message);
    }
  }

  // Repair Project Roadmap if < 3
  const projCount = Array.isArray(repairData.projectRoadmap) ? repairData.projectRoadmap.length : 0;
  if (projCount < 3) {
    const needed = 3 - projCount;
    try {
      const prompt = `
You MUST return ONLY valid JSON.
Return EXACT JSON format.

The user is preparing for target role: "${targetRole}".

Generate EXACTLY ${needed} additional domain-specific hands-on portfolio projects for "${targetRole}".

JSON Structure:
{
  "projects": [
    {
      "projectNumber": ${projCount + 1},
      "projectName": "Project Title",
      "skillsPracticed": ["Skill 1", "Skill 2"],
      "tools": ["Tool 1"],
      "difficulty": "beginner | intermediate | advanced",
      "purpose": "Specific domain purpose and learning goal"
    }
  ]
}
`;
      const result = await safeAICall(prompt, 2);
      if (result && Array.isArray(result.projects)) {
        const repairedP = result.projects.map((p, idx) => ({
          projectNumber: projCount + idx + 1,
          projectName: p.projectName || `Domain Project ${projCount + idx + 1}`,
          skillsPracticed: Array.isArray(p.skillsPracticed) ? p.skillsPracticed : [],
          tools: Array.isArray(p.tools) ? p.tools : [],
          difficulty: p.difficulty || "intermediate",
          purpose: p.purpose || "Domain competency builder"
        }));
        repairData.projectRoadmap = [...(repairData.projectRoadmap || []), ...repairedP];
      }
    } catch (err) {
      console.warn("⚠️ [Repair Engine] Project roadmap repair failed:", err.message);
    }
  }

  // Repair Learning Order if < 4
  const learnCount = Array.isArray(repairData.learningOrder) ? repairData.learningOrder.length : 0;
  if (learnCount < 4) {
    const needed = 4 - learnCount;
    try {
      const prompt = `
You MUST return ONLY valid JSON.

Generate EXACTLY ${needed} additional sequential learning path steps for target role "${targetRole}".

JSON Structure:
{
  "learningOrder": [
    {
      "step": ${learnCount + 1},
      "skill": "Missing Skill / Topic Name",
      "category": "Domain Category",
      "whyNow": "Why learn this step now",
      "prerequisites": [],
      "topics": ["Topic 1", "Topic 2"],
      "recommendedTools": [],
      "recommendedFrameworks": [],
      "project": "Hands-on milestone project",
      "expectedOutcome": "Outcome"
    }
  ]
}
`;
      const result = await safeAICall(prompt, 2);
      if (result && Array.isArray(result.learningOrder)) {
        const repairedL = result.learningOrder.map((step, idx) => ({
          step: learnCount + idx + 1,
          skill: step.skill || `Learning Step ${learnCount + idx + 1}`,
          category: step.category || "Domain Skill",
          whyNow: step.whyNow || "Prerequisite for job readiness",
          prerequisites: Array.isArray(step.prerequisites) ? step.prerequisites : [],
          topics: Array.isArray(step.topics) ? step.topics : [],
          recommendedTools: Array.isArray(step.recommendedTools) ? step.recommendedTools : [],
          recommendedFrameworks: Array.isArray(step.recommendedFrameworks) ? step.recommendedFrameworks : [],
          project: step.project || "Domain exercise",
          expectedOutcome: step.expectedOutcome || "Mastery of concept"
        }));
        repairData.learningOrder = [...(repairData.learningOrder || []), ...repairedL];
      }
    } catch (err) {
      console.warn("⚠️ [Repair Engine] Learning order repair failed:", err.message);
    }
  }

  // Final check to make sure roadmap exists and matches learningOrder
  if (!Array.isArray(repairData.roadmap) || repairData.roadmap.length < 4) {
    repairData.roadmap = (repairData.learningOrder || []).map((step, idx) => ({
      step: String(idx + 1),
      title: step.skill || `Phase ${idx + 1}`,
      description: step.whyNow || step.expectedOutcome || `Mastery step for ${targetRole}`
    }));
  }

  return repairData;
}

module.exports = { repairIncompleteSections };
