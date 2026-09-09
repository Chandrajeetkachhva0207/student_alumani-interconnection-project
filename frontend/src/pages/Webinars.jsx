import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { FaCalendarAlt, FaVideo, FaClock, FaUserTie, FaPlus, FaTimes, FaTrash, FaDesktop } from 'react-icons/fa'
import './FeaturePages.css'

const Webinars = () => {
  const { user } = useContext(AuthContext)
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    meetingLink: '',
    maxParticipants: '',
    topics: ''
  })

  useEffect(() => {
    fetchWebinars()
  }, [])

  const fetchWebinars = async () => {
    try {
      const response = await api.get('/webinars?isActive=true')
      setWebinars(response.data)
    } catch (error) {
      console.error('Error fetching webinars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const webinarData = {
        ...formData,
        topics: formData.topics.split(',').map(t => t.trim()).filter(t => t)
      }
      await api.post('/webinars', webinarData)
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        date: '',
        duration: '',
        meetingLink: '',
        maxParticipants: '',
        topics: ''
      })
      fetchWebinars()
      alert('Webinar created successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating webinar')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this webinar?')) return
    try {
      await api.delete(`/webinars/${id}`)
      fetchWebinars()
    } catch (error) {
      alert('Error deleting webinar')
    }
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading Webinars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content feature-wrapper">
      <div className="container">
        <div className="feature-header">
          <div>
            <h1>Webinars</h1>
            <p>Join virtual learning sessions, workshops, and panel talks</p>
          </div>
          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <button onClick={() => setShowForm(!showForm)} className="btn-create">
              {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Organize Webinar</>}
            </button>
          )}
        </div>

        {showForm && (
          <div className="inline-form-card">
            <h2>Organize New Webinar</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="modern-form-group full-width">
                <label>Webinar Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="modern-form-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="modern-form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 60"
                />
              </div>
              <div className="modern-form-group">
                <label>Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="Leave blank for unlimited"
                />
              </div>
              <div className="modern-form-group">
                <label>Topics (comma-separated)</label>
                <input
                  type="text"
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                  placeholder="e.g. System Design, Career"
                />
              </div>
              <div className="modern-form-group full-width">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  style={{ minHeight: '120px' }}
                />
              </div>
              <div className="modern-form-group full-width">
                <label>Meeting Link</label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  required
                  placeholder="https://zoom.us/j/..."
                />
              </div>
              
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary-action" style={{ padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Publish Webinar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="feature-grid">
          {webinars.map((webinar) => (
            <div key={webinar.id} className="feature-card">
              <div className="card-title">
                {webinar.title}
                <span className="status-badge badge-blue">
                  Virtual
                </span>
              </div>
              
              <div className="card-meta">
                <div className="meta-row">
                  <FaUserTie className="meta-icon" />
                  <strong>Hosted by {webinar.organizer?.firstName} {webinar.organizer?.lastName}</strong>
                </div>
                <div className="meta-row">
                  <FaCalendarAlt className="meta-icon" />
                  <span>{new Date(webinar.date).toLocaleString()}</span>
                </div>
                {webinar.duration && (
                  <div className="meta-row">
                    <FaClock className="meta-icon" />
                    <span>{webinar.duration} minutes</span>
                  </div>
                )}
                {(webinar.topics && webinar.topics.length > 0) && (
                  <div className="meta-row" style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#718096' }}>
                      Topics: {webinar.topics.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="card-description">
                {webinar.description.length > 120 ? `${webinar.description.substring(0, 120)}...` : webinar.description}
              </div>
              
              <div className="card-actions">
                {webinar.meetingLink && (
                  <a href={webinar.meetingLink} target="_blank" rel="noopener noreferrer" className="btn-action btn-primary-action">
                    <FaVideo /> Join Link
                  </a>
                )}
                {(webinar.organizerId === user?.id || user?.role === 'admin') && (
                  <button onClick={() => handleDelete(webinar.id)} className="btn-action btn-danger-action" style={{ flex: '0.3' }}>
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}

          {webinars.length === 0 && (
            <div className="empty-state">
              <FaDesktop className="empty-icon" />
              <h3>No webinars scheduled</h3>
              <p>Keep an eye out for upcoming virtual learning sessions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Webinars
