import React, { useState } from 'react'

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl overflow-hidden hover:border-[#ff2d78]/40 transition duration-200">
      <div
        onClick={() => setOpen(o => !o)}
        className="flex items-start gap-3 px-5 py-4 cursor-pointer select-none"
      >
        <span className="text-[0.7rem] font-bold text-[#ff2d78] bg-[#ff2d78]/10 border border-[#ff2d78]/20 rounded-md px-2 py-1 shrink-0 mt-0.5">
          Q{index + 1}
        </span>

        <p className="flex-1 text-sm font-semibold leading-relaxed text-[#e6edf3]">
          {item?.question}
        </p>

        <span className={`transition-transform duration-200 text-xs text-[#7d8590] shrink-0 ${open ? 'rotate-180 text-[#ff2d78]' : ''}`}>
          ▼
        </span>
      </div>

      {open && (
        <div className="px-5 pb-5 pt-3 border-t border-[#2a3348] flex flex-col gap-4 bg-[#161b22]/50">
          {item?.intention && (
            <div>
              <p className="text-xs font-semibold text-[#ff2d78] mb-1 uppercase tracking-wide">Intention / Focus</p>
              <p className="text-[0.85rem] text-[#9aa4b2] leading-relaxed">
                {item?.intention}
              </p>
            </div>
          )}

          {item?.answer && (
            <div>
              <p className="text-xs font-semibold text-[#ff2d78] mb-1 uppercase tracking-wide">Model Answer</p>
              <p className="text-[0.85rem] text-[#c9d1d9] leading-relaxed whitespace-pre-line bg-[#11161d] p-3 rounded-lg border border-[#2a3348]">
                {item?.answer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionCard
