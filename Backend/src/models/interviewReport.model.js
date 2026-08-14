const mongoose = require("mongoose");

/**
 * Technical Questions Schema
 */
const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    intention: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/**
 * Behavioral Questions Schema
 */
const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    intention: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/**
 * Roadmap Schema (Backwards compatibility)
 */
const roadmapSchema = new mongoose.Schema(
  {
    step: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/**
 * Resume JSON Schema
 */
const resumeSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    skills: [String],
    experience: [
      {
        role: String,
        company: String,
        points: [String],
      },
    ],
  },
  { _id: false }
);

/**
 * Missing Skill Detail Schema
 */
const missingSkillDetailSchema = new mongoose.Schema(
  {
    skill: String,
    category: String,
    status: String,
    priority: String,
    whyRequired: String,
    whatToLearn: [String],
    recommendedTools: [String],
    recommendedFrameworks: [String],
    frameworks: [String], // Backwards compatibility fallback
    prerequisites: [String],
    jobReadyOutcome: String,
  },
  { _id: false }
);

/**
 * Tech Stack Tier Schema (core, recommended, optional)
 */
const stackCategorySchema = new mongoose.Schema(
  {
    core: [String],
    recommended: [String],
    optional: [String],
  },
  { _id: false }
);

/**
 * Recommended Stack Schema
 */
const recommendedStackSchema = new mongoose.Schema(
  {
    frontend: stackCategorySchema,
    backend: stackCategorySchema,
    database: stackCategorySchema,
    security: stackCategorySchema,
    tools: stackCategorySchema,
    testing: stackCategorySchema,
    deployment: stackCategorySchema,
    // Backwards compatibility fallbacks
    styling: stackCategorySchema,
    animation: stackCategorySchema,
    authenticationSecurity: stackCategorySchema,
    developerTools: stackCategorySchema,
  },
  { _id: false }
);

/**
 * Detailed Learning Step Schema
 */
const learningStepSchema = new mongoose.Schema(
  {
    step: Number,
    skill: String,
    category: String,
    whyNow: String,
    prerequisites: [String],
    topics: [String],
    recommendedTools: [String],
    recommendedFrameworks: [String],
    frameworks: [String], // Backwards compatibility fallback
    project: String,
    expectedOutcome: String,
  },
  { _id: false }
);

/**
 * Project Roadmap Schema
 */
const projectRoadmapSchema = new mongoose.Schema(
  {
    projectNumber: Number,
    projectName: String,
    skillsPracticed: [String],
    tools: [String],
    difficulty: String,
    purpose: String,
  },
  { _id: false }
);

/**
 * Main Interview Report Schema
 */
const interviewReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    resume: {
      type: String, // raw resume text
    },

    selfDescription: {
      type: String,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    title: {
      type: String,
      required: true,
    },

    targetRole: String,
    summary: String,
    currentLevel: String,

    missingSkills: [missingSkillDetailSchema],
    strongSkills: [String],
    knownSkills: [String],
    partialSkills: [String],
    criticalGaps: [String],
    reason: String,

    recommendedStack: recommendedStackSchema,
    learningOrder: [learningStepSchema],
    projectRoadmap: [projectRoadmapSchema],

    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],

    roadmap: [roadmapSchema],
    resumeData: resumeSchema,
  },
  {
    timestamps: true,
  }
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);

module.exports = interviewReportModel;