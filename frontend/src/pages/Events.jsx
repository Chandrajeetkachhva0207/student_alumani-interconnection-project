import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import './FeaturePages.css'

const Events = () => {
  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    eventType: 'Networking',
    maxAttendees: '',
    registrationLink: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events?isActive=true')
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/events', formData)
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        eventType: 'Networking',
        maxAttendees: '',
        registrationLink: ''
      })
      fetchEvents()
      alert('Event created successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating event')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      fetchEvents()
    } catch (error) {
      alert('Error deleting event')
    }
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading Events...</p>
        </div>
      </div>
    )
  }

  const getBadgeColor = (type) => {
    switch(type) {
      case 'Networking': return 'badge-blue';
      case 'Workshop': return 'badge-purple';
      case 'Seminar': return 'badge-green';
      case 'Social': return 'badge-yellow';
      case 'Career Fair': return 'badge-red';
      default: return 'badge-blue';
    }
  }

  return (
    <div className="main-content feature-wrapper">
      <div className="container">
        <div className="feature-header">
          <div>
            <h1>Events</h1>
            <p>Discover networking events and professional workshops</p>
          </div>
          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <button onClick={() => setShowForm(!showForm)} className="btn-create">
              {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Create Event</>}
            </button>
          )}
        </div>

        {showForm && (
          <div className="inline-form-card">
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="modern-form-group full-width">
                <label>Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="modern-form-group">
                <label>Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                >
                  <option value="Networking">Networking</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Social">Social</option>
                  <option value="Career Fair">Career Fair</option>
                </select>
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
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Main Hall or Virtual Link"
                />
              </div>
              <div className="modern-form-group">
                <label>Max Attendees</label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                  placeholder="Leave blank for no limit"
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
                <label>Registration Link</label>
                <input
                  type="url"
                  value={formData.registrationLink}
                  onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                  placeholder="https://"
                />
              </div>
              
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary-action" style={{ padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="feature-grid">
          {events.map((event) => (
            <div key={event.id} className="feature-card">
              <div className="card-title">
                {event.title}
                <span className={`status-badge ${getBadgeColor(event.eventType)}`}>
                  {event.eventType}
                </span>
              </div>
              
              <div className="card-meta">
                <div className="meta-row">
                  <FaCalendarAlt className="meta-icon" />
                  <strong>{new Date(event.date).toLocaleString()}</strong>
                </div>
                <div className="meta-row">
                  <FaMapMarkerAlt className="meta-icon" />
                  <span>{event.location || 'TBA'}</span>
                </div>
                {event.maxAttendees && (
                  <div className="meta-row">
                    <FaUsers className="meta-icon" />
                    <span>Capacity: {event.maxAttendees}</span>
                  </div>
                )}
              </div>

              <div className="card-description">
                {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
              </div>
              
              <div className="card-actions">
                {event.registrationLink && (
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="btn-action btn-primary-action">
                    <FaTicketAlt /> Register
                  </a>
                )}
                {(event.createdBy === user?.id || user?.role === 'admin') && (
                  <button onClick={() => handleDelete(event.id)} className="btn-action btn-danger-action" style={{ flex: '0.3' }}>
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="empty-state">
              <FaCalendarAlt className="empty-icon" />
              <h3>No events available</h3>
              <p>Check back soon for networking and learning opportunities.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Events
