import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaDownload, FaPlus, FaTrash, FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const { user } = useContext(AuthContext);

  // Resume State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  });

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [skills, setSkills] = useState('');

  // Pre-fill data from logged-in user
  useEffect(() => {
    if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        linkedin: user.Student?.linkedin || user.Alumni?.linkedin || '',
        github: user.Student?.github || user.Alumni?.github || '',
        summary: user.Student?.bio || user.Alumni?.bio || ''
      }));

      if (user.Student?.skills) {
        setSkills(Array.isArray(user.Student.skills) ? user.Student.skills.join(', ') : user.Student.skills);
      } else if (user.Alumni?.skills) {
        setSkills(Array.isArray(user.Alumni.skills) ? user.Alumni.skills.join(', ') : user.Alumni.skills);
      }

      if (user.Student && user.Student.major) {
        setEducation([{
          institution: 'My University',
          degree: user.Student.major,
          year: user.Student.year || '',
          gpa: user.Student.gpa || ''
        }]);
      }
      
      if (user.Alumni && user.Alumni.company) {
        setExperience([{
          company: user.Alumni.company,
          role: user.Alumni.role || '',
          duration: user.Alumni.graduationYear ? `Since ${user.Alumni.graduationYear}` : '',
          description: ''
        }]);
      }
    }
  }, [user]);

  // Handlers
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleArrayChange = (setter, index, field, value) => {
    setter(prev => {
      const newArray = [...prev];
      newArray[index] = { ...newArray[index], [field]: value };
      return newArray;
    });
  };

  const addItem = (setter, emptyItem) => {
    setter(prev => [...prev, emptyItem]);
  };

  const removeItem = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-builder-container">
      
      {/* LEFT PANEL - EDITOR (Hidden during print) */}
      <div className="resume-editor no-print">
        <h2>
          Resume Builder
          <button className="download-btn" onClick={handlePrint}>
            <FaDownload /> Download PDF
          </button>
        </h2>

        {/* Personal Info */}
        <div className="editor-section">
          <h3>Personal Information</h3>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Full Name</label>
            <input type="text" name="fullName" value={personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="John Doe" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="(123) 456-7890" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input type="text" name="linkedin" value={personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/johndoe" />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input type="text" name="github" value={personalInfo.github} onChange={handlePersonalInfoChange} placeholder="github.com/johndoe" />
            </div>
          </div>
          <div className="form-group">
            <label>Professional Summary</label>
            <textarea name="summary" value={personalInfo.summary} onChange={handlePersonalInfoChange} placeholder="A brief summary of your professional background..."></textarea>
          </div>
        </div>

        {/* Experience */}
        <div className="editor-section">
          <h3>Work Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="array-item-card">
              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" value={exp.company} onChange={(e) => handleArrayChange(setExperience, index, 'company', e.target.value)} placeholder="Google" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={exp.role} onChange={(e) => handleArrayChange(setExperience, index, 'role', e.target.value)} placeholder="Software Engineer" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Duration</label>
                <input type="text" value={exp.duration} onChange={(e) => handleArrayChange(setExperience, index, 'duration', e.target.value)} placeholder="Jan 2020 - Present" />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <textarea value={exp.description} onChange={(e) => handleArrayChange(setExperience, index, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..."></textarea>
              </div>
              <button className="remove-btn" onClick={() => removeItem(setExperience, index)}>
                <FaTrash /> Remove
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={() => addItem(setExperience, { company: '', role: '', duration: '', description: '' })}>
            <FaPlus /> Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="editor-section">
          <h3>Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="array-item-card">
              <div className="form-row">
                <div className="form-group">
                  <label>Institution</label>
                  <input type="text" value={edu.institution} onChange={(e) => handleArrayChange(setEducation, index, 'institution', e.target.value)} placeholder="University Name" />
                </div>
                <div className="form-group">
                  <label>Degree / Major</label>
                  <input type="text" value={edu.degree} onChange={(e) => handleArrayChange(setEducation, index, 'degree', e.target.value)} placeholder="B.S. Computer Science" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Year / Duration</label>
                  <input type="text" value={edu.year} onChange={(e) => handleArrayChange(setEducation, index, 'year', e.target.value)} placeholder="2018 - 2022" />
                </div>
                <div className="form-group">
                  <label>GPA (Optional)</label>
                  <input type="text" value={edu.gpa} onChange={(e) => handleArrayChange(setEducation, index, 'gpa', e.target.value)} placeholder="3.8" />
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeItem(setEducation, index)}>
                <FaTrash /> Remove
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={() => addItem(setEducation, { institution: '', degree: '', year: '', gpa: '' })}>
            <FaPlus /> Add Education
          </button>
        </div>

        {/* Skills */}
        <div className="editor-section">
          <h3>Skills</h3>
          <div className="form-group">
            <label>List your skills (comma separated)</label>
            <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="JavaScript, React, Node.js, Python, SQL..."></textarea>
          </div>
        </div>

        {/* Certifications */}
        <div className="editor-section">
          <h3>Certifications</h3>
          {certifications.map((cert, index) => (
            <div key={index} className="array-item-card">
              <div className="form-row">
                <div className="form-group">
                  <label>Certification Name</label>
                  <input type="text" value={cert.name} onChange={(e) => handleArrayChange(setCertifications, index, 'name', e.target.value)} placeholder="AWS Certified Solutions Architect" />
                </div>
                <div className="form-group">
                  <label>Issuer</label>
                  <input type="text" value={cert.issuer} onChange={(e) => handleArrayChange(setCertifications, index, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Date Earned</label>
                <input type="text" value={cert.date} onChange={(e) => handleArrayChange(setCertifications, index, 'date', e.target.value)} placeholder="Aug 2023" />
              </div>
              <button className="remove-btn" onClick={() => removeItem(setCertifications, index)}>
                <FaTrash /> Remove
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={() => addItem(setCertifications, { name: '', issuer: '', date: '' })}>
            <FaPlus /> Add Certification
          </button>
        </div>

        {/* Achievements */}
        <div className="editor-section">
          <h3>Achievements</h3>
          {achievements.map((achieve, index) => (
            <div key={index} className="array-item-card">
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Achievement Title</label>
                <input type="text" value={achieve.title} onChange={(e) => handleArrayChange(setAchievements, index, 'title', e.target.value)} placeholder="1st Place Hackathon" />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <textarea value={achieve.description} onChange={(e) => handleArrayChange(setAchievements, index, 'description', e.target.value)} placeholder="Briefly describe the achievement..."></textarea>
              </div>
              <button className="remove-btn" onClick={() => removeItem(setAchievements, index)}>
                <FaTrash /> Remove
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={() => addItem(setAchievements, { title: '', description: '' })}>
            <FaPlus /> Add Achievement
          </button>
        </div>

      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="resume-preview-container">
        <div className="resume-paper">
          
          {/* Header */}
          <h1>{personalInfo.fullName || 'Your Name'}</h1>
          <div className="contact-info">
            {personalInfo.email && <span className="contact-item"><FaEnvelope /> {personalInfo.email}</span>}
            {personalInfo.phone && <span className="contact-item"><FaPhone /> {personalInfo.phone}</span>}
            {personalInfo.linkedin && <span className="contact-item"><FaLinkedin /> {personalInfo.linkedin.replace('https://', '')}</span>}
            {personalInfo.github && <span className="contact-item"><FaGithub /> {personalInfo.github.replace('https://', '')}</span>}
            {personalInfo.website && <span className="contact-item"><FaGlobe /> {personalInfo.website.replace('https://', '')}</span>}
          </div>

          {/* Summary */}
          {personalInfo.summary && (
            <div className="resume-section">
              <div className="section-title">Professional Summary</div>
              <div className="summary-text">{personalInfo.summary}</div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Experience</div>
              {experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '10pt' }}>
                  <div className="item-header">
                    <span className="item-title">{exp.role || 'Role'} {exp.company && `at ${exp.company}`}</span>
                    <span className="item-date">{exp.duration}</span>
                  </div>
                  <div className="item-desc">{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Education</div>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '8pt' }}>
                  <div className="item-header">
                    <span className="item-title">{edu.institution || 'Institution'}</span>
                    <span className="item-date">{edu.year}</span>
                  </div>
                  <div className="item-subtitle">
                    {edu.degree} {edu.gpa && `| GPA: ${edu.gpa}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills && (
            <div className="resume-section">
              <div className="section-title">Skills</div>
              <div className="skills-list">
                {skills}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Certifications</div>
              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: '8pt' }}>
                  <div className="item-header">
                    <span className="item-title">{cert.name}</span>
                    <span className="item-date">{cert.date}</span>
                  </div>
                  <div className="item-subtitle">{cert.issuer}</div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="resume-section">
              <div className="section-title">Achievements</div>
              {achievements.map((achieve, index) => (
                <div key={index} style={{ marginBottom: '8pt' }}>
                  <div className="item-header">
                    <span className="item-title">{achieve.title}</span>
                  </div>
                  <div className="item-desc">{achieve.description}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
