const { safeAICall } = require("./utils");

async function getMatchScore(jobDescription, resume, selfDescription) {
  const prompt = `
You are an expert Technical Career Architect, Senior Staff Engineer, ATS Specialist, and Engineering Mentor.

Your job is to perform a COMPLETE, HIGHLY ACCURATE, and PRACTICAL career-gap analysis and interview preparation package.

INPUTS:
- TARGET JOB DESCRIPTION:
${jobDescription}

- CANDIDATE SELF DESCRIPTION:
${selfDescription}

- CANDIDATE RESUME:
${resume}

INSTRUCTIONS:
1. Identify the target role and core tech stack strictly from the job description.
2. Analyze candidate's current skill level strictly from provided evidence.
3. Identify missing skills, categorized recommended stack, step-by-step learning order, and project roadmap.
4. Provide a realistic 0-100 matchScore.
5. Generate 5 scenario-based technical questions with clear answers.
6. Generate 3 behavioral interview questions with STAR method answers.
7. Provide an 8-step career roadmap summary.
8. Build a clean, ATS-friendly candidate resume profile.

STRICT JSON OUTPUT CONTRACT:
Return ONLY a single valid JSON object. No markdown, no code fences (\`\`\`), no text before or after JSON.

Required JSON Structure:
{
  "matchScore": 70,
  "title": "Target Role Title",
  "targetRole": "Target Role Title",
  "currentLevel": "Intermediate",
  "summary": "Clear executive summary of candidate readiness and main gaps.",
  "strongSkills": ["Skill 1", "Skill 2"],
  "knownSkills": ["Skill 1"],
  "partialSkills": ["Skill 1"],
  "missingSkills": [
    {
      "skill": "Skill Name",
      "category": "Frontend | Backend | Database | Security | Tools | Testing | Deployment",
      "status": "missing",
      "priority": "critical | high | medium | low",
      "whyRequired": "Explanation of why this skill is needed.",
      "whatToLearn": ["Topic 1", "Topic 2"],
      "prerequisites": ["Prereq 1"],
      "recommendedTools": ["Tool 1"],
      "recommendedFrameworks": ["Framework 1"],
      "jobReadyOutcome": "Practical outcome after learning this skill."
    }
  ],
  "criticalGaps": ["Gap 1", "Gap 2"],
  "recommendedStack": {
    "frontend": { "core": ["React"], "recommended": ["Redux Toolkit"], "optional": ["Framer Motion"] },
    "backend": { "core": ["Node.js"], "recommended": ["Express"], "optional": ["NestJS"] },
    "database": { "core": ["MongoDB"], "recommended": ["Redis"], "optional": ["PostgreSQL"] },
    "security": { "core": ["JWT"], "recommended": ["bcrypt"], "optional": ["OAuth2"] },
    "tools": { "core": ["Git"], "recommended": ["Postman"], "optional": ["Docker"] },
    "testing": { "core": ["Jest"], "recommended": ["Supertest"], "optional": ["Cypress"] },
    "deployment": { "core": ["Vercel"], "recommended": ["Docker"], "optional": ["AWS"] }
  },
  "learningOrder": [
    {
      "step": 1,
      "skill": "Skill Name",
      "category": "Backend",
      "whyNow": "Why to learn this step first.",
      "prerequisites": ["HTML/CSS"],
      "topics": ["Topic 1", "Topic 2"],
      "recommendedTools": ["Tool 1"],
      "recommendedFrameworks": ["Framework 1"],
      "project": "Mini project title for this step",
      "expectedOutcome": "What student will achieve"
    }
  ],
  "projectRoadmap": [
    {
      "projectNumber": 1,
      "projectName": "Project Name",
      "skillsPracticed": ["Skill 1"],
      "tools": ["Tool 1"],
      "difficulty": "beginner | intermediate | advanced",
      "purpose": "Portfolio project purpose."
    }
  ],
  "technicalQuestions": [
    {
      "question": "Scenario based technical question for this role",
      "intention": "easy | medium | hard",
      "answer": "Detailed solution and explanation"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Behavioral question",
      "intention": "Teamwork | Conflict | Leadership",
      "answer": "STAR method sample answer"
    }
  ],
  "roadmap": [
    {
      "step": "1",
      "title": "Phase Title",
      "description": "Step description and project"
    }
  ],
  "resume": {
    "name": "Candidate Name",
    "title": "Target Role",
    "skills": ["Skill 1", "Skill 2"],
    "experience": [
      {
        "role": "Role Title",
        "company": "Company",
        "points": ["Key achievement 1", "Key achievement 2"]
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "points": ["Project highlight 1", "Project highlight 2"]
      }
    ]
  },
  "reason": "Brief summary explanation of the match score calculation."
}
`;

  return await safeAICall(prompt);
}

module.exports = getMatchScore;