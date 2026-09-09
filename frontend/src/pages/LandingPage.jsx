import React, { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FaUserGraduate, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import './LandingPage.css'

const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext)

  // If already logged in, skip the landing page entirely
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }


  return (
    <div className="landing-page">

      {/* Landing Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-icon">S</div>
          <span>Student Alumni Interconnection</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn-login-outline">Login</Link>
          <Link to="/register" className="btn-register-solid">Register</Link>
        </div>
      </nav>

      {/* Hero / Platform Information Section */}
      <section className="hero-section animate-fade-up">
        <div className="hero-badge">🚀 The premier networking platform</div>
        <h1 className="hero-title">
          Welcome to the <br />
          <span className="text-gradient">Student Alumni Platform</span>
        </h1>
        <p className="hero-subtitle">
          A dedicated space designed to bridge the gap between current students and successful alumni.
          Foster mentorships, explore job opportunities, schedule mock interviews, and build a lasting professional network.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-register-solid" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
            Join the Network Today
          </Link>
          <a href="#about" className="btn-secondary">Learn More</a>
        </div>
      </section>

      {/* About The Platform */}
      <section id="about" className="section-container animate-fade-up delay-1">
        <div className="section-header">
          <h2>About Our Platform</h2>
          <p>Discover the core mission behind our interconnection system.</p>
        </div>
        <div className="content-block">
          <h3>Our Mission</h3>
          <p>
            Our mission is to empower students by connecting them with experienced alumni, creating opportunities for mentorship, career guidance, job referrals, mock interviews, and professional networking. We aim to build a collaborative community where knowledge, experience, and opportunities are shared to help students achieve their career goals.
          </p>
          <br />
          <h3>Why We Built This</h3>
          <p>
            We built this platform to solve the critical gap in university ecosystems where students struggle to find relevant guidance and alumni want to give back but lack a structured channel. Realizing that traditional platforms are cluttered and ineffective, we designed a dedicated, professional space for alumni-student connections, free from spam and irrelevant noise.

          </p>
        </div>
      </section>


      {/* Contact Section */}
      <section className="section-container animate-fade-up delay-3">
        <div className="section-header">
          <h2>Contact Us</h2>
          <p>Have questions? Reach out to the development team.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon"><FaEnvelope /></div>
            <div className="contact-info">
              <h4>Email Support</h4>
              <p>[chandrajeetkachhva@gmail.com]</p>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon"><FaMapMarkerAlt /></div>
            <div className="contact-info">
              <h4>College Campus</h4>
              <p>[SSBT's COET, Bambhori, Jalgaon]</p>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon"><FaPhoneAlt /></div>
            <div className="contact-info">
              <h4>Phone</h4>
              <p>[+91 7020847714]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Student Alumni Interconnection Platform. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default LandingPage
