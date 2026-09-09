import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { FaUserFriends, FaHandsHelping, FaCommentDots, FaCalendarCheck, FaCheck, FaTimes, FaPlus } from 'react-icons/fa'
import './FeaturePages.css'

const Mentorships = () => {
  const { user } = useContext(AuthContext)
  const [mentorships, setMentorships] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [alumniList, setAlumniList] = useState([])
  const [formData, setFormData] = useState({
    alumniId: '',
    message: ''
  })

  useEffect(() => {
    fetchMentorships()
    if (user?.role === 'student') {
      fetchAlumni()
    }
  }, [user])

  const fetchMentorships = async () => {
    try {
      const response = await api.get('/mentorships')
      setMentorships(response.data)
    } catch (error) {
      console.error('Error fetching mentorships:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAlumni = async () => {
    try {
      const response = await api.get('/users/search?role=alumni')
      setAlumniList(response.data)
    } catch (error) {
      console.error('Error fetching alumni:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/mentorships', formData)
      setShowForm(false)
      setFormData({ alumniId: '', message: '' })
      fetchMentorships()
      alert('Mentorship request sent!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending request')
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/mentorships/${id}`, { status })
      fetchMentorships()
    } catch (error) {
      alert('Error updating status')
    }
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading Mentorships...</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return 'badge-green';
      case 'rejected': return 'badge-red';
      case 'completed': return 'badge-purple';
      default: return 'badge-yellow'; // pending
    }
  }

  return (
    <div className="main-content feature-wrapper">
      <div className="container">
        <div className="feature-header">
          <div>
            <h1>Mentorship Program</h1>
            <p>Connect with experienced alumni for guidance and career growth</p>
          </div>
          {user?.role === 'student' && (
            <button onClick={() => setShowForm(!showForm)} className="btn-create">
              {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Request Mentorship</>}
            </button>
          )}
        </div>

        {showForm && user?.role === 'student' && (
          <div className="inline-form-card">
            <h2>Request Mentorship</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="modern-form-group full-width">
                <label>Select Alumni Mentor</label>
                <select
                  value={formData.alumniId}
                  onChange={(e) => setFormData({ ...formData, alumniId: e.target.value })}
                  required
                >
                  <option value="">Choose an alumni...</option>
                  {alumniList.map((alumni) => (
                    <option key={alumni.id} value={alumni.id}>
                      {alumni.firstName} {alumni.lastName} - {alumni.Alumni?.company || 'Alumni'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modern-form-group full-width">
                <label>Introductory Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Why are you interested in mentorship from this person? What are your goals?"
                  required
                  style={{ minHeight: '120px' }}
                />
              </div>
              
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary-action" style={{ padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Send Request
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="feature-grid">
          {mentorships.map((mentorship) => {
            const partner = user?.role === 'student' ? mentorship.alumni : mentorship.student;
            const roleLabel = user?.role === 'student' ? 'Mentor' : 'Mentee';
            
            return (
              <div key={mentorship.id} className="feature-card">
                <div className="card-title">
                  {partner?.firstName} {partner?.lastName}
                  <span className={`status-badge ${getStatusBadge(mentorship.status)}`}>
                    {mentorship.status}
                  </span>
                </div>
                
                <div className="card-meta">
                  <div className="meta-row">
                    <FaUserFriends className="meta-icon" />
                    <strong>{roleLabel}</strong>
                  </div>
                  {mentorship.startDate && (
                    <div className="meta-row">
                      <FaCalendarCheck className="meta-icon" />
                      <span>Started on {new Date(mentorship.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {mentorship.message && (
                  <div className="card-description">
                    <div className="meta-row" style={{ color: '#2d3748', fontWeight: 'bold' }}>
                      <FaCommentDots className="meta-icon" /> Message:
                    </div>
                    {mentorship.message}
                  </div>
                )}
                
                {user?.role === 'alumni' && mentorship.status === 'pending' && (
                  <div className="card-actions" style={{ marginTop: '20px' }}>
                    <button
                      onClick={() => handleUpdateStatus(mentorship.id, 'accepted')}
                      className="btn-action btn-primary-action"
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(mentorship.id, 'rejected')}
                      className="btn-action btn-danger-action"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {mentorships.length === 0 && (
            <div className="empty-state">
              <FaHandsHelping className="empty-icon" />
              <h3>No mentorship records found</h3>
              <p>{user?.role === 'student' ? "Start your career journey by requesting a mentor above." : "You have no pending requests from students yet."}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Mentorships
