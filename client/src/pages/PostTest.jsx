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

  // The 12 Post-Test Questions
  const rawQuestions = [
    {
      id: 1,
      text: "Why is changing a number in a web address sometimes enough to let a user view someone else's private account?",
      options: [
        { label: "The web server's routing configuration lacks a Cross-Origin Resource Sharing (CORS) policy.", value: "A" },
        { label: "The server successfully finds the record but fails to check if the current user is authorised to see it.", value: "B", isCorrect: true },
        { label: "The application uses sequential integers instead of securely hashing the database schema.", value: "C" },
        { label: "The browser automatically bypasses the frontend authentication guard when the URL changes directly.", value: "D" }
      ]
    },
    {
      id: 2,
      text: "You are looking at a digital receipt for a book you bought online. The web address is store.com/receipt?order=500. You change the number to 501 and suddenly see the receipt of a stranger who bought a laptop. What kind of vulnerability did you just exploit?",
      options: [
        { label: "Server-Side Request Forgery (SSRF)", value: "A" },
        { label: "Insecure Direct Object Reference (IDOR)", value: "B", isCorrect: true },
        { label: "Broken Authentication", value: "C" },
        { label: "Vertical Privilege Escalation", value: "D" }
      ]
    },
    {
      id: 3,
      text: "You are a developer fixing an IDOR vulnerability on a social media site. What is the most effective way to stop users from viewing private messages by changing the message ID in the URL?",
      options: [
        { label: "Use a backend check to ensure the requested message belongs to the user making the request.", value: "A", isCorrect: true },
        { label: "Change the sequential IDs to Universally Unique Identifiers (UUIDs) so they cannot be guessed.", value: "B" },
        { label: "Encrypt the URL parameters using AES-256 before sending them to the client browser.", value: "C" },
        { label: "Implement a strict Cross-Site Request Forgery (CSRF) token on all GET requests.", value: "D" }
      ]
    },
    {
      id: 4,
      text: "What is the primary difference between a standard text search and a NoSQL injection attack?",
      options: [
        { label: "A standard search looks for words, while an injection attack sends mathematical logic or operators for the database to execute.", value: "A", isCorrect: true },
        { label: "A standard search uses GET requests, while NoSQL injection relies entirely on manipulating POST request bodies.", value: "B" },
        { label: "An injection attack specifically targets the browser's local storage instead of the backend server logic.", value: "C" },
        { label: "A standard search parses JSON data, while an injection attack exploits XML External Entities (XXE).", value: "D" }
      ]
    },
    {
      id: 5,
      text: "A hacker tries to log into an admin panel. Instead of guessing the password, they intercept the login request and send the object {\"$gt\": \"\"} (greater than nothing) in the password field. The server logs them in. Why did this work?",
      options: [
        { label: "The backend parsed the payload as a hashed password collision, bypassing the encryption.", value: "A" },
        { label: "The NoSQL database evaluated the logic and confirmed that the real password is indeed 'greater than' nothing, resulting in a true statement.", value: "B", isCorrect: true },
        { label: "The MongoDB engine failed to sanitise the Cross-Site Request Forgery (CSRF) token attached to the payload.", value: "C" },
        { label: "The $gt operator triggered a buffer overflow in the authentication controller, forcing it open.", value: "D" }
      ]
    },
    {
      id: 6,
      text: "What is the most robust way to defend a MongoDB search bar against NoSQL injection?",
      options: [
        { label: "Wrap all database queries inside a try-catch block to silently ignore malformed requests.", value: "A" },
        { label: "Ensure the backend code strictly checks the data type and forces all search inputs to be plain text strings.", value: "B", isCorrect: true },
        { label: "Implement client-side JavaScript validation to block special characters before submission.", value: "C" },
        { label: "Use a Base64 encoding function on all user input before saving it to the database collection.", value: "D" }
      ]
    },
    {
      id: 7,
      text: "Which statement best describes how a Stored XSS vulnerability functions?",
      options: [
        { label: "An attacker intercepts network traffic between the client and server to inject malicious HTML into the data packets.", value: "A" },
        { label: "An attacker injects a malicious script into a database, and the server later delivers that script to the browsers of innocent users.", value: "B", isCorrect: true },
        { label: "A user clicks a crafted link that immediately reflects a malicious script back into their own browser without saving it to the server.", value: "C" },
        { label: "The application securely stores a script, but the backend database accidentally executes it internally during a query.", value: "D" }
      ]
    },
    {
      id: 8,
      text: "A hacker posts a comment on a public school forum. The comment contains a hidden script. When the school principal opens the forum to read the comments, her browser suddenly sends her session cookie to the hacker. What vulnerability allowed this?",
      options: [
        { label: "Stored XSS", value: "A", isCorrect: true },
        { label: "Reflected XSS", value: "B" },
        { label: "Cross-Site Request Forgery (CSRF)", value: "C" },
        { label: "Session Fixation", value: "D" }
      ]
    },
    {
      id: 9,
      text: "If you are building a React website and want to safely display user comments without risking an XSS attack, what is the best practice?",
      options: [
        { label: "Use the dangerouslySetInnerHTML command, but only after passing the input through a custom Regex filter.", value: "A" },
        { label: "Rely on React's default text rendering, which automatically turns script tags into harmless text on the screen.", value: "B", isCorrect: true },
        { label: "Use a regular expression to manually remove all < and > characters in the frontend component before rendering.", value: "C" },
        { label: "Store the comments in a secure HttpOnly cookie instead of the component's state variables.", value: "D" }
      ]
    },
    {
      id: 10,
      text: "You are writing an API endpoint to update a user's financial details. Which authorisation check successfully prevents horizontal privilege escalation (IDOR)?",
      options: [
        { label: "if (req.body.accountId !== null) { updateAccount(); }", value: "A" },
        { label: "if (req.session.userId === req.params.accountId) { updateAccount(); }", value: "B", isCorrect: true },
        { label: "if (req.cookies['auth_token']) { updateAccount(); }", value: "C" },
        { label: "if (typeof req.params.accountId === 'string') { updateAccount(); }", value: "D" }
      ]
    },
    {
      id: 11,
      text: 'A user is trying to log in. You need to find their account in the database using req.body.email. Which code safely stops an attacker from bypassing the login using a {"$gt": ""} payload?',
      options: [
        { label: "const query = { email: req.body.email }; db.collection('users').findOne(query);", value: "A" },
        { label: "const query = { email: req.body.email.toString() }; db.collection('users').findOne(query);", value: "B", isCorrect: true },
        { label: "const query = { email: encodeURI(req.body.email) }; db.collection('users').findOne(query);", value: "C" },
        { label: "const query = { email: { $regex: req.body.email } }; db.collection('users').findOne(query);", value: "D" }
      ]
    },
    {
      id: 12,
      text: "A hacker manages to save the string <img src=\"x\" onerror=\"alert('Hacked!')\"> into your database as a blog comment. How should your React frontend render this comment so it appears harmlessly as plain text?",
      options: [
        { label: "<p dangerouslySetInnerHTML={{ __html: comment }}></p>", value: "A" },
        { label: "<p>{comment}</p>", value: "B", isCorrect: true },
        { label: "<p>{comment.replace('<', '')}</p>", value: "C" },
        { label: "<p>{window.atob(comment)}</p>", value: "D" }
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

      // 3. NUCLEAR WIPE: Clear all local storage (tokens, usernames, and all lab tutorial steps)
      localStorage.clear();
      
      // 4. Kick them to the login screen
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