import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { 
  FaBriefcase, FaCalendarAlt, FaVideo, FaComments, 
  FaUserEdit, FaSearch, FaUserGraduate, FaPlusCircle, FaMicrophone,
  FaFileAlt, FaClipboardCheck
} from 'react-icons/fa'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    jobs: 0,
    events: 0,
    webinars: 0,
    discussions: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const [jobsRes, eventsRes, webinarsRes, discussionsRes] = await Promise.all([
        api.get('/jobs?isActive=true'),
        api.get('/events?isActive=true'),
        api.get('/webinars?isActive=true'),
        api.get('/discussions')
      ])

      setStats({
        jobs: jobsRes.data.length,
        events: eventsRes.data.length,
        webinars: webinarsRes.data.length,
        discussions: discussionsRes.data.length
      })
      setError('')
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load dashboard data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="main-content dashboard-wrapper">
      <div className="container">
        <div className="dashboard-header glass-panel">
          <div>
            <h1>{getGreeting()}, <span className="text-gradient">{user?.firstName || 'User'}!</span></h1>
            <p>Welcome to your central hub. Here's what's happening in your network today.</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Loading your network stats...</p>
          </div>
        ) : (
          <div className="dashboard-metrics">
            <Link to="/jobs" className="metric-card glass-panel hover-lift link-card">
              <div className="metric-icon bg-blue"><FaBriefcase /></div>
              <div className="metric-details">
                <h3>Job Opportunities</h3>
                <p className="metric-value text-blue">{stats.jobs}</p>
              </div>
            </Link>

            <Link to="/events" className="metric-card glass-panel hover-lift link-card">
              <div className="metric-icon bg-green"><FaCalendarAlt /></div>
              <div className="metric-details">
                <h3>Upcoming Events</h3>
                <p className="metric-value text-green">{stats.events}</p>
              </div>
            </Link>

            <Link to="/webinars" className="metric-card glass-panel hover-lift link-card">
              <div className="metric-icon bg-yellow"><FaVideo /></div>
              <div className="metric-details">
                <h3>Webinars</h3>
                <p className="metric-value text-yellow">{stats.webinars}</p>
              </div>
            </Link>

            <Link to="/discussions" className="metric-card glass-panel hover-lift link-card">
              <div className="metric-icon bg-red"><FaComments /></div>
              <div className="metric-details">
                <h3>Discussions</h3>
                <p className="metric-value text-red">{stats.discussions}</p>
              </div>
            </Link>
          </div>
        )}

        <div className="quick-actions-section glass-panel mt-30">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/profile" className="action-btn action-primary">
              <FaUserEdit className="action-icon" />
              <span>Update Profile</span>
            </Link>
            
            <Link to="/search" className="action-btn action-secondary">
              <FaSearch className="action-icon" />
              <span>Search Users</span>
            </Link>

            {user?.role === 'student' && (
              <>
                <Link to="/mentorships" className="action-btn action-success">
                  <FaUserGraduate className="action-icon" />
                  <span>Request Mentorship</span>
                </Link>
                <Link to="/interview-practice" className="action-btn action-purple">
                  <FaMicrophone className="action-icon" />
                  <span>AI Mock Interview</span>
                </Link>
                <Link to="/resume-builder" className="action-btn action-orange">
                  <FaFileAlt className="action-icon" />
                  <span>Resume Builder</span>
                </Link>
                <Link to="/ats-checker" className="action-btn action-primary">
                  <FaClipboardCheck className="action-icon" />
                  <span>ATS Checker</span>
                </Link>
              </>
            )}

            {user?.role === 'alumni' && (
              <>
                <Link to="/jobs" className="action-btn action-success">
                  <FaPlusCircle className="action-icon" />
                  <span>Post a Job</span>
                </Link>
                <Link to="/events" className="action-btn action-purple">
                  <FaCalendarAlt className="action-icon" />
                  <span>Post an Event</span>
                </Link>
                <Link to="/webinars" className="action-btn action-orange">
                  <FaVideo className="action-icon" />
                  <span>Organize Webinar</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
