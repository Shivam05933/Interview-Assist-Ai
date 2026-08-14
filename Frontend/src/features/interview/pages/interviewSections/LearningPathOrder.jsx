import React from 'react'

// ── Learning Order Step Card ─────────────────────────────
const LearningStepCard = ({ step, index }) => {
  const prerequisites = Array.isArray(step?.prerequisites) ? step.prerequisites : []
  const recommendedTools = Array.isArray(step?.recommendedTools) ? step.recommendedTools : []
  const frameworks = Array.isArray(step?.recommendedFrameworks || step?.frameworks)
    ? (step.recommendedFrameworks || step.frameworks)
    : []

  return (
    <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between gap-3 border-b border-[#2a3348] pb-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-[#ff2d78]/10 text-[#ff2d78] border border-[#ff2d78]/30 px-2.5 py-1 rounded-lg">
            Step {step?.step || index + 1}
          </span>
          <h3 className="text-base font-bold text-[#e6edf3]">
            {step?.skill || step?.title || `Step ${index + 1}`}
          </h3>
        </div>
        {step?.category && (
          <span className="text-xs text-[#7d8590] bg-[#161b22] px-2 py-0.5 rounded border border-[#2a3348]">
            {step.category}
          </span>
        )}
      </div>

      {step?.whyNow && (
        <p className="text-sm text-[#9aa4b2] leading-relaxed">
          <strong className="text-[#e6edf3]">Why Now: </strong>{step.whyNow}
        </p>
      )}

      {step?.topics?.length > 0 && (
        <div>
          <p className="text-xs text-[#ff2d78] font-semibold mb-1.5 uppercase tracking-wider">Topics to Master</p>
          <div className="flex flex-wrap gap-1.5">
            {step.topics.map((t, idx) => (
              <span key={idx} className="text-xs bg-[#161b22] text-[#c9d1d9] px-2.5 py-1 rounded border border-[#2a3348]">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {(prerequisites.length > 0 || recommendedTools.length > 0 || frameworks.length > 0) && (
        <div className="flex flex-wrap gap-4 text-xs text-[#7d8590] pt-2 border-t border-[#2a3348]/60">
          {prerequisites.length > 0 && (
            <div>
              <span className="text-[#ff2d78]">Prerequisites: </span>
              {prerequisites.join(', ')}
            </div>
          )}
          {recommendedTools.length > 0 && (
            <div>
              <span className="text-cyan-400">Recommended Tools: </span>
              {recommendedTools.join(', ')}
            </div>
          )}
          {frameworks.length > 0 && (
            <div>
              <span className="text-purple-400">Frameworks/Libs: </span>
              {frameworks.join(', ')}
            </div>
          )}
        </div>
      )}

      {step?.project && (
        <div className="bg-[#161b22] border border-[#2a3348] rounded-lg p-3">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">🛠️ Hands-on Milestone Project</span>
          <p className="text-xs text-[#e6edf3] font-medium">{step.project}</p>
        </div>
      )}

      {step?.expectedOutcome && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 leading-relaxed">
          <strong>Expected Competency: </strong>{step.expectedOutcome}
        </p>
      )}
    </div>
  )
}

const LearningPathOrder = ({ report }) => {
  const learningOrder = report?.learningOrder?.length > 0 ? report.learningOrder : report?.roadmap || []

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#e6edf3]">Sequential Learning Order Path</h2>
        <span className="text-xs text-[#7d8590]">Prerequisite-ordered step-by-step roadmap</span>
      </div>

      {learningOrder.length > 0 ? (
        learningOrder.map((step, index) => (
          <LearningStepCard key={index} step={step} index={index} />
        ))
      ) : (
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-6 text-center text-[#7d8590]">
          No learning path available.
        </div>
      )}
    </section>
  )
}

export default LearningPathOrder
