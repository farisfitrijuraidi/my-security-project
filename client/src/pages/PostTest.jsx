import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function PostTest() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A standard algorithm to randomly shuffle any list
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // The 9 Post-Test Questions
  const rawQuestions = [
    {
      id: 1,
      text: "Why is changing a number in a web address sometimes enough to let a user view someone else's private account?",
      options: [
        { label: "The website stores all user data in a single, unencrypted file.", value: "A" },
        { label: "The server successfully finds the record but fails to check if the current user is authorised to see it.", value: "B", isCorrect: true },
        { label: "The browser automatically guesses the administrator password when the URL changes.", value: "C" },
        { label: "The user's computer accidentally intercepts network traffic from another student.", value: "D" }
      ]
    },
    {
      id: 2,
      text: "You are looking at a digital receipt for a book you bought online. The web address is store.com/receipt?order=500. You change the number to 501 and suddenly see the receipt of a stranger who bought a laptop. What kind of vulnerability did you just exploit?",
      options: [
        { label: "Cross-Site Scripting (XSS)", value: "A" },
        { label: "Insecure Direct Object Reference (IDOR)", value: "B", isCorrect: true },
        { label: "NoSQL Database Injection", value: "C" },
        { label: "A Denial of Service (DoS) attack", value: "D" }
      ]
    },
    {
      id: 3,
      text: "You are a developer fixing an IDOR vulnerability on a social media site. What is the most effective way to stop users from viewing private messages by changing the message ID in the URL?",
      options: [
        { label: "Use a backend check to ensure the requested message belongs to the user making the request.", value: "A", isCorrect: true },
        { label: "Make the message IDs longer so they are harder to guess.", value: "B" },
        { label: "Block users from typing numbers into their web browser address bar.", value: "C" },
        { label: "Add a warning banner telling users it is illegal to view other people's messages.", value: "D" }
      ]
    },
    {
      id: 4,
      text: "What is the primary difference between a standard text search and a NoSQL injection attack?",
      options: [
        { label: "A standard search looks for words, while an injection attack sends mathematical logic or operators for the database to execute.", value: "A", isCorrect: true },
        { label: "A standard search is very fast, while an injection attack slows down the server until it crashes.", value: "B" },
        { label: "A standard search requires a password, while an injection attack bypasses the login screen completely.", value: "C" },
        { label: "There is no difference. Both methods simply read text files on the server.", value: "D" }
      ]
    },
    {
      id: 5,
      text: "A hacker tries to log into an admin panel. Instead of guessing the password, they intercept the login request and send the object {\"$gt\": \"\"} (greater than nothing) in the password field. The server logs them in. Why did this work?",
      options: [
        { label: "The server had a default password set to a blank space.", value: "A" },
        { label: "The NoSQL database evaluated the logic and confirmed that the real password is indeed 'greater than' nothing, resulting in a true statement.", value: "B", isCorrect: true },
        { label: "The hacker overloaded the database with too many requests, forcing it to open.", value: "C" },
        { label: "The $gt command is a secret developer backdoor built into all modern databases.", value: "D" }
      ]
    },
    {
      id: 6,
      text: "What is the most robust way to defend a MongoDB search bar against NoSQL injection?",
      options: [
        { label: "Purchase an expensive firewall to block all traffic from unknown countries.", value: "A" },
        { label: "Ensure the backend code strictly checks the data type and forces all search inputs to be plain text strings.", value: "B", isCorrect: true },
        { label: "Delete all administrator accounts so hackers have nothing to target.", value: "C" },
        { label: "Convert the NoSQL database into a series of Excel spreadsheets.", value: "D" }
      ]
    },
    {
      id: 7,
      text: "Which statement best describes how a Stored XSS vulnerability functions?",
      options: [
        { label: "A hacker breaks into a server room and physically steals the hard drives containing user data.", value: "A" },
        { label: "An attacker injects a malicious script into a database, and the server later delivers that script to the browsers of innocent users.", value: "B", isCorrect: true },
        { label: "A user accidentally clicks a malicious link in a phishing email that downloads a virus.", value: "C" },
        { label: "The web server forgets to encrypt user passwords before saving them.", value: "D" }
      ]
    },
    {
      id: 8,
      text: "A hacker posts a comment on a public school forum. The comment contains a hidden script. When the school principal opens the forum to read the comments, her browser suddenly sends her session cookie to the hacker. What vulnerability allowed this?",
      options: [
        { label: "Stored XSS", value: "A", isCorrect: true },
        { label: "IDOR", value: "B" },
        { label: "NoSQL Injection", value: "C" },
        { label: "Ransomware", value: "D" }
      ]
    },
    {
      id: 9,
      text: "If you are building a React website and want to safely display user comments without risking an XSS attack, what is the best practice?",
      options: [
        { label: "Use the dangerouslySetInnerHTML command to ensure comments render quickly.", value: "A" },
        { label: "Rely on React's default text rendering, which automatically turns script tags into harmless text on the screen.", value: "B", isCorrect: true },
        { label: "Manually read every single comment in the database before allowing it to appear on the website.", value: "C" },
        { label: "Only allow users to post comments that contain numbers.", value: "D" }
      ]
    }
  ];

  // We use useMemo here to shuffle everything ONLY ONCE when the page first opens
  const randomisedQuestions = useMemo(() => {
    const shuffledQuestions = shuffleArray(rawQuestions);
    // Go through each question and shuffle its options too
    return shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  }, []); // The empty brackets mean "never run this again after the first load"

  const handleSelect = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(answers).length < randomisedQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);

    let finalScore = 0;
    randomisedQuestions.forEach(q => {
      const selectedOption = q.options.find(opt => opt.value === answers[q.id]);
      if (selectedOption && selectedOption.isCorrect) {
        finalScore += 1;
      }
    });

    try {
      const currentName = localStorage.getItem('username') || 'Unknown Participant';

      // 1. Save the test score
      const testResponse = await fetch('http://localhost:5000/api/users/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentName,
          testType: 'post-test',
          score: finalScore
        }),
      });

      if (!testResponse.ok) throw new Error('Failed to save test');

      // 2. Scrub the database clean for the next participant
      await fetch('http://localhost:5000/api/users/reset-labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      // 3. Clear local storage and kick them to the login screen
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');

    } catch (error) {
      console.error("Submission sequence failed", error);
      alert("There was an error saving your data or resetting the labs.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #004085', paddingBottom: '10px' }}>Post-Test Assessment</h2>
      <p style={{ marginBottom: '30px', color: '#555' }}>
        You have completed the labs! Please select the best answer for each question to finish the experiment.
      </p>

      <form onSubmit={handleSubmit}>
        {randomisedQuestions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            <h4 style={{ marginTop: '0', fontSize: '16px', lineHeight: '1.5' }}>{index + 1}. {q.text}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              {q.options.map((opt) => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name={`question-${q.id}`} 
                    value={opt.value}
                    onChange={() => handleSelect(q.id, opt.value)}
                    checked={answers[q.id] === opt.value}
                    style={{ marginTop: '4px', marginRight: '10px' }}
                  />
                  <span style={{ fontSize: '15px' }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ padding: '15px 30px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '40px' }}
        >
          {isSubmitting ? 'Finalising Experiment...' : 'Submit Final Test & Logout'}
        </button>
      </form>
    </div>
  );
}

export default PostTest;