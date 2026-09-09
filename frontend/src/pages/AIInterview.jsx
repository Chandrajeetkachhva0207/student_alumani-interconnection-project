import React, { useState, useRef, useEffect, useContext } from 'react'
import { FaMicrophone, FaStop, FaRobot, FaUser } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'
import './AIInterview.css'

const AIInterview = () => {
  const { user } = useContext(AuthContext)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello ${user?.firstName || 'there'}! I'm your AI Interviewer. Please click the microphone button and introduce yourself when you're ready.` }
  ])
  
  const recognitionRef = useRef(null)
  const chatBottomRef = useRef(null)

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
    }
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition. Please use Google Chrome or Edge.");
      return;
    }

    let fullTranscript = '';

    recognitionRef.current.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      const finalString = fullTranscript.trim();
      if (finalString) {
        sendTextToBackend(finalString);
      } else {
        alert("No speech was detected. Please try again or speak louder.");
      }
    };

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop(); // This automatically triggers onend
    }
  }

  const sendTextToBackend = async (text) => {
    setIsLoading(true)
    
    try {
      const formattedHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
      
      const payload = {
        userText: text,
        history: formattedHistory
      }

      const response = await api.post('/ai/interview', payload)
      const { userText, aiText } = response.data

      setMessages(prev => [
        ...prev, 
        { role: 'user', content: userText },
        { role: 'assistant', content: aiText }
      ])

      // Speak back the AI Response
      speakText(aiText)

    } catch (err) {
      console.error("Error connecting to AI service:", err)
      alert(err.response?.data?.message || "An error occurred while analyzing the response.")
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = (text) => {
    if (!window.speechSynthesis) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    // Optional: pick a specific voice if available, else uses default
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || voices[0]
    if (englishVoice) {
      utterance.voice = englishVoice
    }
    
    utterance.rate = 1.0 // Normal speed
    utterance.pitch = 1.0
    
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="main-content">
      <div className="container ai-interview-container">
        
        <div className="interview-header glass-panel">
          <h1>AI Mock <span className="text-gradient">Interview</span></h1>
          <p>Practice your interview skills with real-time AI feedback.</p>
        </div>

        <div className="chat-box glass-panel">
          <div className="chat-history">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message message-${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                <div className={`avatar ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                  {msg.role === 'assistant' ? <FaRobot /> : <FaUser />}
                </div>
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
          
          {isLoading && (
            <div className="status-text">
              <div className="spinner-small"></div>
              <span>Analyzing response...</span>
            </div>
          )}

          <div className="chat-controls">
            {!isRecording ? (
              <button 
                className="record-btn" 
                onClick={startRecording}
                disabled={isLoading}
                title="Start Recording"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button 
                className={`record-btn recording`} 
                onClick={stopRecording}
                title="Stop Recording"
              >
                <FaStop />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AIInterview
