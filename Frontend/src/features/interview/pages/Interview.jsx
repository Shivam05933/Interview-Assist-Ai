import React, { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview.js";
import { useParams, useNavigate } from "react-router";
import CareerGapOverview from "./interviewSections/CareerGapOverview";
import DetailedSkillGaps from "./interviewSections/DetailedSkillGaps";
import RecommendedTechStack from "./interviewSections/RecommendedTechStack";
import LearningPathOrder from "./interviewSections/LearningPathOrder";
import ProjectRoadmap from "./interviewSections/ProjectRoadmap";
import TechnicalQuestions from "./interviewSections/TechnicalQuestions";
import BehavioralQuestions from "./interviewSections/BehavioralQuestions";

const NAV_ITEMS = [
  { id: "overview", label: "Career Gap Overview" },
  { id: "skills", label: "Detailed Skill Gaps" },
  { id: "stack", label: "Recommended Tech Stack" },
  { id: "learning", label: "Learning Path & Order" },
  { id: "projects", label: "Project Roadmap" },
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
];

// ── Main Component ─────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("overview");
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  useEffect(() => {
    if (report) {
      console.log("FRONTEND REPORT:", report);
      console.log("MISSING SKILLS:", report?.missingSkills);
      console.log("RECOMMENDED STACK:", report?.recommendedStack);
      console.log("LEARNING ORDER:", report?.learningOrder);
      console.log("PROJECT ROADMAP:", report?.projectRoadmap);
    }
  }, [report]);

  if (loading || !report) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff2d78] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-[#9aa4b2]">
            Analyzing career path & compiling gap analysis...
          </p>
        </div>
      </main>
    );
  }

  const missingSkills = report.missingSkills || [];

  return (
    <div className="w-full min-h-screen bg-[#0d1117] text-[#e6edf3] flex p-4 sm:p-6">
      <div className="flex flex-col md:flex-row w-full max-w-[1340px] mx-auto bg-[#161b22] border border-[#2a3348] rounded-2xl overflow-hidden shadow-2xl">
        {/* LEFT NAV */}
        <nav className="w-full md:w-[240px] shrink-0 px-4 py-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#2a3348]">
          <div>
            <div className="mb-6 px-2">
              <span className="text-[0.65rem] font-bold text-[#ff2d78] uppercase tracking-widest block mb-1">
                Career Architect AI
              </span>
              <h2 className="text-base font-bold text-[#e6edf3] line-clamp-1">
                {report.targetRole || report.title || "Career Report"}
              </h2>
            </div>

            <p className="text-xs text-[#7d8590] mb-2 px-2 uppercase tracking-wider font-semibold">
              Report Sections
            </p>

            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                    activeNav === item.id
                      ? "bg-[#ff2d78]/10 text-[#ff2d78] border border-[#ff2d78]/30 font-semibold"
                      : "text-[#7d8590] hover:bg-[#1c2230] hover:text-[#e6edf3]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resume Button */}
          {/* <div className="mt-8 pt-4 border-t border-[#2a3348]">
            <button
              onClick={() => getResumePdf(interviewId)}
              className="w-full flex items-center justify-center gap-2 bg-[linear-gradient(135deg,#ff2d78_0%,#e02667_100%)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition shadow-lg shadow-[#ff2d78]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Resume PDF
            </button>
          </div> */}
        </nav>

        {/* CENTER CONTENT */}
        <main className="flex-1 px-6 sm:px-8 py-7 overflow-y-auto min-h-[600px]">
          {/* Top Title Bar */}
          <div className="mb-6 pb-4 border-b border-[#2a3348] flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-[#ff2d78]/15 text-[#ff2d78] px-2.5 py-0.5 rounded-full border border-[#ff2d78]/30 font-semibold">
                  Target Role
                </span>
                <span className="text-xs text-[#7d8590]">
                  {report.currentLevel
                    ? `Current Level: ${report.currentLevel}`
                    : "Career Readiness Assessment"}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#e6edf3]">
                {report.targetRole ||
                  report.title ||
                  "Job Readiness Gap Analysis"}
              </h1>
            </div>

            <div className="flex items-center gap-3 bg-[#1c2230] px-4 py-2 rounded-xl border border-[#2a3348]">
              <span className="text-xs text-[#7d8590] uppercase font-bold tracking-wider">
                Match Score
              </span>
              <span className="text-2xl font-black text-[#ff2d78]">
                {report.matchScore ?? 0}%
              </span>
            </div>
          </div>

          {/* SECTION 1: OVERVIEW */}
          {activeNav === "overview" && <CareerGapOverview report={report} />}

          {/* SECTION 2: SKILL GAPS */}
          {activeNav === "skills" && <DetailedSkillGaps report={report} />}

          {/* SECTION 3: RECOMMENDED STACK */}
          {activeNav === "stack" && <RecommendedTechStack report={report} />}

          {/* SECTION 4: LEARNING PATH */}
          {activeNav === "learning" && <LearningPathOrder report={report} />}

          {/* SECTION 5: PROJECT ROADMAP */}
          {activeNav === "projects" && <ProjectRoadmap report={report} />}

          {/* SECTION 6: TECHNICAL QUESTIONS */}
          {activeNav === "technical" && <TechnicalQuestions report={report} />}

          {/* SECTION 7: BEHAVIORAL QUESTIONS */}
          {activeNav === "behavioral" && (
            <BehavioralQuestions report={report} />
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full md:w-[260px] shrink-0 p-6 flex flex-col gap-6 bg-[#161b22] border-t md:border-t-0 md:border-l border-[#2a3348]">
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 bg-[#1c2230] border border-[#2a3348] text-[#e6edf3] text-sm font-semibold px-4 py-2.5 rounded-xl hover:border-[#ff2d78]/40 hover:text-[#ff2d78] transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5 text-center">
            <p className="text-xs text-[#7d8590] uppercase font-bold tracking-wider mb-1">
              Target Readiness
            </p>
            <div className="text-4xl font-black text-[#ff2d78] mb-1">
              {report.matchScore ?? 0}%
            </div>
            <p className="text-xs text-[#9aa4b2]">
              {report.matchScore >= 80
                ? "Job-Ready Candidate"
                : report.matchScore >= 50
                  ? "Moderate Preparation Required"
                  : "Structured Learning Needed"}
            </p>
          </div>

          {/* Critical Gaps Quick Glance */}
          <div>
            <p className="text-xs text-[#7d8590] uppercase font-bold tracking-wider mb-2">
              Missing Skills Overview
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.length > 0 ? (
                missingSkills.slice(0, 10).map((item, i) => {
                  const name =
                    typeof item === "object" && item !== null
                      ? item.skill
                      : item;
                  return (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md border text-rose-300 border-rose-500/30 bg-rose-500/10 font-medium"
                    >
                      {name}
                    </span>
                  );
                })
              ) : (
                <span className="text-xs text-[#7d8590]">
                  No skill gaps listed
                </span>
              )}
              {missingSkills.length > 10 && (
                <span className="text-xs text-[#7d8590] self-center">
                  +{missingSkills.length - 10} more
                </span>
              )}
            </div>
          </div>

          {/* Strong Skills Quick Glance */}
          {report.strongSkills?.length > 0 && (
            <div>
              <p className="text-xs text-[#7d8590] uppercase font-bold tracking-wider mb-2">
                Strong Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {report.strongSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md border text-emerald-300 border-emerald-500/30 bg-emerald-500/10 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Interview;
