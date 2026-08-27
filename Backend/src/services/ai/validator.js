/**
 * Validation, Evidence Sanitization, and Score Calculation Engine
 */

/**
 * Normalizes skill names for reliable comparison (case-insensitive, trimmed)
 */
function normalizeSkill(skill) {
  if (!skill || typeof skill !== "string") return "";
  return skill.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Extracts raw skill evidence from text (selfDescription + resume)
 * Returns a predicate function testing if a skill name is supported by user text evidence.
 */
function extractUserSkillsFromText(userText) {
  if (!userText || typeof userText !== "string") return () => false;
  const text = userText.toLowerCase();

  const stopWords = new Set(["know", "only", "basic", "basics", "want", "become", "and", "the", "for", "with", "have", "some", "good", "knowledge", "in", "of", "a", "an", "i", "my"]);
  
  // Extract individual significant words (length >= 2) from user input
  const userWords = text
    .split(/[^a-z0-9.+#]/)
    .map(w => w.trim())
    .filter(w => w.length >= 2 && !stopWords.has(w));

  return function isMentioned(skill) {
    if (!skill || typeof skill !== "string") return false;
    const cleanSkill = skill.trim().toLowerCase();
    if (!cleanSkill) return false;

    // 1. Direct exact phrase regex match
    const escaped = cleanSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i");
    if (regex.test(text)) return true;

    // 2. Direct string inclusion (e.g. user text includes skill or skill includes text)
    if (text.includes(cleanSkill)) return true;

    // 3. Significant user word overlap (e.g. user said "java", skill is "Core Java" or "Java SE")
    for (const uw of userWords) {
      const uwEscaped = uw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const uwRegex = new RegExp(`(?:^|[^a-z0-9])${uwEscaped}(?:$|[^a-z0-9])`, "i");
      if (uwRegex.test(cleanSkill)) {
        return true;
      }
    }

    return false;
  };
}

/**
 * Sanitizes User Facts (knownSkills, partialSkills, strongSkills, resumeData)
 * Ensures NO hallucinated user facts exist.
 */
function sanitizeUserFacts(aiData, selfDescription = "", resumeText = "") {
  const combinedText = `${selfDescription || ""} ${resumeText || ""}`;
  const isMentioned = extractUserSkillsFromText(combinedText);
  const hasUserEvidence = combinedText.trim().length > 0;
  const hasResume = Boolean(resumeText && resumeText.trim().length > 0);

  // 1. Sanitize knownSkills, strongSkills, partialSkills
  const rawKnown = Array.isArray(aiData.knownSkills) ? aiData.knownSkills : [];
  const rawStrong = Array.isArray(aiData.strongSkills) ? aiData.strongSkills : [];
  const rawPartial = Array.isArray(aiData.partialSkills) ? aiData.partialSkills : [];

  // Filter skills to ONLY those explicitly supported by user input evidence
  let verifiedKnown = rawKnown.filter(sk => isMentioned(sk));
  let verifiedStrong = rawStrong.filter(sk => isMentioned(sk));
  let verifiedPartial = rawPartial.filter(sk => isMentioned(sk));

  // If user provided text evidence but LLM omitted exact matching terms, extract key user terms directly
  if (hasUserEvidence && verifiedKnown.length === 0) {
    const textLower = combinedText.toLowerCase();
    if (textLower.includes("node")) verifiedKnown.push("Node.js");
    if (textLower.includes("html")) verifiedKnown.push("HTML");
    if (textLower.includes("java") && !textLower.includes("javascript")) verifiedKnown.push("Java");
    if (textLower.includes("javascript") || textLower.includes("js")) verifiedKnown.push("JavaScript");
    if (textLower.includes("python")) verifiedKnown.push("Python");
    if (textLower.includes("accounting")) verifiedKnown.push("Accounting Principles");
    if (textLower.includes("cad")) verifiedKnown.push("CAD Fundamentals");
  }

  // Deduplicate case-insensitively
  const seenKnown = new Set();
  verifiedKnown = verifiedKnown.filter(sk => {
    const norm = normalizeSkill(sk);
    if (!norm || seenKnown.has(norm)) return false;
    seenKnown.add(norm);
    return true;
  });

  const seenPartial = new Set();
  verifiedPartial = verifiedPartial.filter(sk => {
    const norm = normalizeSkill(sk);
    if (!norm || seenKnown.has(norm) || seenPartial.has(norm)) return false;
    seenPartial.add(norm);
    return true;
  });

  const seenStrong = new Set();
  verifiedStrong = verifiedStrong.filter(sk => {
    const norm = normalizeSkill(sk);
    if (!norm || seenStrong.has(norm)) return false;
    seenStrong.add(norm);
    return true;
  });

  // 2. Sanitize Resume Data (No fake John Doe!)
  let sanitizedResume = null;
  if (hasResume) {
    sanitizedResume = aiData.resume && typeof aiData.resume === "object" ? aiData.resume : {};
  } else {
    // If no resume uploaded, DO NOT invent name/company/experience!
    sanitizedResume = {
      name: "",
      title: aiData.targetRole || aiData.title || "",
      skills: verifiedKnown,
      experience: [],
      projects: []
    };
  }

  return {
    verifiedKnown,
    verifiedPartial,
    verifiedStrong,
    sanitizedResume
  };
}

/**
 * Calculates mathematical match score from dynamic requirement matrix and verified user skills
 */
function calculateMathematicalMatchScore(requirementMatrix, verifiedKnown, verifiedPartial) {
  if (!Array.isArray(requirementMatrix) || requirementMatrix.length === 0) {
    return 10;
  }

  const knownSet = new Set(verifiedKnown.map(normalizeSkill));
  const partialSet = new Set(verifiedPartial.map(normalizeSkill));

  let totalScore = 0;
  let totalPossibleScore = 0;

  requirementMatrix.forEach(req => {
    const skillNorm = normalizeSkill(req.skill);
    const importance = (req.importance || "HIGH").toUpperCase();
    let weight = 1.0;
    if (importance === "CRITICAL") weight = 1.5;
    else if (importance === "MEDIUM") weight = 0.8;
    else if (importance === "LOW") weight = 0.5;

    totalPossibleScore += weight;

    if (knownSet.has(skillNorm)) {
      totalScore += weight * 1.0;
    } else if (partialSet.has(skillNorm)) {
      totalScore += weight * 0.5;
    } else {
      let matched = false;
      for (const k of knownSet) {
        if (k && (skillNorm.includes(k) || k.includes(skillNorm))) {
          totalScore += weight * 0.8;
          matched = true;
          break;
        }
      }
      if (!matched) {
        for (const p of partialSet) {
          if (p && (skillNorm.includes(p) || p.includes(skillNorm))) {
            totalScore += weight * 0.4;
            break;
          }
        }
      }
    }
  });

  if (totalPossibleScore === 0) return 10;

  const scorePercentage = Math.round((totalScore / totalPossibleScore) * 100);
  return Math.max(5, Math.min(100, scorePercentage));
}

/**
 * Deduplicates and aligns skill statuses across known, partial, missing
 */
function alignSkillStatuses(aiData, verifiedKnown, verifiedPartial) {
  const knownSet = new Set(verifiedKnown.map(normalizeSkill));
  const partialSet = new Set(verifiedPartial.map(normalizeSkill));

  // Filter missingSkills so that no known/partial skill is marked as missing
  const rawMissing = Array.isArray(aiData.missingSkills) ? aiData.missingSkills : [];
  const cleanMissing = [];
  const seenMissing = new Set();

  rawMissing.forEach(item => {
    const skillName = typeof item === "object" && item !== null ? item.skill : String(item);
    const norm = normalizeSkill(skillName);

    if (!norm) return;
    if (knownSet.has(norm)) return; // User already knows this skill!
    if (seenMissing.has(norm)) return; // Duplicate in missing list

    seenMissing.add(norm);

    if (typeof item === "object" && item !== null) {
      cleanMissing.push({
        ...item,
        skill: skillName,
        status: "missing"
      });
    } else {
      cleanMissing.push({
        skill: skillName,
        category: "General Domain Skill",
        status: "missing",
        priority: "high",
        whyRequired: `Required competency for target role`,
        whatToLearn: [],
        recommendedTools: [],
        recommendedFrameworks: [],
        prerequisites: [],
        jobReadyOutcome: ""
      });
    }
  });

  // Filter criticalGaps so they only reflect actual missing skills
  const rawGaps = Array.isArray(aiData.criticalGaps) ? aiData.criticalGaps : [];
  const cleanGaps = rawGaps.filter(gap => {
    const norm = normalizeSkill(gap);
    return norm && !knownSet.has(norm);
  });

  return {
    cleanMissing,
    cleanGaps
  };
}

/**
 * Checks overall data completeness against required section quantities
 */
function checkDataCompleteness(data) {
  const issues = [];

  if (!data.targetRole && !data.title) {
    issues.push("Missing targetRole/title");
  }

  if (!Array.isArray(data.technicalQuestions) || data.technicalQuestions.length < 5) {
    issues.push(`Insufficient technicalQuestions (found ${data.technicalQuestions?.length || 0}, need at least 5)`);
  }

  if (!Array.isArray(data.behavioralQuestions) || data.behavioralQuestions.length < 5) {
    issues.push(`Insufficient behavioralQuestions (found ${data.behavioralQuestions?.length || 0}, need at least 5)`);
  }

  if (!Array.isArray(data.projectRoadmap) || data.projectRoadmap.length < 3) {
    issues.push(`Insufficient projectRoadmap (found ${data.projectRoadmap?.length || 0}, need at least 3)`);
  }

  if (!Array.isArray(data.learningOrder) || data.learningOrder.length < 4) {
    issues.push(`Insufficient learningOrder (found ${data.learningOrder?.length || 0}, need at least 4)`);
  }

  return {
    isComplete: issues.length === 0,
    issues
  };
}

module.exports = {
  normalizeSkill,
  extractUserSkillsFromText,
  sanitizeUserFacts,
  calculateMathematicalMatchScore,
  alignSkillStatuses,
  checkDataCompleteness
};
