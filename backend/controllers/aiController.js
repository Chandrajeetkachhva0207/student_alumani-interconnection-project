// Free Demo Simulator Controller
// This handles the interview dynamically without needing OpenAI/Whisper

const INTERVIEW_QUESTIONS = [
  "That sounds like a great start. Can you tell me about a time you overcame a challenging bug in your code?",
  "Very interesting. What would you say is your biggest technical weakness?",
  "I see. Could you explain the difference between a REST API and GraphQL to me?",
  "Got it. How do you handle working under tight deadlines?",
  "Thanks for sharing. Where do you see your career in 5 years?",
  "Excellent answers. Do you have any questions for me before we wrap up?",
  "Thank you for your time today! We will contact you soon with the results of this mock interview."
];

exports.processInterviewTurn = async (req, res) => {
  const { userText, history } = req.body;

  if (!userText) {
    return res.status(400).json({ message: 'No user text provided' });
  }

  try {
    // We determine the next question based on how many user turns have happened.
    // Each history array has {role: 'assistant', content: ...} and {role: 'user', content: ...}
    // We basically count how many user messages are in the history to pick the next index.
    const userMessageCount = history.filter(msg => msg.role === 'user').length;
    
    // Get the next indexed question, or default to the last one if we hit the limit
    const nextQuestionIndex = Math.min(userMessageCount, INTERVIEW_QUESTIONS.length - 1);
    const aiText = INTERVIEW_QUESTIONS[nextQuestionIndex];

    res.json({ userText, aiText });
  } catch (error) {
    console.error('Mock AI Interview error:', error);
    res.status(500).json({ message: 'Failed to process interview turn.', error: error.message });
  }
};
