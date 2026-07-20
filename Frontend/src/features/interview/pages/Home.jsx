import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if (loading) {
        return (
            <main className='grid min-h-screen place-items-center text-[#e6edf3] bg-[#0d1117]'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className='w-full min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col items-center justify-center px-[1rem] py-[1rem] gap-[1rem]'>

            {/* Header */}
            <header className='text-center'>
                <h1 className='text-[2.25rem] font-[700] mb-[0.5rem]'>
                    Create Your Custom <span className='text-[#ff2d78]'>Interview Plan</span>
                </h1>
                <p className='text-[#7d8590] text-[0.95rem] max-w-[480px] mx-auto leading-[1.6]'>
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
            </header>

            {/* Card */}
            <div className='w-full max-w-[900px] bg-[#161b22] border border-[1px] border-[#2a3348] rounded-[1rem] overflow-hidden'>

                <div className='flex min-h-[520px]'>

                    {/* LEFT */}
                    <div className='flex-1 flex flex-col gap-[1rem] p-[1.5rem] relative'>

                        <div className='flex items-center gap-[0.5rem] mb-[0.25rem]'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2 className='text-[1rem] font-[600] flex-1'>Target Job Description</h2>
                            <span className='text-[0.7rem] font-[600] px-[0.5rem] py-[0.15rem] rounded-[0.3rem] uppercase tracking-[0.03em] bg-[rgba(255,45,120,0.15)] text-[#ff2d78] border border-[1px] border-[rgba(255,45,120,0.3)]'>
                                Required
                            </span>
                        </div>

                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='flex-1 w-full bg-[#1e2535] border border-[1px] border-[#2a3348] rounded-[0.5rem] px-[1rem] py-[0.75rem] text-[#e6edf3] text-[0.875rem] outline-none  leading-[1.5] placeholder:text-[#7d8590] focus:border-[#ff2d78]'
                            maxLength={5000}
                            placeholder={`Paste the full job description here...
e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                        />

                        <div className='absolute bottom-[2.25rem] right-[2rem] text-[0.75rem] text-[#7d8590]'>
                            0 / 5000 chars
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className='w-[1px] bg-[#2a3348]' />

                    {/* RIGHT */}
                    <div className='flex-1 flex flex-col gap-[0.75rem] p-[1.5rem]'>

                        <div className='flex items-center gap-[0.5rem] mb-[0.25rem]'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2 className='text-[1rem] font-[600] flex-1'>Your Profile</h2>
                        </div>

                        {/* Upload */}
                        <div className='flex flex-col gap-[0.5rem]'>
                            <label className='flex items-center gap-[0.5rem] text-[0.875rem] font-[500] mb-[0.25rem]'>
                                Upload Resume
                                <span className='text-[0.7rem] font-[600] px-[0.5rem] py-[0.15rem] rounded-[0.3rem] uppercase tracking-[0.03em] bg-[rgba(255,45,120,0.15)] text-[#ff2d78] border border-[1px] border-[rgba(255,45,120,0.3)]'>
                                    Best Results
                                </span>
                            </label>

                            <label className='flex flex-col items-center justify-center gap-[0.35rem] px-[1rem] py-[1.5rem] bg-[#1e2535] border border-[2px] border-dashed border-[#2a3348] rounded-[0.6rem] cursor-pointer hover:border-[#ff2d78] hover:bg-[rgba(255,45,120,0.05)] transition'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                <p className='text-[0.875rem] font-[500]'>Click to upload or drag & drop</p>
                                <p className='text-[0.75rem] text-[#7d8590]'>PDF or DOCX (Max 5MB)</p>
                                <input ref={resumeInputRef} hidden type='file' />
                            </label>
                        </div>

                        {/* OR */}
                        <div className='flex items-center gap-[0.75rem] text-[0.75rem] text-[#7d8590]'>
                            <div className='flex-1 h-[1px] bg-[#2a3348]' />
                            <span>OR</span>
                            <div className='flex-1 h-[1px] bg-[#2a3348]' />
                        </div>

                        {/* Self desc */}
                        <div className='flex flex-col gap-[0.5rem]'>
                            <label className='text-[0.875rem] font-[500]'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                className='h-[96px] bg-[#1e2535] border border-[1px] border-[#2a3348] rounded-[0.5rem] px-[1rem] py-[0.75rem] text-[#e6edf3] text-[0.875rem] outline-none focus:border-[#ff2d78]'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."

                            />
                        </div>

                        {/* Info */}
                        <div className='flex items-start gap-[0.6rem] px-[1rem] py-[0.75rem] bg-[#1b2a4a] border border-[1px] border-[#2d4a7a] rounded-[0.5rem]'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p className='text-[0.8rem] text-[#8ab4f8] leading-[1.5]'>
                                Either a <strong className='text-[#e6edf3]'>Resume</strong> or a <strong className='text-[#e6edf3]'>Self Description</strong> is required.
                            </p>
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className='flex items-center justify-between px-[1.5rem] py-[1rem] border-t border-[1px] border-[#2a3348]'>

                    <span className='text-[0.8rem] text-[#7d8590]'>
                        AI-Powered Strategy Generation • Approx 30s
                    </span>

                    <button
                        onClick={handleGenerateReport}
                        className='flex items-center gap-[0.5rem] px-[1.5rem] py-[0.75rem] bg-[linear-gradient(135deg,#ff2d78_0%,#e02667_100%)] text-white text-[0.9rem] font-[600] rounded-[0.5rem] hover:opacity-[0.9] active:scale-[0.98] transition'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>

                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* Reports */}
            {reports.length > 0 && (
                <section className='flex flex-col gap-[0.75rem] w-full max-w-[900px]'>
                    <h2>My Recent Interview Plans</h2>

                    <ul className='flex flex-wrap gap-[0.75rem]'>
                        {reports.map(report => (
                            <li
                                key={report._id}
                                onClick={() => navigate(`/interview/${report._id}`)}
                                className='bg-[#161b22] border border-[1px] border-[#2a3348] rounded-[0.5rem] p-[1rem] flex-1 flex flex-col gap-[0.5rem] cursor-pointer'>

                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='text-[#7d8590] text-[0.8rem]'>
                                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                                </p>

                                <p className='text-[0.8rem] font-[600] text-[#ff2d78]'>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Footer */}
            <footer className='flex gap-[1.5rem]'>
                <a href='#' className='text-[0.8rem] text-[#7d8590] hover:text-[#e6edf3]'>Privacy Policy</a>
                <a href='#' className='text-[0.8rem] text-[#7d8590] hover:text-[#e6edf3]'>Terms of Service</a>
              
            </footer>

        </div>
    )
}

export default Home