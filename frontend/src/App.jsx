import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Jobs from './pages/Jobs'
import Events from './pages/Events'
import Mentorships from './pages/Mentorships'
import Webinars from './pages/Webinars'
import Discussions from './pages/Discussions'
import AdminPanel from './pages/AdminPanel'
import AIInterview from './pages/AIInterview'
import LandingPage from './pages/LandingPage'
import ResumeBuilder from './pages/ResumeBuilder'
import AtsChecker from './pages/AtsChecker'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <Jobs />
                </PrivateRoute>
              }
            />
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <Events />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentorships"
              element={
                <PrivateRoute>
                  <Mentorships />
                </PrivateRoute>
              }
            />
            <Route
              path="/webinars"
              element={
                <PrivateRoute>
                  <Webinars />
                </PrivateRoute>
              }
            />
            <Route
              path="/discussions"
              element={
                <PrivateRoute>
                  <Discussions />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview-practice"
              element={
                <PrivateRoute>
                  <AIInterview />
                </PrivateRoute>
              }
            />
            <Route
              path="/resume-builder"
              element={
                <PrivateRoute>
                  <ResumeBuilder />
                </PrivateRoute>
              }
            />
            <Route
              path="/ats-checker"
              element={
                <PrivateRoute>
                  <AtsChecker />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
