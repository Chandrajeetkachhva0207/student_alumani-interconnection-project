import { useState, useEffect } from 'react'
import api from '../services/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { 
  FaUsers, FaBriefcase, FaCalendarAlt, FaComments, 
  FaChartBar, FaFileDownload, FaCheck, FaBan, FaTrash, FaDesktop 
} from 'react-icons/fa'
import './AdminPanel.css'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  
  // Data States
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [events, setEvents] = useState([])
  const [discussions, setDiscussions] = useState([])

  useEffect(() => {
    fetchDataForTab(activeTab)
  }, [activeTab])

  const fetchDataForTab = async (tab) => {
    setLoading(true)
    try {
      if (tab === 'dashboard') {
        const res = await api.get('/admin/analytics')
        setAnalytics(res.data)
      } else if (tab === 'users') {
        const res = await api.get('/users')
        setUsers(res.data)
      } else if (tab === 'jobs') {
        const res = await api.get('/jobs')
        setJobs(res.data)
      } else if (tab === 'events') {
        const res = await api.get('/events')
        setEvents(res.data)
      } else if (tab === 'discussions') {
        const res = await api.get('/discussions')
        setDiscussions(res.data)
      }
    } catch (error) {
      console.error(`Error fetching data for ${tab}:`, error)
      alert(`Failed to load ${tab} data. Make sure you are an admin.`)
    } finally {
      setLoading(false)
    }
  }

  // --- User Actions ---
  const handleApproveUser = async (id) => {
    try {
      await api.put(`/users/${id}/approve`)
      fetchDataForTab('users')
    } catch (error) {
      alert('Error approving user')
    }
  }

  const handleBlockUser = async (id, currentStatus) => {
    try {
      await api.put(`/users/${id}/block`)
      fetchDataForTab('users')
    } catch (error) {
      alert('Error blocking user')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user completely?')) return
    try {
      await api.delete(`/users/${id}`)
      fetchDataForTab('users')
    } catch (error) {
      alert('Error deleting user')
    }
  }

  const exportUsersPDF = () => {
    const doc = new jsPDF()
    doc.text("SAI Network - Users List", 14, 15)
    
    const tableColumn = ["Name", "Email", "Role", "Status", "Joined"]
    const tableRows = []

    users.forEach(user => {
      const userData = [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        !user.isActive ? "Blocked" : user.isApproved ? "Approved" : "Pending",
        new Date(user.createdAt).toLocaleDateString()
      ]
      tableRows.push(userData)
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })
    
    doc.save(`sai_users_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // --- Job Actions ---
  const handleToggleJobStatus = async (id, currentData) => {
    try {
      await api.put(`/jobs/${id}`, { isActive: !currentData.isActive })
      fetchDataForTab('jobs')
    } catch (error) {
      alert('Error toggling job status')
    }
  }

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job post?')) return
    try {
      await api.delete(`/jobs/${id}`)
      fetchDataForTab('jobs')
    } catch (error) {
      alert('Error deleting job')
    }
  }

  // --- Event Actions ---
  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      fetchDataForTab('events')
    } catch (error) {
      alert('Error deleting event')
    }
  }

  // --- Discussion Actions ---
  const handleDeleteDiscussion = async (id) => {
    if (!window.confirm('Are you sure you want to remove this discussion?')) return
    try {
      await api.delete(`/discussions/${id}`)
      fetchDataForTab('discussions')
    } catch (error) {
      alert('Error deleting discussion')
    }
  }

  const renderDashboard = () => (
    <div className="analytics-grid">
      <div className="stat-card">
        <FaUsers className="stat-icon" />
        <div className="stat-value">{analytics?.totalUsers || 0}</div>
        <div className="stat-label">Total Users</div>
      </div>
      <div className="stat-card">
        <FaChartBar className="stat-icon" style={{color: '#f59e0b'}} />
        <div className="stat-value">{analytics?.pendingUsers || 0}</div>
        <div className="stat-label">Pending Approvals</div>
      </div>
      <div className="stat-card">
        <FaBriefcase className="stat-icon" style={{color: '#10b981'}} />
        <div className="stat-value">{analytics?.totalJobs || 0}</div>
        <div className="stat-label">Active Jobs</div>
      </div>
      <div className="stat-card">
        <FaCalendarAlt className="stat-icon" style={{color: '#8b5cf6'}} />
        <div className="stat-value">{analytics?.totalEvents || 0}</div>
        <div className="stat-label">Events Hosted</div>
      </div>
      <div className="stat-card">
        <FaComments className="stat-icon" style={{color: '#ec4899'}} />
        <div className="stat-value">{analytics?.totalDiscussions || 0}</div>
        <div className="stat-label">Discussions</div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>User Management</h2>
        <button onClick={exportUsersPDF} className="btn-export">
          <FaFileDownload /> Export PDF
        </button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td><strong>{u.firstName} {u.lastName}</strong></td>
              <td>{u.email}</td>
              <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
              <td>
                <span className={`status-badge ${!u.isActive ? 'status-blocked' : u.isApproved ? 'status-approved' : 'status-pending'}`}>
                  {!u.isActive ? 'Blocked' : u.isApproved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  {!u.isApproved && u.isActive && (
                    <button onClick={() => handleApproveUser(u.id)} className="btn-action-small btn-approve" title="Approve">
                      <FaCheck />
                    </button>
                  )}
                  {u.role !== 'admin' && (
                    <button onClick={() => handleBlockUser(u.id, u.isActive)} className="btn-action-small btn-block" title={u.isActive ? 'Block' : 'Unblock'}>
                      <FaBan />
                    </button>
                  )}
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDeleteUser(u.id)} className="btn-action-small btn-reject" title="Delete">
                      <FaTrash />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderJobs = () => (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Job Moderation</h2>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td><strong>{j.title}</strong></td>
              <td>{j.company}</td>
              <td>{j.type}</td>
              <td>
                <span className={`status-badge ${j.isActive ? 'status-approved' : 'status-blocked'}`}>
                  {j.isActive ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleToggleJobStatus(j.id, j)} className={`btn-action-small ${j.isActive ? 'btn-block' : 'btn-approve'}`} title={j.isActive ? 'Hide Job' : 'Approve Job'}>
                    {j.isActive ? <FaBan /> : <FaCheck />}
                  </button>
                  <button onClick={() => handleDeleteJob(j.id)} className="btn-action-small btn-reject" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderEvents = () => (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Event Moderation</h2>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td><strong>{e.title}</strong></td>
              <td>{e.eventType}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleDeleteEvent(e.id)} className="btn-action-small btn-reject" title="Remove Event">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderDiscussions = () => (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Discussion & Spam Monitoring</h2>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discussions.map((d) => (
            <tr key={d.id}>
              <td><strong>{d.title}</strong></td>
              <td>{d.author?.firstName} {d.author?.lastName}</td>
              <td>{d.category}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleDeleteDiscussion(d.id)} className="btn-action-small btn-reject" title="Delete Spam">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="main-content admin-wrapper">
      <div className="container">
        
        <div className="admin-header">
          <h1>Command Center</h1>
          <p>System analytics and moderation tools</p>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <FaDesktop /> Dashboard
          </button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <FaUsers /> Users
          </button>
          <button className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
            <FaBriefcase /> Jobs
          </button>
          <button className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            <FaCalendarAlt /> Events
          </button>
          <button className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`} onClick={() => setActiveTab('discussions')}>
            <FaComments /> Discussions
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Loading Data...</p>
          </div>
        ) : (
          <div className="admin-content-area">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'jobs' && renderJobs()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'discussions' && renderDiscussions()}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminPanel
