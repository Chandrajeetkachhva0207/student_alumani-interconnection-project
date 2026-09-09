import { useContext } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { 
  FaChartPie, FaUserCircle, FaSearch, FaBriefcase, 
  FaCalendarAlt, FaHandsHelping, FaVideo, FaComments, FaSignOutAlt 
} from 'react-icons/fa'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) return null

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          
          <div className="nav-logo-container">
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="nav-logo-icon">S</div>
            </Link>
            <Link to="/dashboard" className="nav-logo">
              Student Alumni Interconnection Platform
            </Link>
          </div>

          <div className="nav-links">
            {user?.role !== 'admin' && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaChartPie /> Dashboard
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaUserCircle /> Profile
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaSearch /> Search
                </NavLink>
                <NavLink to="/jobs" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaBriefcase /> Jobs
                </NavLink>
                <NavLink to="/events" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaCalendarAlt /> Events
                </NavLink>
                <NavLink to="/mentorships" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaHandsHelping /> Mentorships
                </NavLink>
                <NavLink to="/webinars" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaVideo /> Webinars
                </NavLink>
                <NavLink to="/discussions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  <FaComments /> Discussions
                </NavLink>
              </>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <FaChartPie /> Admin Panel
              </NavLink>
            )}
            
            <div className="nav-user">
              <div className="user-profile-badge">
                <div className="user-avatar-small">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.firstName}</span>
                  <span className="nav-role">{user?.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
