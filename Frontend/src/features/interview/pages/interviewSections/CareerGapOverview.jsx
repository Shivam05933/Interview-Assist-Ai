import React from 'react'

const CareerGapOverview = ({ report }) => {
  return (
    <section className="flex flex-col gap-6">
      {/* Critical Gaps Alert if present */}
      {report?.criticalGaps?.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold text-sm">
            <span>⚠️ Priority Critical Gaps Identified</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.criticalGaps.map((gap, i) => (
              <span key={i} className="text-xs bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-md border border-rose-500/30 font-medium">
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary & Reasoning */}
      {report?.summary && (
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#ff2d78] uppercase tracking-wider mb-2">Executive Summary</h3>
          <p className="text-sm text-[#c9d1d9] leading-relaxed">{report.summary}</p>
        </div>
      )}

      {report?.reason && (
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Assessment Rationale</h3>
          <p className="text-sm text-[#9aa4b2] leading-relaxed">{report.reason}</p>
        </div>
      )}

      {/* Skill Matrix Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Known Skills */}
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-4">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Verified Known Skills</span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[0.7rem]">{report?.knownSkills?.length || 0}</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {report?.knownSkills?.length > 0 ? (
              report.knownSkills.map((sk, idx) => (
                <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-1 rounded-md">
                  ✓ {sk}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#7d8590]">None verified yet</span>
            )}
          </div>
        </div>

        {/* Partial Skills */}
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Partial Skills</span>
            <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[0.7rem]">{report?.partialSkills?.length || 0}</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {report?.partialSkills?.length > 0 ? (
              report.partialSkills.map((sk, idx) => (
                <span key={idx} className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-1 rounded-md">
                  ~ {sk}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#7d8590]">None listed</span>
            )}
          </div>
        </div>

        {/* Strong Skills */}
        <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-4">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Strong Competencies</span>
            <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-[0.7rem]">{report?.strongSkills?.length || 0}</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {report?.strongSkills?.length > 0 ? (
              report.strongSkills.map((sk, idx) => (
                <span key={idx} className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-1 rounded-md">
                  ★ {sk}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#7d8590]">None listed</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareerGapOverview
