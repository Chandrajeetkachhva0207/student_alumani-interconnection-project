import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import { FaSearch, FaEnvelope, FaGraduationCap, FaBriefcase, FaUserPlus } from 'react-icons/fa'
import './Search.css'

const Search = () => {
  const { user } = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchTerm || roleFilter) {
      const delayDebounceFn = setTimeout(() => {
        searchUsers()
      }, 300)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setUsers([])
    }
  }, [searchTerm, roleFilter])

  const searchUsers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchTerm) params.q = searchTerm
      if (roleFilter) params.role = roleFilter

      const response = await api.get('/users/search', { params })
      setUsers(response.data)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (userId) => {
    try {
      await api.post(`/users/${userId}/connect`)
      alert('Connection request sent!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending connection request')
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <div className="main-content search-wrapper">
      <div className="container">
        <div className="search-header">
          <h1>Network Search</h1>
          <p>Find and connect with fellow students and distinguished alumni</p>
        </div>

        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Searching network...</p>
          </div>
        ) : (
          <>
            {users.length > 0 ? (
              <div className="users-grid">
                {users.map((userItem) => (
                  <div key={userItem.id} className="user-card">
                    <div className="user-card-header">
                      <div className="user-avatar">
                        {getInitials(userItem.firstName, userItem.lastName)}
                      </div>
                      <div className="user-info">
                        <h3>{userItem.firstName} {userItem.lastName}</h3>
                        <span className={`user-role-badge badge-${userItem.role}`}>
                          {userItem.role}
                        </span>
                      </div>
                    </div>

                    <div className="user-details">
                      <div className="user-detail-row">
                        <FaEnvelope className="user-detail-icon" />
                        <span>{userItem.email}</span>
                      </div>

                      {userItem.role === 'student' && userItem.Student && (
                        <>
                          <div className="user-detail-row">
                            <FaGraduationCap className="user-detail-icon" />
                            <span>{userItem.Student.major || 'Major not specified'}</span>
                          </div>
                          {(userItem.Student.skills && userItem.Student.skills.length > 0) && (
                            <div className="user-detail-row" style={{ fontSize: '0.85rem' }}>
                              <span><strong>Skills:</strong> {userItem.Student.skills.join(', ')}</span>
                            </div>
                          )}
                        </>
                      )}

                      {userItem.role === 'alumni' && userItem.Alumni && (
                        <>
                          <div className="user-detail-row">
                            <FaBriefcase className="user-detail-icon" />
                            <span>
                              {userItem.Alumni.role ? `${userItem.Alumni.role} ` : 'Professional '}
                              {userItem.Alumni.company ? `at ${userItem.Alumni.company}` : ''}
                            </span>
                          </div>
                          {(userItem.Alumni.skills && userItem.Alumni.skills.length > 0) && (
                            <div className="user-detail-row" style={{ fontSize: '0.85rem' }}>
                              <span><strong>Skills:</strong> {userItem.Alumni.skills.join(', ')}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {userItem.id !== user.id && (
                      <button
                        onClick={() => handleConnect(userItem.id)}
                        className="btn-connect"
                      >
                        <FaUserPlus /> Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              (searchTerm || roleFilter) && (
                <div className="no-results">
                  <FaSearch style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '15px' }} />
                  <h3>No users found</h3>
                  <p>Try adjusting your search terms or filters to find more connections.</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Search
