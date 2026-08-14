import React from 'react'
import QuestionCard from './QuestionCard'

const BehavioralQuestions = ({ report }) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-[#e6edf3] mb-2">Behavioral Interview Questions</h2>
      <div className="flex flex-col gap-3">
        {report?.behavioralQuestions?.map((q, i) => (
          <QuestionCard key={i} item={q} index={i} />
        ))}
      </div>
    </section>
  )
}

export default BehavioralQuestions
