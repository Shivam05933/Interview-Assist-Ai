import React from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';


const featureList = [
  'Career Goal Input',
  'Resume Upload',
  'AI Skill Analysis',
  'Personalized Roadmap Generation',
  'Skill Gap Score',
  'Resume Download'
];

const workflowSteps = [
  'Register',
  'Login',
  'Enter career goal',
  'Upload resume',
  'Add current skills',
  'Generate AI roadmap',
  'View score and improvements'
];

const Landing = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center text-white">
        <h1>Loading...</h1>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(210, 13, 59, 0.18), transparent 28%), radial-gradient(circle at 85% 10%, rgba(255, 255, 255, 0.04), transparent 22%), linear-gradient(135deg, #050507 0%, #09090c 100%)',
      }}
    >
      <header className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-[12.8px] px-[16px] pt-[19.2px] pb-0 md:flex-row md:gap-[0px] md:px-[32px] md:py-[21.6px]">
        <Link to="/" className="text-[1.3rem] font-[700] tracking-[0.04em] text-white no-underline">InterviewAI</Link>
        <nav className="flex flex-wrap items-center justify-center gap-[16px] text-[16px] font-[500] text-[#f2f2f2] md:flex-nowrap md:justify-normal">
          <a href="#features" className="transition hover:text-[#ff4d74]">Features</a>
          <a href="#workflow" className="transition hover:text-[#ff4d74]">Workflow</a>
          <Link to="/login" className="rounded-full border  bg-white/[0.08] px-3 py-1 backdrop-blur-[8px] transition hover:-translate-y-[1px] hover:border-[#d20d3b]/[0.4] hover:shadow-[0_8px_24px_rgba(210,13,59,0.16)]">Sign In</Link>
        </nav>
      </header>

      <main className="flex flex-col">
        <section className="mx-auto grid min-h-[74vh] max-w-[1200px] items-center px-[16px] pt-[72px] pb-[48px] md:px-[32px] md:pt-[96px] md:pb-[72px]">
          <div className="max-w-[760px]">
            <p className="mb-[13.6px] text-[0.8rem] font-bold uppercase tracking-[0.24em] text-[#ff4d74]">AI Career Growth Platform</p>
            <h1 className="mb-[16px] text-[clamp(2.45rem,4.6vw,3.9rem)] leading-[1.06] tracking-[-0.02em] text-white">AI-Powered Career Roadmap Generator</h1>
            <p className="mb-[30.4px] max-w-[680px] text-[1.07rem] leading-[1.8] text-[#d8d8d8]">
              Upload your resume, define your goal, and get a personalized roadmap with skill gap analysis.
            </p>
            <div className="flex flex-wrap gap-[16px]">
              <Link to="/signup" className="inline-flex items-center justify-center rounded-[999px] bg-[#d20d3b] px-[22.4px] py-[15.2px] font-semibold text-white shadow-[0_12px_32px_rgba(210,13,59,0.25)] transition hover:-translate-y-[2px] hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(210,13,59,0.24)]">Get Started</Link>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-[1200px] px-[16px] pt-[35.2px] pb-[19.2px] md:px-[32px] md:pt-[48px] md:pb-[32px]">
          <div className="mb-[25.6px]">
            <p className="mb-[13.6px] text-[0.8rem] font-[700] uppercase tracking-[0.24em] text-[#ff4d74]">Core capabilities</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.2rem)] tracking-[-0.01em] text-white">Everything you need to move forward with clarity.</h2>
          </div>
          <div className="grid grid-cols-1 gap-[18.4px] md:grid-cols-3">
            {featureList.map((feature) => (
              <article className="rounded-[1.15rem] border border-white/[0.12] bg-white/[0.055] p-[24px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-[14px] transition hover:-translate-y-[3px] hover:border-[#d20d3b]/[0.28] hover:shadow-[0_16px_36px_rgba(210,13,59,0.16)]" key={feature}>
                <h3 className="mb-[9.6px] mt-0 text-[1.05rem] font-[700] text-white">{feature}</h3>
                <p className="m-0 text-[16px] leading-[1.75] text-[#d8d8d8]">Designed to help you turn your resume and career goal into a focused action plan.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto w-full max-w-[1200px] px-[16px] pt-[35.2px] pb-[19.2px] md:px-[32px] md:pt-[48px] md:pb-[32px]">
          <div className="mb-[25.6px]">
            <p className="mb-[13.6px] text-[0.8rem] font-[700] uppercase tracking-[0.24em] text-[#ff4d74]">How it works</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.2rem)] tracking-[-0.01em] text-white">Follow a simple path from signup to a personalized roadmap.</h2>
          </div>
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <div className="flex items-center gap-[14.4px] rounded-[1.15rem] border border-white/[0.12] bg-white/[0.055] p-[20px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-[14px] transition hover:-translate-y-[3px] hover:border-[#d20d3b]/[0.28] hover:shadow-[0_16px_36px_rgba(210,13,59,0.16)]" key={step}>
                <span className="flex h-[2.2rem] w-[2.2rem] items-center justify-center rounded-full bg-[#d20d3b] font-[700] text-white shadow-[0_8px_20px_rgba(210,13,59,0.22)]">{index + 1}</span>
                <p className="m-0 text-[16px] leading-[1.75] text-[#d8d8d8]">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-[16px] w-full max-w-[1200px] border-t border-white/[0.06] p-2 text-center text-[16px] text-[#a1a1a1]">
        <p>InterviewAI © 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
