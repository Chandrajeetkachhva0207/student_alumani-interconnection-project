import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { 
  FaUser, FaEnvelope, FaBriefcase, FaGraduationCap, 
  FaGithub, FaLinkedin, FaGlobe, FaPencilAlt, FaCheck, FaTimes 
} from 'react-icons/fa'
import './Profile.css'

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${user.id}`)
      setProfile(response.data)
      setFormData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleNestedChange = (e, domain) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [domain]: { 
        ...formData[domain], 
        [name]: type === 'checkbox' ? checked : value 
      }
    })
  }

  const handleArrayChange = (field, value, domain) => {
    const arr = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData({
      ...formData,
      [domain]: { ...formData[domain], [field]: arr }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        profilePicture: formData.profilePicture
      }

      if (user.role === 'student' && formData.Student) {
        Object.assign(updateData, {
          studentId: formData.Student.studentId,
          major: formData.Student.major,
          year: formData.Student.year,
          gpa: formData.Student.gpa,
          skills: formData.Student.skills,
          interests: formData.Student.interests,
          bio: formData.Student.bio,
          linkedin: formData.Student.linkedin,
          github: formData.Student.github
        })
      } else if (user.role === 'alumni' && formData.Alumni) {
        Object.assign(updateData, {
          company: formData.Alumni.company,
          role: formData.Alumni.role,
          experience: formData.Alumni.experience,
          graduationYear: formData.Alumni.graduationYear,
          skills: formData.Alumni.skills,
          bio: formData.Alumni.bio,
          linkedin: formData.Alumni.linkedin,
          github: formData.Alumni.github,
          website: formData.Alumni.website,
          isAvailableForMentorship: formData.Alumni.isAvailableForMentorship
        })
      }

      const response = await api.put(`/users/${user.id}`, updateData)
      setProfile(response.data)
      updateUser(response.data)
      setEditing(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile')
    }
  }

  const cancelEdit = () => {
    setFormData(profile)
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p>Loading Profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) return <div className="error">Error loading profile</div>

  const initial = formData.firstName ? formData.firstName.charAt(0).toUpperCase() : 'U'
  const isStudent = profile.role === 'student'
  const details = isStudent ? formData.Student : formData.Alumni

  return (
    <div className="main-content profile-wrapper">
      <div className="container">
        
        <div className="profile-header">
          <h1>My Profile</h1>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-edit">
              <FaPencilAlt style={{ marginRight: '8px' }} /> Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <div className="profile-grid">
          {/* Sidebar */}
          <div className="glass-card profile-sidebar">
            <div className="avatar-placeholder">{initial}</div>
            <h2 className="sidebar-name">{formData.firstName} {formData.lastName}</h2>
            <div className="sidebar-role">{profile.role}</div>

            <div className="sidebar-details">
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <span>{profile.email}</span>
              </div>
              
              {isStudent && details?.major && (
                <div className="detail-item">
                  <FaGraduationCap className="detail-icon" />
                  <span>{details.major}</span>
                </div>
              )}

              {!isStudent && details?.company && (
                <div className="detail-item">
                  <FaBriefcase className="detail-icon" />
                  <span>{details.role} at {details.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="glass-card">
            <form onSubmit={handleSubmit}>
              <h3 className="section-title"><FaUser /> Basic Information</h3>
              <div className="form-grid">
                <div className="modern-form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>
                <div className="modern-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>
              </div>

              {/* Specific Info Section */}
              <h3 className="section-title" style={{ marginTop: '30px' }}>
                {isStudent ? <FaGraduationCap /> : <FaBriefcase />}
                {isStudent ? ' Academic Details' : ' Professional Details'}
              </h3>
              
              <div className="form-grid">
                {isStudent ? (
                  <>
                    <div className="modern-form-group">
                      <label>Student ID</label>
                      <input
                        type="text"
                        name="studentId"
                        value={details?.studentId || ''}
                        onChange={(e) => handleNestedChange(e, 'Student')}
                        disabled={!editing}
                      />
                    </div>
                    <div className="modern-form-group">
                      <label>Major</label>
                      <input
                        type="text"
                        name="major"
                        value={details?.major || ''}
                        onChange={(e) => handleNestedChange(e, 'Student')}
                        disabled={!editing}
                      />
                    </div>
                    <div className="modern-form-group">
                      <label>Year</label>
                      <select
                        name="year"
                        value={details?.year || ''}
                        onChange={(e) => handleNestedChange(e, 'Student')}
                        disabled={!editing}
                      >
                        <option value="">Select Year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                    <div className="modern-form-group">
                      <label>GPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        name="gpa"
                        value={details?.gpa || ''}
                        onChange={(e) => handleNestedChange(e, 'Student')}
                        disabled={!editing}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="modern-form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        name="company"
                        value={details?.company || ''}
                        onChange={(e) => handleNestedChange(e, 'Alumni')}
                        disabled={!editing}
                      />
                    </div>
                    <div className="modern-form-group">
                      <label>Role / Title</label>
                      <input
                        type="text"
                        name="role"
                        value={details?.role || ''}
                        onChange={(e) => handleNestedChange(e, 'Alumni')}
                        disabled={!editing}
                      />
                    </div>
                    <div className="modern-form-group">
                      <label>Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={details?.experience || ''}
                        onChange={(e) => handleNestedChange(e, 'Alumni')}
                        disabled={!editing}
                      />
                    </div>
                    <div className="modern-form-group">
                      <label>Graduation Year</label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={details?.graduationYear || ''}
                        onChange={(e) => handleNestedChange(e, 'Alumni')}
                        disabled={!editing}
                      />
                    </div>
                  </>
                )}
                
                <div className="modern-form-group full-width">
                  <label>Skills <small>(comma-separated)</small></label>
                  <input
                    type="text"
                    value={Array.isArray(details?.skills) ? details.skills.join(', ') : ''}
                    onChange={(e) => handleArrayChange('skills', e.target.value, isStudent ? 'Student' : 'Alumni')}
                    disabled={!editing}
                    placeholder="e.g. React, Node.js, Python"
                  />
                </div>
                
                {isStudent && (
                  <div className="modern-form-group full-width">
                    <label>Interests <small>(comma-separated)</small></label>
                    <input
                      type="text"
                      value={Array.isArray(details?.interests) ? details.interests.join(', ') : ''}
                      onChange={(e) => handleArrayChange('interests', e.target.value, 'Student')}
                      disabled={!editing}
                      placeholder="e.g. AI, Web Development, Networking"
                    />
                  </div>
                )}
                
                <div className="modern-form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={details?.bio || ''}
                    onChange={(e) => handleNestedChange(e, isStudent ? 'Student' : 'Alumni')}
                    disabled={!editing}
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
              </div>

              {/* Socials Section */}
              <div className="social-inputs">
                <div className="form-grid">
                  <div className="modern-form-group">
                    <label>LinkedIn URL</label>
                    <div className="input-with-icon">
                      <FaLinkedin />
                      <input
                        type="url"
                        name="linkedin"
                        value={details?.linkedin || ''}
                        onChange={(e) => handleNestedChange(e, isStudent ? 'Student' : 'Alumni')}
                        disabled={!editing}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  
                  <div className="modern-form-group">
                    <label>GitHub URL</label>
                    <div className="input-with-icon">
                      <FaGithub />
                      <input
                        type="url"
                        name="github"
                        value={details?.github || ''}
                        onChange={(e) => handleNestedChange(e, isStudent ? 'Student' : 'Alumni')}
                        disabled={!editing}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  {!isStudent && (
                    <div className="modern-form-group full-width">
                      <label>Personal Website / Portfolio</label>
                      <div className="input-with-icon">
                        <FaGlobe />
                        <input
                          type="url"
                          name="website"
                          value={details?.website || ''}
                          onChange={(e) => handleNestedChange(e, 'Alumni')}
                          disabled={!editing}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isStudent && (
                <div className="checkbox-wrap">
                  <input
                    type="checkbox"
                    id="isAvailableForMentorship"
                    name="isAvailableForMentorship"
                    checked={details?.isAvailableForMentorship || false}
                    onChange={(e) => handleNestedChange(e, 'Alumni')}
                    disabled={!editing}
                  />
                  <label htmlFor="isAvailableForMentorship">
                    I am available to mentor students
                  </label>
                </div>
              )}

              {editing && (
                <div className="action-bar">
                  <button type="button" onClick={cancelEdit} className="btn-cancel">
                    <FaTimes style={{ marginRight: '6px' }} /> Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    <FaCheck style={{ marginRight: '6px' }} /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile
