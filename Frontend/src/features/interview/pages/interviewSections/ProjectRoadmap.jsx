import React from 'react'

// ── Project Roadmap Card ─────────────────────────────────
const ProjectCard = ({ project, index }) => (
  <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between border-b border-[#2a3348] pb-3 flex-wrap gap-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#ff2d78] bg-[#ff2d78]/10 border border-[#ff2d78]/30 px-2.5 py-1 rounded-lg">
          Project #{project?.projectNumber || index + 1}
        </span>
        <h3 className="text-base font-bold text-[#e6edf3]">
          {project?.projectName || `Project ${index + 1}`}
        </h3>
      </div>
      {project?.difficulty && (
        <span className="text-xs uppercase tracking-wider font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
          {project.difficulty}
        </span>
      )}
    </div>

    {project?.purpose && (
      <p className="text-sm text-[#9aa4b2] leading-relaxed">
        <strong className="text-[#e6edf3]">Purpose: </strong>{project.purpose}
      </p>
    )}

    {project?.skillsPracticed?.length > 0 && (
      <div>
        <p className="text-xs text-[#ff2d78] font-semibold mb-1.5 uppercase tracking-wider">Skills Practiced</p>
        <div className="flex flex-wrap gap-1.5">
          {project.skillsPracticed.map((skill, idx) => (
            <span key={idx} className="text-xs bg-[#161b22] text-[#c9d1d9] px-2 py-0.5 rounded border border-[#2a3348]">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {project?.tools?.length > 0 && (
      <div className="text-xs text-[#7d8590]">
        <span className="text-cyan-400 font-semibold">Recommended Tech & Tools: </span>
        {project.tools.join(', ')}
      </div>
    )}
  </div>
)

const ProjectRoadmap = ({ report }) => {
  const projectRoadmap = report?.projectRoadmap || []

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#e6edf3]">Progressive Project Portfolio Roadmap</h2>
        <span className="text-xs text-[#7d8590]">Build these real-world projects to become interview-ready</span>
      </div>

      {projectRoadmap.length > 0 ? (
        projectRoadmap.map((proj, index) => (
          <ProjectCard key={index} project={proj} index={index} />
        ))
      ) : (
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-6 text-center text-[#7d8590]">
          No projects roadmap available.
        </div>
      )}
    </section>
  )
}

export default ProjectRoadmap
