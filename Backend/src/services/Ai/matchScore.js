const { safeAICall } = require("./utils");

async function getMatchScore(jobDescription, resume, selfDescription) {
  const prompt = `
You are an expert Technical Career Architect, Senior Staff Engineer,
Senior Technical Recruiter, ATS Specialist, and Engineering Mentor.

Your job is to perform a COMPLETE, HIGHLY ACCURATE, and PRACTICAL career-gap analysis.

The user wants to understand:
"What do I need to learn to become job-ready for my target role?"

This is NOT a simple keyword matching task.

Do NOT return a shallow list such as:
["JavaScript", "Backend Development", "Database"]

Instead, identify the actual technologies, frameworks, libraries, developer tools,
engineering skills, security skills, deployment skills, testing skills, and project skills
required specifically for the candidate's target role and job description.

========================================================
INPUTS
========================================================

TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

CANDIDATE RESUME:
${resume}

========================================================
STEP 1 — IDENTIFY THE TARGET ROLE & STACK REALITY
========================================================

Determine the candidate's actual target role from the job description and candidate's stated goal.

CRITICAL INSTRUCTION FOR TECHNOLOGY STACK SELECTION:
You MUST derive the primary technology stack strictly from the target role and job description.
DO NOT assume MERN stack by default for every user.

Examples:
- Target Role: "Java Full Stack Developer"
  Primary Stack MUST be Java-based:
  Backend: Java, Spring Boot, Spring MVC, Spring Data JPA, Hibernate
  Database: MySQL, PostgreSQL
  Security: Spring Security, JWT, Authentication, Authorization
  Tools: Maven, Postman, IntelliJ IDEA, Git, Docker
  Testing: JUnit, Mockito
  DO NOT recommend Node.js or Express.js as the primary backend for a Java Full Stack role unless explicitly requested by the job description.

- Target Role: "MERN Stack Developer"
  Primary Stack MUST be:
  Frontend: React, HTML, CSS, JavaScript
  Backend: Node.js, Express.js
  Database: MongoDB, Mongoose
  Security: JWT, bcrypt, Cookie Auth
  Tools: npm, Postman, VS Code, Git
  Testing: Jest, Supertest

- Target Role: "Python Full Stack Developer"
  Primary Stack MUST use Python (Django/FastAPI), PostgreSQL, etc.

========================================================
STEP 2 — DETERMINE CURRENT SKILL LEVEL
========================================================

Analyze exactly what the candidate already knows based strictly on evidence provided in the resume and self-description.
Only mark a skill as "known" or "strong" when supported by candidate evidence.

Do NOT mark a skill as known just because the target job mentions it.

========================================================
STEP 3 — DETERMINE COMPLETE SKILL GAPS
========================================================

Compare candidate's current skills against target role requirements.
Every missing skill MUST be a detailed object.

Required structure for missing skills:
{
  "skill": "JavaScript",
  "category": "Frontend",
  "status": "missing",
  "priority": "critical",
  "whyRequired": "Detailed explanation of why this skill is needed for the target role.",
  "whatToLearn": ["ES6+", "DOM", "Promises", "async/await", "closures", "modules", "event loop"],
  "prerequisites": ["HTML", "CSS"],
  "recommendedTools": ["Chrome DevTools", "VS Code"],
  "recommendedFrameworks": [],
  "jobReadyOutcome": "Build interactive frontend applications and integrate APIs."
}

Use:
status: "known" | "partial" | "missing"
priority: "critical" | "high" | "medium" | "low"

========================================================
STEP 4 — RECOMMENDED STACK (CORE / RECOMMENDED / OPTIONAL)
========================================================

Return a structured recommendedStack object grouped by exact category keys:
frontend, backend, database, security, tools, testing, deployment.

Each category MUST distinguish:
- core: Mandatory core technologies for this role
- recommended: Frequently used tools/frameworks that boost productivity
- optional: Enhancements / advanced tools (e.g. GSAP for animations, Kubernetes for complex orchestration)

========================================================
STEP 5 — DEPENDENCY-AWARE LEARNING ORDER
========================================================

Produce a step-by-step, prerequisite-ordered learning path.
Do NOT place advanced topics before their prerequisites (e.g., HTML -> CSS -> JS -> React -> Spring Boot / Node -> Database -> Auth -> Testing -> Docker -> Deployment).

Each step in learningOrder MUST contain:
- step (number)
- skill (string)
- category (string)
- whyNow (string)
- prerequisites (array of strings)
- topics (array of strings)
- recommendedTools (array of strings)
- recommendedFrameworks (array of strings)
- project (string)
- expectedOutcome (string)

========================================================
STEP 6 — PROJECT ROADMAP
========================================================

Recommend practical, progressively challenging projects tailored to the target tech stack.

Each entry in projectRoadmap MUST contain:
- projectNumber (number)
- projectName (string)
- skillsPracticed (array of strings)
- tools (array of strings)
- difficulty ("beginner" | "intermediate" | "advanced")
- purpose (string)

========================================================
STEP 7 — SCORE & SUMMARY
========================================================

Calculate a realistic 0-100 matchScore.
If the candidate only knows Java and wants to be a Java Full Stack Developer, score should be low (~20-30) because frontend, database, security, framework, testing, and deployment skills are missing. Do not give an artificially high score.

========================================================
STRICT JSON OUTPUT CONTRACT
========================================================

Return ONLY valid JSON.
No markdown. No code fences (\`\`\`). No text before or after JSON. No comments.

EXACT JSON STRUCTURE:
{
  "matchScore": 0,
  "title": "",
  "targetRole": "",
  "currentLevel": "",
  "summary": "",
  "strongSkills": [],
  "knownSkills": [],
  "partialSkills": [],
  "missingSkills": [
    {
      "skill": "",
      "category": "",
      "status": "missing",
      "priority": "critical",
      "whyRequired": "",
      "whatToLearn": [],
      "prerequisites": [],
      "recommendedTools": [],
      "recommendedFrameworks": [],
      "jobReadyOutcome": ""
    }
  ],
  "criticalGaps": [],
  "recommendedStack": {
    "frontend": {
      "core": [],
      "recommended": [],
      "optional": []
    },
    "backend": {
      "core": [],
      "recommended": [],
      "optional": []
    },
    "database": {
      "core": [],
      "recommended": [],
      "optional": []
    },
    "security": {
      "core": [],
      "recommended": [],
      "optional": []
    },
    "tools": {
      "core": [],
      "recommended": [],
      "optional": []
    },
    "testing": {
      "core": [],
      "recommended": [],
      "optional": []
    },
    "deployment": {
      "core": [],
      "recommended": [],
      "optional": []
    }
  },
  "learningOrder": [
    {
      "step": 1,
      "skill": "",
      "category": "",
      "whyNow": "",
      "prerequisites": [],
      "topics": [],
      "recommendedTools": [],
      "recommendedFrameworks": [],
      "project": "",
      "expectedOutcome": ""
    }
  ],
  "projectRoadmap": [
    {
      "projectNumber": 1,
      "projectName": "",
      "skillsPracticed": [],
      "tools": [],
      "difficulty": "beginner",
      "purpose": ""
    }
  ],
  "reason": ""
}
`;

  return await safeAICall(prompt);
}

module.exports = getMatchScore;