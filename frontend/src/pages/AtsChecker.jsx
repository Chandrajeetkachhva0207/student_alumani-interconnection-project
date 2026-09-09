import React, { useState } from 'react';
import { FaFileAlt, FaBriefcase, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './AtsChecker.css';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
  'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
  'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some',
  'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would',
  'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'will',
  'experience', 'years', 'work', 'working', 'team', 'teams', 'skills', 'skill', 'ability', 'knowledge', 'required', 'preferred',
  'strong', 'good', 'excellent', 'fast', 'environment', 'building', 'build', 'using', 'used'
]);

const AtsChecker = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const extractKeywords = (text) => {
    // Convert to lowercase and replace punctuation with spaces
    const cleanText = text.toLowerCase().replace(/[^\w\s+#]/g, ' ');
    const words = cleanText.split(/\s+/).filter(w => w.length > 2);
    
    const wordCounts = {};
    words.forEach(word => {
      if (!STOP_WORDS.has(word) && isNaN(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    // Sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25) // Take top 25 keywords
      .map(entry => entry[0]);

    return sortedWords;
  };

  const analyze = () => {
    setIsAnalyzing(true);
    setResults(null);

    // Simulate analysis delay
    setTimeout(() => {
      const jobKeywords = extractKeywords(jobDescription);
      
      const cleanResume = resumeContent.toLowerCase().replace(/[^\w\s+#]/g, ' ');
      const resumeWords = new Set(cleanResume.split(/\s+/));

      const matching = [];
      const missing = [];

      jobKeywords.forEach(kw => {
        if (resumeWords.has(kw)) {
          matching.push(kw);
        } else {
          missing.push(kw);
        }
      });

      const score = jobKeywords.length === 0 ? 0 : Math.round((matching.length / jobKeywords.length) * 100);

      setResults({
        score,
        matching,
        missing
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="ats-checker-wrapper">
      <div className="container">
        
        <div className="ats-header">
          <h1>ATS Resume Checker</h1>
          <p>Optimize your resume for applicant tracking systems by comparing it to the job description.</p>
        </div>

        <div className="ats-inputs-container">
          <div className="ats-input-box">
            <h3><FaBriefcase /> Paste Job Description</h3>
            <textarea
              className="ats-textarea"
              placeholder="Paste the requirements, responsibilities, and qualifications from the job posting here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="ats-input-box">
            <h3><FaFileAlt /> Paste Resume Text</h3>
            <textarea
              className="ats-textarea"
              placeholder="Paste the full text of your resume here..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="analyze-btn-container">
          <button 
            className="btn-analyze" 
            onClick={analyze}
            disabled={!jobDescription.trim() || !resumeContent.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>Analyzing Text... <div className="btn-spinner" style={{width: '20px', height: '20px', marginLeft: '10px'}}></div></>
            ) : (
              <><FaSearch /> Analyze Match</>
            )}
          </button>
        </div>

        {results && (
          <div className="ats-results-container">
            <div className="glass-panel score-card">
              <div className="score-circle" style={{ '--score-deg': `${(results.score / 100) * 360}deg` }}>
                {results.score}%
              </div>
              <div className="score-label">Match Score</div>
              <p style={{ marginTop: '15px', color: '#718096' }}>
                {results.score >= 80 ? 'Great job! Your resume is highly optimized for this role.' : 
                 results.score >= 50 ? 'Good start, but adding some of the missing keywords will improve your chances.' : 
                 'Your resume is missing many key terms. Consider tailoring it more specifically to this job description.'}
              </p>
            </div>

            <div className="keywords-grid">
              <div className="glass-panel keywords-card matching">
                <h4><FaCheckCircle /> Matching Keywords ({results.matching.length})</h4>
                <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#4a5568'}}>
                  These important terms from the job description were found in your resume.
                </p>
                <div className="tag-cloud">
                  {results.matching.length === 0 && <span>No matching keywords found.</span>}
                  {results.matching.map(kw => (
                    <span key={kw} className="tag match">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="glass-panel keywords-card missing">
                <h4><FaTimesCircle /> Missing Keywords ({results.missing.length})</h4>
                <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#4a5568'}}>
                  These important terms are in the job description but missing from your resume. Consider adding them!
                </p>
                <div className="tag-cloud">
                  {results.missing.length === 0 && <span>Perfect! No missing keywords.</span>}
                  {results.missing.map(kw => (
                    <span key={kw} className="tag miss">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AtsChecker;
