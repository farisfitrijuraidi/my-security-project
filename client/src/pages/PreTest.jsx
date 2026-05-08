import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function PreTest() {
  const navigate = useNavigate();
  
  // State to control which screen the user sees
  const [hasStarted, setHasStarted] = useState(false);
  const [hasConsented, setHasConsented] = useState(false); 
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The shuffling algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // The 9 Pre-Test Questions (Without the A/B/C/D labels)
  const rawQuestions = [
    {
      id: 1,
      text: "What is the primary cause of an Insecure Direct Object Reference (IDOR) vulnerability?",
      options: [
        { label: "The server uses predictable, sequential numbers for database records instead of random strings.", value: "A" },
        { label: "A web application fails to verify if a user has permission to access a specific record.", value: "B", isCorrect: true },
        { label: "The browser stores sensitive session tokens in local storage where attackers can read them.", value: "C" },
        { label: "The backend database fails to encrypt user identifiers before sending them to the client.", value: "D" }
      ]
    },
    {
      id: 2,
      text: "What makes a NoSQL database, like MongoDB, vulnerable to injection attacks if the developer does not secure the inputs?",
      options: [
        { label: "It relies on unstructured data schemas, meaning it cannot validate the length of user inputs.", value: "A" },
        { label: "It processes search queries as complex data objects instead of just reading them as plain text.", value: "B", isCorrect: true },
        { label: "It uses JavaScript as its native query language, allowing malicious scripts to run directly on the server.", value: "C" },
        { label: "It fails to sanitise HTML tags from the search parameters before saving them to the collection.", value: "D" }
      ]
    },
    {
      id: 3,
      text: "What makes a 'Stored' Cross-Site Scripting (XSS) attack so dangerous compared to other types of web vulnerabilities?",
      options: [
        { label: "The malicious script is permanently saved in the application's database and waits for any user to view it.", value: "A", isCorrect: true },
        { label: "The script intercepts the user's network traffic before it reaches the secure HTTPS connection.", value: "B" },
        { label: "The attacker forces the victim's browser to execute a malicious file download without their consent.", value: "C" },
        { label: "The payload executes directly on the backend server to modify database records.", value: "D" }
      ]
    },
    {
      id: 4,
      text: "You log into a student portal, and your profile page URL looks like this: portal.edu/profile/812. You manually change the URL to portal.edu/profile/813 and hit enter. The screen suddenly displays the private grades of another student. What security failure allowed this to happen?",
      options: [
        { label: "The web application uses insecure URL parameters instead of hiding the data in a POST request.", value: "A" },
        { label: "The server's session cookies are not configured with the secure HttpOnly flag.", value: "B" },
        { label: "The backend trusts the user's input without checking their authorisation level.", value: "C", isCorrect: true },
        { label: "The database allows unauthenticated access to the student profile collection.", value: "D" }
      ]
    },
    {
      id: 5,
      text: "You are testing a school directory search bar. Instead of typing a name, you paste the object {\"$ne\": \"\"} into the box and hit search. The system suddenly returns a massive list of every single student in the database. Why did this happen?",
      options: [
        { label: "The $ne operator bypassed the frontend JavaScript validation checks before reaching the server.", value: "A" },
        { label: "The application evaluated your input as a logic puzzle meaning 'find everything not equal to blank' instead of searching for those exact characters.", value: "B", isCorrect: true },
        { label: "The MongoDB engine failed to properly escape the double quotes inside the JSON string.", value: "C" },
        { label: "The application used a weak hashing algorithm to compare the search string against the database index.", value: "D" }
      ]
    },
    {
      id: 6,
      text: "Hacker Bob types <img src=\"x\" onerror=\"alert('XSS attack triggered by Bob!')\"> into his profile bio and saves it. Later, Admin Alice views Bob's profile, and her browser instantly runs the code. Why did Alice's browser execute Bob's script?",
      options: [
        { label: "Alice's browser failed to block the cross-origin request initiated by the image tag.", value: "A" },
        { label: "The web application pulled Bob's bio from the database and rendered it as executable HTML instead of plain text.", value: "B", isCorrect: true },
        { label: "The server's Content Security Policy (CSP) allowed inline scripts to execute within the profile page.", value: "C" },
        { label: "The backend server executed the JavaScript code while preparing Alice's profile view.", value: "D" }
      ]
    },
    {
      id: 7,
      text: "As a backend developer, what is the most secure way to prevent an IDOR vulnerability when a user requests to view a private profile?",
      options: [
        { label: "Obfuscate the user's database ID in the URL using a strong cryptographic hash.", value: "A" },
        { label: "Compare the requested profile ID against the user's secure session token, which acts as their digital ID card.", value: "B", isCorrect: true },
        { label: "Ensure the server strictly filters out any mathematical operators or special characters from the URL request.", value: "C" },
        { label: "Change the application to use POST requests instead of GET requests when fetching profile data.", value: "D" }
      ]
    },
    {
      id: 8,
      text: "As a backend developer, what is the most effective and secure way to stop a NoSQL injection attack from bypassing your search filters?",
      options: [
        { label: "Use parameterized queries to ensure the database engine compiles the statement before adding user input.", value: "A" },
        { label: "Configure the MongoDB server to reject any queries containing the $ or {} characters.", value: "B" },
        { label: "Implement strict type checking in your code to ensure the user's input is strictly a plain text string, and reject any objects.", value: "C", isCorrect: true },
        { label: "Implement a Web Application Firewall (WAF) to inspect and block malicious JSON payloads.", value: "D" }
      ]
    },
    {
      id: 9,
      text: "In a modern frontend framework like React, what is the safest way to display user-submitted text on the screen to prevent XSS?",
      options: [
        { label: "Use the dangerouslySetInnerHTML command, but only after passing the input through a custom regex filter.", value: "A" },
        { label: "Rely on React's default text rendering (like <p>{user.bio}</p>), which automatically converts dangerous code into harmless text.", value: "B", isCorrect: true },
        { label: "Install a third-party library to encrypt user comments in the database before they are sent to the frontend.", value: "C" },
        { label: "Ensure the backend API strips out all HTML tags before saving the profile data to MongoDB.", value: "D" }
      ]
    },
    {
      id: 10,
      text: "Look at this Express.js route used to delete a private message. Which code snippet is the most secure way to prevent an IDOR attack?",
      options: [
        { label: "if (req.params.messageId) { deleteMessage(req.params.messageId); }", value: "A" },
        { label: "if (req.user.isLoggedIn === true) { deleteMessage(req.params.messageId); }", value: "B" },
        { label: "if (message.ownerId === req.user.id || req.user.role === 'admin') { deleteMessage(req.params.messageId); }", value: "C", isCorrect: true },
        { label: "if (req.headers['referer'] === 'https://ourwebsite.com') { deleteMessage(req.params.messageId); }", value: "D" }
      ]
    },
    {
      id: 11,
      text: "You are writing a backend search function. A user submits a search term via req.body.searchTerm. Which Mongoose database query safely prevents a NoSQL object injection?",
      options: [
        { label: "User.find({ username: req.body.searchTerm })", value: "A" },
        { label: "User.find({ username: JSON.stringify(req.body.searchTerm) })", value: "B" },
        { label: "User.find({ username: String(req.body.searchTerm) })", value: "C", isCorrect: true },
        { label: "User.find({ username: { $eq: req.body.searchTerm } })", value: "D" }
      ]
    },
    {
      id: 12,
      text: "You are building a React component to display a user's profile description. Which rendering method is the safest way to prevent a Stored XSS attack?",
      options: [
        { label: "<div dangerouslySetInnerHTML={{ __html: user.description }} />", value: "A" },
        { label: "<div>{eval(user.description)}</div>", value: "B" },
        { label: "<div>{user.description}</div>", value: "C", isCorrect: true },
        { label: "<div><script>{user.description}</script></div>", value: "D" }
      ]
    }
  ];

  // We use useMemo here to shuffle everything ONLY ONCE when the component mounts
  const randomisedQuestions = useMemo(() => {
    const shuffledQuestions = shuffleArray(rawQuestions);
    return shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  }, []);

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

      const response = await fetch('http://localhost:5000/api/users/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentName,
          testType: 'pre-test',
          score: finalScore
        }),
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert("There was an error saving your test. Please tell the researcher.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Network error. Is your backend running?");
      setIsSubmitting(false);
    }
  };

  // View 1: The Welcome Screen with Consent
  if (!hasStarted) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h1 style={{ color: '#004085', marginTop: '0' }}>Welcome to the Security Experiment</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
          Thank you for participating in this research study. Before you begin the interactive hacking labs, we need to establish a baseline of your current knowledge.
        </p>
        
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', marginTop: '20px', borderLeft: '5px solid #004085' }}>
          <h3 style={{ marginTop: '0' }}>Important Information:</h3>
          <ul style={{ lineHeight: '1.8', margin: '0', paddingLeft: '20px' }}>
            <li><strong>This is not an exam.</strong> We are testing the effectiveness of the platform, not your personal skills.</li>
            <li>Your results are completely anonymous and linked only to your generic participant ID.</li>
            <li>Please answer the following 9 questions to the best of your ability.</li>
            <li>Do not use external search engines (like Google) during this test.</li>
          </ul>
        </div>

        {/* The Digital Consent Checkbox */}
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px', display: 'flex', alignItems: 'flex-start' }}>
          <input 
            type="checkbox" 
            id="consent-box"
            checked={hasConsented}
            onChange={(e) => setHasConsented(e.target.checked)}
            style={{ marginTop: '5px', marginRight: '15px', width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="consent-box" style={{ fontSize: '16px', lineHeight: '1.5', cursor: 'pointer', userSelect: 'none' }}>
            <strong>Informed Consent:</strong> I have read the information above. I understand the purpose of this study and I voluntarily consent to my anonymous test scores being recorded and used for academic research purposes.
          </label>
        </div>

        {/* The Dynamic Start Button */}
        <button 
          onClick={() => setHasStarted(true)}
          disabled={!hasConsented}
          style={{ 
            padding: '15px 25px', 
            backgroundColor: hasConsented ? '#28a745' : '#6c757d', // Green if ticked, grey if not
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            cursor: hasConsented ? 'pointer' : 'not-allowed', 
            marginTop: '25px', 
            width: '100%',
            transition: 'background-color 0.3s'
          }}
        >
          {hasConsented ? 'I Consent, Start Pre-Test' : 'Please tick the consent box to begin'}
        </button>
      </div>
    );
  }

  // View 2: The Actual Quiz
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #004085', paddingBottom: '10px' }}>Pre-Test Assessment</h2>
      <p style={{ marginBottom: '30px', color: '#555' }}>Please select the best answer for each question.</p>

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
          style={{ padding: '15px 30px', backgroundColor: '#004085', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', width: '100%', marginBottom: '40px' }}
        >
          {isSubmitting ? 'Saving Results...' : 'Submit Pre-Test and Go To Dashboard'}
        </button>
      </form>
    </div>
  );
}

export default PreTest;