const { safeAICall } = require("./utils");

/**
 * AI Career & Interview Intelligence Prompt Engine
 */
async function getMatchScore(jobDescription, resumeText, selfDescription) {
  const prompt = `
You are an expert AI Career Analysis & Domain Intelligence Engine.

You must analyze user input for ANY target role across ANY profession (IT, Software, Commerce, Accounting, Finance, Mechanical, Civil, Electrical, Healthcare, Law, Sales, Education, Architecture, Research, or any other domain).

INPUT DATA:
- TARGET ROLE / JOB DESCRIPTION:
"${jobDescription || 'Not specified'}"

- CANDIDATE SELF DESCRIPTION:
"${selfDescription || 'Not specified'}"

- CANDIDATE RESUME TEXT:
"${resumeText || 'No resume uploaded'}"

CRITICAL SYSTEM DIRECTIVES & RULES:

1. TARGET ROLE vs CURRENT USER CAPABILITY SEPARATION:
   - "TARGET ROLE" tells where the user wants to go.
   - "CURRENT USER CAPABILITY" tells where the user is right now.
   - The Target Role MUST NEVER be treated as evidence that the user knows the skills required for that role!

2. USER EVIDENCE EXTRACTION (NO HALLUCINATED USER FACTS):
   - Extract user known skills ONLY from explicit evidence in CANDIDATE SELF DESCRIPTION or CANDIDATE RESUME TEXT.
   - If user says "I only know node.js", then:
     knownSkills = ["Node.js"]
     partialSkills = []
     strongSkills = []
   - DO NOT automatically add JavaScript, Express.js, REST APIs, MongoDB, SQL, Git, Docker, etc., unless explicitly stated by user. Association does NOT equal evidence!
   - If user says "I have basic knowledge of Express.js", then Express.js = PARTIAL.
   - If NO RESUME text is provided, the "resume" JSON object MUST have empty/null strings and empty arrays for name, experience, projects. NEVER invent "John Doe" or fake companies!

3. DYNAMIC ROLE REQUIREMENT MATRIX:
   - Generate a "requirementMatrix" array containing 8 to 15 real, domain-specific core competencies required for the target role.
   - For each requirement, specify:
     * skill: Name of required competency
     * category: Category appropriate to the domain (e.g. Core Principles / Systems / Audit / Compliance / Design)
     * importance: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
     * expectedLevel: "Beginner" | "Intermediate" | "Advanced"
     * whyRequired: Why this competency is required for the target role.
   - DO NOT use the same static skill list for every career. Adapt dynamically to the target role.

4. ROADMAP PERSONALIZATION:
   - The roadmap and learningOrder MUST start with the earliest missing prerequisite.
   - DO NOT start the roadmap with skills the user already explicitly knows (e.g., if user knows Node.js, do NOT restart them with "Learn Node.js basics").

5. REQUIRED QUANTITIES & STRUCTURE:
   - "missingSkills": 5 to 10 specific missing competencies based on unfulfilled requirements.
   - "learningOrder": 4 to 8 sequential steps progressing logically.
   - "projectRoadmap": EXACTLY 3 to 5 domain-specific projects (Beginner -> Intermediate -> Advanced Portfolio).
   - "technicalQuestions": EXACTLY 5 to 8 domain-specific technical or professional interview questions with 2-3 sentence clear solutions.
   - "behavioralQuestions": EXACTLY 5 to 8 behavioral questions customized for the target role with STAR method answers.
   - "roadmap": 4 to 6 career roadmap phases.
   - "recommendedStack": Map domain tools into 7 categories (frontend, backend, database, security, tools, testing, deployment). Populate each with real domain items adapted to the candidate's field (e.g., for accounting: Tally/SAP under database, Tax Laws under security; for mechanical: CAD under frontend, FEA under backend; for software: standard dev tools).

STRICT JSON OUTPUT CONTRACT:
Return ONLY a single valid JSON object. No markdown, no wrappers, no code fences.

JSON Schema:
{
  "title": "Target Role Title",
  "targetRole": "Target Role Title",
  "currentLevel": "Beginner | Intermediate | Advanced",
  "summary": "Factual executive summary of candidate domain readiness based ONLY on evidence.",
  "knownSkills": ["Skill 1"],
  "partialSkills": [],
  "strongSkills": [],
  "requirementMatrix": [
    {
      "skill": "Required Skill Name",
      "category": "Domain Category",
      "importance": "CRITICAL | HIGH | MEDIUM | LOW",
      "expectedLevel": "Beginner | Intermediate | Advanced",
      "whyRequired": "Why required for this role"
    }
  ],
  "missingSkills": [
    {
      "skill": "Skill Name",
      "category": "Domain Category",
      "status": "missing",
      "priority": "critical | high | medium | low",
      "whyRequired": "Why required",
      "whatToLearn": ["Topic 1", "Topic 2"],
      "prerequisites": ["Prerequisite 1"],
      "recommendedTools": ["Tool 1"],
      "recommendedFrameworks": ["Framework 1"],
      "jobReadyOutcome": "Practical outcome"
    }
  ],
  "criticalGaps": ["Gap 1", "Gap 2"],
  "recommendedStack": {
    "frontend": { "core": ["Core Domain Tool 1"], "recommended": ["Tool 2"], "optional": ["Tool 3"] },
    "backend": { "core": ["Advanced Domain System 1"], "recommended": ["System 2"], "optional": ["System 3"] },
    "database": { "core": ["Data / ERP System 1"], "recommended": ["System 2"], "optional": ["System 3"] },
    "security": { "core": ["Compliance / Security 1"], "recommended": ["Standard 2"], "optional": ["Rule 3"] },
    "tools": { "core": ["Primary Software 1"], "recommended": ["Software 2"], "optional": ["Software 3"] },
    "testing": { "core": ["Audit / Quality Practice 1"], "recommended": ["Practice 2"], "optional": ["Practice 3"] },
    "deployment": { "core": ["Filing / Delivery Practice 1"], "recommended": ["Practice 2"], "optional": ["Practice 3"] }
  },
  "learningOrder": [
    {
      "step": 1,
      "skill": "Missing Prerequisite / Skill Name",
      "category": "Domain Category",
      "whyNow": "Why this step is next",
      "prerequisites": [],
      "topics": ["Topic 1", "Topic 2"],
      "recommendedTools": ["Tool 1"],
      "recommendedFrameworks": [],
      "project": "Hands-on domain exercise for this step",
      "expectedOutcome": "Outcome achieved"
    }
  ],
  "projectRoadmap": [
    {
      "projectNumber": 1,
      "projectName": "Domain-Specific Project Title",
      "skillsPracticed": ["Skill 1", "Skill 2"],
      "tools": ["Tool 1"],
      "difficulty": "beginner | intermediate | advanced",
      "purpose": "Specific domain learning purpose"
    }
  ],
  "technicalQuestions": [
    {
      "question": "Domain-specific technical or scenario question for this target role",
      "intention": "easy | medium | hard",
      "answer": "Concise 2-3 sentence clear solution and explanation."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Behavioral question customized for this target role and field",
      "intention": "Teamwork | Leadership | Problem Solving | Conflict",
      "answer": "Concise STAR method sample answer."
    }
  ],
  "roadmap": [
    {
      "step": "1",
      "title": "Phase Title",
      "description": "Milestone description"
    }
  ],
  "resume": {
    "name": "",
    "title": "",
    "skills": [],
    "experience": [],
    "projects": []
  },
  "reason": "Clear explanation of readiness gap assessment."
}
`;

  return await safeAICall(prompt);
}

module.exports = getMatchScore;