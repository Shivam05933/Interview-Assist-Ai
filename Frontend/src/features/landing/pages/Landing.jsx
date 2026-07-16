import React from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import '../style/landing.scss';

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
      <main className="landing-loading">
        <h1>Loading...</h1>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link to="/" className="brand">InterviewAI</Link>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <Link to="/login" className="nav-button">Sign In</Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">AI Career Growth Platform</p>
            <h1>AI-Powered Career Roadmap Generator</h1>
            <p className="hero-text">
              Upload your resume, define your goal, and get a personalized roadmap with skill gap analysis.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="button primary-button">Get Started</Link>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="section-heading">
            <p className="eyebrow">Core capabilities</p>
            <h2>Everything you need to move forward with clarity.</h2>
          </div>
          <div className="feature-grid">
            {featureList.map((feature) => (
              <article className="feature-card" key={feature}>
                <h3>{feature}</h3>
                <p>Designed to help you turn your resume and career goal into a focused action plan.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="workflow-section">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>Follow a simple path from signup to a personalized roadmap.</h2>
          </div>
          <div className="workflow-list">
            {workflowSteps.map((step, index) => (
              <div className="workflow-card" key={step}>
                <span className="workflow-count">{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>InterviewAI © 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
