import React from 'react'

const RoadMapDay = ({ day, index }) => {
  return (
    <div className="bg-[#1c2230] border border-[#2a3348] rounded-xl p-5 flex flex-col gap-3">
      <h3 className="text-base font-bold text-[#e6edf3]">
        {day?.title || `Day ${index + 1}`}
      </h3>
      {day?.description && (
        <p className="text-sm text-[#9aa4b2] leading-relaxed">
          {day.description}
        </p>
      )}
    </div>
  )
}

export default RoadMapDay
