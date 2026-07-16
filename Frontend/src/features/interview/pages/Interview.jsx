import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='bg-[#1c2230] border border-[1px] border-[#2a3348] rounded-[9.6px] overflow-hidden'>
            <div onClick={() => setOpen(o => !o)} className='flex items-start gap-[12px] px-[16px] py-[14.4px] cursor-pointer'>
                <span className='text-[11px] font-[700] text-[#ff2d78] bg-[rgba(255,45,120,0.1)] border border-[1px] border-[rgba(255,45,120,0.2)] rounded-[4.8px] px-[6.4px] py-[2.4px]'>
                    Q{index + 1}
                </span>
                <p className='flex-1 text-[14.4px] font-[500] text-[#e6edf3]'>{item.question}</p>
            </div>
            {open && (
                <div className='px-[16px] pb-[16px] pt-[12px] flex flex-col gap-[12px] border-t border-[1px] border-[#2a3348]'>
                    <p className='text-[13px]'>{item.intention}</p>
                    <p className='text-[13px]'>{item.answer}</p>
                </div>
            )}
        </div>
    )
}

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
        return <main><h1>Loading...</h1></main>
    }

    return (
        <div className='w-full min-h-[100vh] bg-[#0d1117] text-[#e6edf3] flex items-stretch p-[24px]'>
            <div className='flex w-full max-w-[1280px] m-[0_auto] bg-[#161b22] border border-[1px] border-[#2a3348] rounded-[16px]'>

                <nav className='w-[220px] p-[28px_16px] flex flex-col'>
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[14px] ${
                                activeNav === item.id
                                    ? 'bg-[rgba(255,45,120,0.1)] text-[#ff2d78]'
                                    : 'text-[#7d8590] hover:bg-[#1c2230] hover:text-[#e6edf3]'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <main className='flex-1 p-[28px_32px] overflow-y-auto'>
                    {activeNav === 'technical' && (
                        <div className='flex flex-col gap-[12px]'>
                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </div>
                    )}
                </main>

                <aside className='w-[240px] p-[28px_20px]'>
                    <div className='flex flex-col items-center gap-[10px]'>
                        <div className='w-[90px] h-[90px] rounded-[50%] border-[4px] flex items-center justify-center'>
                            <span className='text-[26px] font-[800]'>{report.matchScore}%</span>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    )
}

export default Interview