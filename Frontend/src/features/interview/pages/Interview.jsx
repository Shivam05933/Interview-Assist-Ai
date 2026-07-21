import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions' },
  { id: 'behavioral', label: 'Behavioral Questions' },
  { id: 'roadmap', label: 'Road Map' },
]

// ── Question Card ─────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-[#1c2230] border border-[#2a3348] rounded-lg overflow-hidden hover:border-[#3a445c] transition">
      <div
        onClick={() => setOpen(o => !o)}
        className="flex items-start gap-3 px-4 py-3 cursor-pointer select-none"
      >
        <span className="text-[0.7rem] font-bold text-[#ff2d78] bg-[rgba(255,45,120,0.1)] border border-[rgba(255,45,120,0.2)] rounded px-1.5 py-[2px] mt-[2px]">
          Q{index + 1}
        </span>

        <p className="flex-1 text-sm font-medium leading-relaxed text-[#e6edf3]">
          {item.question}
        </p>

        <span className={`transition ${open ? 'rotate-180 text-[#ff2d78]' : 'text-[#7d8590]'}`}>
          ▼
        </span>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-[#2a3348] flex flex-col gap-3">
          <div>
            <p className="text-xs text-[#ff2d78] mb-1">Intention</p>
            <p className="text-[0.83rem] text-[#9aa4b2] leading-relaxed">
              {item.intention}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#ff2d78] mb-1">Model Answer</p>
            <p className="text-[0.83rem] text-[#9aa4b2] leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Roadmap ─────────────────────────────────────
const RoadMapDay = ({ day }) => (
  <div className="bg-[#1c2230] border border-[#2a3348] rounded-lg p-4">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs font-semibold bg-[#ff2d78]/10 text-[#ff2d78] px-2 py-1 rounded">
        Day {day.day}
      </span>
      <h3 className="text-sm font-semibold text-[#e6edf3]">{day.focus}</h3>
    </div>

    <ul className="flex flex-col gap-2">
      {day.tasks.map((task, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-[#9aa4b2]">
          <span className="w-2 h-2 bg-[#ff2d78] rounded-full" />
          {task}
        </li>
      ))}
    </ul>
  </div>
)

// ── Main ─────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical')
  const { report, getReportById, loading, getResumePdf } = useInterview()
  const { interviewId } = useParams()

  useEffect(() => {
    if (interviewId) getReportById(interviewId)
  }, [interviewId])

  if (loading || !report) {
    return (
      <main className="w-full text-3xl  min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        Loading...
      </main>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#0d1117] text-[#e6edf3] flex p-6">
      <div className="flex w-full max-w-[1280px] mx-auto bg-[#161b22] border border-[#2a3348] rounded-2xl">

        {/* LEFT NAV */}
        <nav className="w-[220px] shrink-0 px-4 py-7 flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#7d8590] mb-3">Sections</p>

            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeNav === item.id
                    ? 'bg-[#ff2d78]/10 text-[#ff2d78]'
                    : 'text-[#7d8590] hover:bg-[#1c2230] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Resume Button */}
          <button
            onClick={() => getResumePdf(interviewId)}
            className="mt-6 bg-[#ff2d78] text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Download Resume
          </button>
        </nav>

        <div className="w-px bg-[#2a3348]" />

        {/* CENTER */}
        <main className="flex-1 px-8 py-7 overflow-y-auto">
          {activeNav === 'technical' && (
            <section>
              <h2 className="mb-4 font-bold">Technical Questions</h2>
              <div className="flex flex-col gap-3">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'behavioral' && (
            <section>
              <h2 className="mb-4 font-bold">Behavioral Questions</h2>
              <div className="flex flex-col gap-3">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section>
              <h2 className="mb-4 font-bold">Roadmap</h2>
              <div className="flex flex-col gap-4">
                {report.preparationPlan.map(day => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="w-px bg-[#2a3348]" />

        {/* RIGHT SIDEBAR */}
        <aside className="w-[260px] p-6 flex flex-col gap-6">
          <div className="text-center">
            <p className="text-xs text-[#7d8590]">Match Score</p>
            <div className="text-3xl font-bold text-[#ff2d78]">
              {report.matchScore}%
            </div>
          </div>

          <div>
            <p className="text-xs text-[#7d8590] mb-2">Skill Gaps</p>
            <div className="flex flex-wrap gap-2">
              {report.skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded border ${
                    gap.severity === 'high'
                      ? 'text-red-400 border-red-400'
                      : gap.severity === 'medium'
                      ? 'text-yellow-400 border-yellow-400'
                      : 'text-green-400 border-green-400'
                  }`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Interview