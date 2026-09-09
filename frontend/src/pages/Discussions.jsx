import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { FaComments, FaTags, FaRegClock, FaTrash, FaPlus, FaTimes, FaUserCircle, FaThumbtack } from 'react-icons/fa'
import './FeaturePages.css'

const Discussions = () => {
  const { user } = useContext(AuthContext)
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General'
  })

  useEffect(() => {
    fetchDiscussions()
  }, [])

  const fetchDiscussions = async () => {
    try {
      const response = await api.get('/discussions')
      setDiscussions(response.data)
    } catch (error) {
      console.error('Error fetching discussions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/discussions', formData)
      setShowForm(false)
      setFormData({ title: '', content: '', category: 'General' })
      fetchDiscussions()
      alert('Discussion created successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating discussion')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return
    try {
      await api.delete(`/discussions/${id}`)
      fetchDiscussions()
    } catch (error) {
      alert('Error deleting discussion')
    }
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading Discussions...</p>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'General': return 'badge-blue';
      case 'Career': return 'badge-green';
      case 'Academic': return 'badge-purple';
      case 'Networking': return 'badge-yellow';
      case 'Events': return 'badge-red';
      case 'Jobs': return 'badge-blue';
      default: return 'badge-blue';
    }
  }

  return (
    <div className="main-content feature-wrapper">
      <div className="container">
        <div className="feature-header">
          <div>
            <h1>Discussion Forums</h1>
            <p>Join conversations, ask questions, and share ideas</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-create">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Topic</>}
          </button>
        </div>

        {showForm && (
          <div className="inline-form-card">
            <h2>Create New Discussion</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="modern-form-group full-width">
                <label>Discussion Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="What do you want to talk about?"
                />
              </div>
              <div className="modern-form-group full-width">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Career">Career</option>
                  <option value="Academic">Academic</option>
                  <option value="Networking">Networking</option>
                  <option value="Events">Events</option>
                  <option value="Jobs">Jobs</option>
                </select>
              </div>
              <div className="modern-form-group full-width">
                <label>Initial Post Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  style={{ minHeight: '150px' }}
                />
              </div>
              
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary-action" style={{ padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="feature-grid">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="feature-card" style={discussion.isPinned ? { borderTop: '4px solid #ecc94b' } : {}}>
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {discussion.isPinned && <FaThumbtack style={{ color: '#ecc94b', fontSize: '1rem' }} />}
                  {discussion.title}
                </span>
                <span className={`status-badge ${getCategoryColor(discussion.category)}`}>
                  {discussion.category}
                </span>
              </div>
              
              <div className="card-meta">
                <div className="meta-row">
                  <FaUserCircle className="meta-icon" />
                  <strong>{discussion.author?.firstName} {discussion.author?.lastName}</strong>
                </div>
                <div className="meta-row">
                  <FaRegClock className="meta-icon" />
                  <span>Posted {new Date(discussion.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="card-description">
                {discussion.content.length > 250 ? `${discussion.content.substring(0, 250)}...` : discussion.content}
              </div>
              
              <div className="card-actions">
                {(discussion.authorId === user?.id || user?.role === 'admin') ? (
                  <button onClick={() => handleDelete(discussion.id)} className="btn-action btn-danger-action">
                    <FaTrash /> Delete Thread
                  </button>
                ) : (
                  <div style={{ flex: 1 }}></div> // Spacing
                )}
              </div>
            </div>
          ))}

          {discussions.length === 0 && (
            <div className="empty-state">
              <FaComments className="empty-icon" />
              <h3>No discussions yet</h3>
              <p>Be the first to start a conversation in the forums!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Discussions
