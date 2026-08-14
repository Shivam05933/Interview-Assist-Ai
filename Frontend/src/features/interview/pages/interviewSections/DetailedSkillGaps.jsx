import React from 'react'

// ── Priority Badge Helper ─────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const p = (priority || 'high').toLowerCase()
  let colorStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  if (p === 'critical') colorStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold'
  else if (p === 'high') colorStyle = 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  else if (p === 'medium') colorStyle = 'bg-blue-500/15 text-blue-400 border-blue-500/30'
  else if (p === 'low') colorStyle = 'bg-slate-500/15 text-slate-400 border-slate-500/30'

  return (
    <span className={`text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded border ${colorStyle}`}>
      {priority || 'Required'}
    </span>
  )
}

// ── Detailed Skill Gap Card ─────────────────────────────
const SkillGapCard = ({ gap, index }) => {
  const isObj = typeof gap === 'object' && gap !== null
  const name = isObj ? gap.skill : gap
  const category = isObj ? gap.category : 'General Skill'
  const priority = isObj ? gap.priority : 'critical'
  const whyRequired = isObj ? gap.whyRequired : null
  const whatToLearn = isObj && Array.isArray(gap.whatToLearn) ? gap.whatToLearn : []
  const recommendedTools = isObj && Array.isArray(gap.recommendedTools) ? gap.recommendedTools : []
  const frameworks = isObj && Array.isArray(gap.recommendedFrameworks || gap.frameworks) ? (gap.recommendedFrameworks || gap.frameworks) : []
  const prerequisites = isObj && Array.isArray(gap.prerequisites) ? gap.prerequisites : []
  const jobReadyOutcome = isObj ? gap.jobReadyOutcome : null

  return (
    <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5 hover:border-[#3a445c] transition flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#2a3348] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff2d78]"></span>
          <h3 className="text-base font-bold text-[#e6edf3]">{name}</h3>
          {category && (
            <span className="text-xs text-[#7d8590] bg-[#161b22] px-2 py-0.5 rounded border border-[#2a3348]">
              {category}
            </span>
          )}
        </div>
        <PriorityBadge priority={priority} />
      </div>

      {whyRequired && (
        <p className="text-sm text-[#9aa4b2] leading-relaxed">
          <strong className="text-[#e6edf3] font-semibold">Why Required: </strong>
          {whyRequired}
        </p>
      )}

      {whatToLearn.length > 0 && (
        <div className="mt-1">
          <p className="text-xs text-[#ff2d78] font-semibold mb-1.5 uppercase tracking-wider">Key Concepts & Topics To Learn</p>
          <div className="flex flex-wrap gap-1.5">
            {whatToLearn.map((topic, idx) => (
              <span key={idx} className="text-xs bg-[#161b22] text-[#c9d1d9] px-2 py-1 rounded border border-[#2a3348]">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {(recommendedTools.length > 0 || frameworks.length > 0 || prerequisites.length > 0) && (
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

      {jobReadyOutcome && (
        <div className="bg-[#161b22] border border-[#2a3348] rounded-lg p-3 mt-1">
          <p className="text-xs text-emerald-400 font-semibold mb-0.5">🎯 Job-Ready Outcome</p>
          <p className="text-xs text-[#9aa4b2] leading-relaxed">{jobReadyOutcome}</p>
        </div>
      )}
    </div>
  )
}

const DetailedSkillGaps = ({ report }) => {
  const missingSkills = report?.missingSkills || []

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#e6edf3]">Comprehensive Skill Gaps ({missingSkills.length})</h2>
        <span className="text-xs text-[#7d8590]">Ranked by priority to achieve job readiness</span>
      </div>

      {missingSkills.length > 0 ? (
        missingSkills.map((gap, index) => (
          <SkillGapCard key={index} gap={gap} index={index} />
        ))
      ) : (
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-6 text-center text-[#7d8590]">
          No missing skills detected!
        </div>
      )}
    </section>
  )
}

export default DetailedSkillGaps
