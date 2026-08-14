import React from 'react'

// ── Stack Category Card ─────────────────────────────────
const StackCategoryCard = ({ title, category }) => {
  if (!category) return null
  const core = category.core || []
  const recommended = category.recommended || []
  const optional = category.optional || []

  if (!core.length && !recommended.length && !optional.length) return null

  return (
    <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-[#e6edf3] border-b border-[#2a3348] pb-2 flex items-center justify-between">
        <span>{title}</span>
        <span className="w-2 h-2 rounded-full bg-[#ff2d78]"></span>
      </h3>

      {core.length > 0 && (
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-rose-400 block mb-1.5">Core</span>
          <div className="flex flex-wrap gap-1.5">
            {core.map((item, idx) => (
              <span key={idx} className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded-md font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-cyan-400 block mb-1.5">Recommended</span>
          <div className="flex flex-wrap gap-1.5">
            {recommended.map((item, idx) => (
              <span key={idx} className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-md font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {optional.length > 0 && (
        <div>
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Optional</span>
          <div className="flex flex-wrap gap-1.5">
            {optional.map((item, idx) => (
              <span key={idx} className="text-xs bg-slate-500/10 text-slate-300 border border-slate-500/20 px-2.5 py-1 rounded-md">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const RecommendedTechStack = ({ report }) => {
  const stack = report?.recommendedStack || {}

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-[#e6edf3] mb-2">Target Role Recommended Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StackCategoryCard title="Frontend" category={stack.frontend} />
        <StackCategoryCard title="Backend" category={stack.backend} />
        <StackCategoryCard title="Database" category={stack.database} />
        <StackCategoryCard title="Security" category={stack.security || stack.authenticationSecurity} />
        <StackCategoryCard title="Tools" category={stack.tools || stack.developerTools} />
        <StackCategoryCard title="Testing" category={stack.testing} />
        <StackCategoryCard title="Deployment" category={stack.deployment} />
      </div>
    </section>
  )
}

export default RecommendedTechStack
