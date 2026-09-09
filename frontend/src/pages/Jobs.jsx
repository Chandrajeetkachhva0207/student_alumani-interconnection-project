import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaTrash, FaExternalLinkAlt, FaPlus, FaTimes } from 'react-icons/fa'
import './FeaturePages.css'

const Jobs = () => {
  const { user } = useContext(AuthContext)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'Full-time',
    requirements: '',
    applicationLink: '',
    deadline: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs?isActive=true')
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r)
      }
      await api.post('/jobs', jobData)
      setShowForm(false)
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        type: 'Full-time',
        requirements: '',
        applicationLink: '',
        deadline: ''
      })
      fetchJobs()
      alert('Job posted successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error posting job')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await api.delete(`/jobs/${id}`)
      fetchJobs()
    } catch (error) {
      alert('Error deleting job')
    }
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading Opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content feature-wrapper">
      <div className="container">
        <div className="feature-header">
          <div>
            <h1>Job Opportunities</h1>
            <p>Browse available job and internship opportunities from the network</p>
          </div>
          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <button onClick={() => setShowForm(!showForm)} className="btn-create">
              {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Post Job</>}
            </button>
          )}
        </div>

        {showForm && (
          <div className="inline-form-card">
            <h2>Post New Job</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="modern-form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="modern-form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="modern-form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="modern-form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="modern-form-group full-width">
                <label>Requirements (comma-separated)</label>
                <input
                  type="text"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="e.g. React, Node.js, 3+ years experience"
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
              <div className="modern-form-group">
                <label>Application Link</label>
                <input
                  type="url"
                  value={formData.applicationLink}
                  onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                  placeholder="https://"
                />
              </div>
              <div className="modern-form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary-action" style={{ padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="feature-grid">
          {jobs.map((job) => (
            <div key={job.id} className="feature-card">
              <div className="card-title">
                {job.title}
                <span className={`status-badge ${job.type === 'Internship' ? 'badge-purple' : 'badge-blue'}`}>
                  {job.type}
                </span>
              </div>
              
              <div className="card-meta">
                <div className="meta-row">
                  <FaBuilding className="meta-icon" />
                  <strong>{job.company}</strong>
                </div>
                <div className="meta-row">
                  <FaMapMarkerAlt className="meta-icon" />
                  <span>{job.location || 'Remote'}</span>
                </div>
                {job.deadline && (
                  <div className="meta-row">
                    <FaCalendarAlt className="meta-icon" />
                    <span>Apply by {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="card-description">
                {job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
              </div>
              
              <div className="card-actions">
                {job.applicationLink && (
                  <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="btn-action btn-primary-action">
                    <FaExternalLinkAlt /> Apply Now
                  </a>
                )}
                {(job.postedBy === user?.id || user?.role === 'admin') && (
                  <button onClick={() => handleDelete(job.id)} className="btn-action btn-danger-action" style={{ flex: '0.3' }}>
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="empty-state">
              <FaBriefcase className="empty-icon" />
              <h3>No jobs available</h3>
              <p>Check back later or post a new opportunity if you're an alumni.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Jobs
