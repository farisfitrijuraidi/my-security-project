import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PreTest() {
  const navigate = useNavigate();
  
  // State to control which screen the user sees
  const [hasStarted, setHasStarted] = useState(false);
  
  // State to store the user's selected answers
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The 9 Pre-Test Questions we drafted (Randomised order is best practice)
  const questions = [
    {
      id: 1,
      text: "What is the primary cause of an Insecure Direct Object Reference (IDOR) vulnerability?",
      options: [
        { label: "A) An attacker overloads the server with too much traffic to crash it.", value: "A" },
        { label: "B) A web application fails to verify if a user has permission to access a specific record.", value: "B", isCorrect: true },
        { label: "C) A user accidentally downloads a malicious file hidden in an email attachment.", value: "C" },
        { label: "D) An application allows attackers to run malicious database queries.", value: "D" }
      ]
    },
    {
      id: 2,
      text: "What makes a NoSQL database, like MongoDB, vulnerable to injection attacks if the developer does not secure the inputs?",
      options: [
        { label: "A) It allows anyone on the internet to log in without needing an administrator password.", value: "A" },
        { label: "B) It processes search queries as complex data objects instead of just reading them as plain text.", value: "B", isCorrect: true },
        { label: "C) It stores all sensitive user information in plain text by default.", value: "C" },
        { label: "D) It automatically crashes and reveals data whenever a user types a special character.", value: "D" }
      ]
    },
    {
      id: 3,
      text: "What makes a 'Stored' Cross-Site Scripting (XSS) attack so dangerous compared to other types of web vulnerabilities?",
      options: [
        { label: "A) The malicious script is permanently saved in the application's database and waits for any user to view it.", value: "A", isCorrect: true },
        { label: "B) It forces the web server to shut down completely by sending too many requests.", value: "B" },
        { label: "C) It requires the victim to accidentally download a file directly to their computer.", value: "C" },
        { label: "D) The attack only works if the hacker has physical access to the server room.", value: "D" }
      ]
    },
    {
      id: 4,
      text: "You log into a student portal, and your profile page URL looks like this: portal.edu/profile/812. You manually change the URL to portal.edu/profile/813 and hit enter. The screen suddenly displays the private grades of another student. What security failure allowed this to happen?",
      options: [
        { label: "A) The website is not using a secure HTTPS connection.", value: "A" },
        { label: "B) The database passwords are not properly encrypted.", value: "B" },
        { label: "C) The backend trusts the user's input without checking their authorisation level.", value: "C", isCorrect: true },
        { label: "D) The user interface failed to sanitise a malicious script.", value: "D" }
      ]
    },
    {
      id: 5,
      text: "You are testing a school directory search bar. Instead of typing a name, you paste the object {\"$ne\": \"\"} into the box and hit search. The system suddenly returns a massive list of every single student in the database. Why did this happen?",
      options: [
        { label: "A) The search bar has a hidden administrator feature that shows all users when it gets confused.", value: "A" },
        { label: "B) The application evaluated your input as a logic puzzle meaning 'find everything not equal to blank' instead of searching for those exact characters.", value: "B", isCorrect: true },
        { label: "C) The $ne command acts as a master password override for the backend server.", value: "C" },
        { label: "D) The database experienced an error and dumped its entire memory to the screen to help you debug it.", value: "D" }
      ]
    },
    {
      id: 6,
      text: "Hacker Bob types <img src=\"x\" onerror=\"alert('XSS attack triggered by Bob!')\"> into his profile bio and saves it. Later, Admin Alice views Bob's profile, and her browser instantly runs the code. Why did Alice's browser execute Bob's script?",
      options: [
        { label: "A) Alice's administrator account does not have a strong enough password.", value: "A" },
        { label: "B) The web application pulled Bob's bio from the database and rendered it as executable HTML instead of plain text.", value: "B", isCorrect: true },
        { label: "C) Bob sent a targeted, malicious email directly to Alice's inbox.", value: "C" },
        { label: "D) The IMG tag contains a traditional computer virus that infected the entire backend server.", value: "D" }
      ]
    },
    {
      id: 7,
      text: "As a backend developer, what is the most secure way to prevent an IDOR vulnerability when a user requests to view a private profile?",
      options: [
        { label: "A) Hide the user's database ID in the HTML source code so it is not visible in the web address.", value: "A" },
        { label: "B) Compare the requested profile ID against the user's secure session token, which acts as their digital ID card.", value: "B", isCorrect: true },
        { label: "C) Ensure the server strictly filters out any special characters or symbols from the search bar.", value: "C" },
        { label: "D) Encode the URL so the numbers look completely random to the user.", value: "D" }
      ]
    },
    {
      id: 8,
      text: "As a backend developer, what is the most effective and secure way to stop a NoSQL injection attack from bypassing your search filters?",
      options: [
        { label: "A) Encrypt the entire database so hackers cannot read the dumped information.", value: "A" },
        { label: "B) Hide the search bar entirely from users who are not logged in as an administrator.", value: "B" },
        { label: "C) Implement strict type checking in your code to ensure the user's input is strictly a plain text string, and reject any objects.", value: "C", isCorrect: true },
        { label: "D) Change your backend database from MongoDB to a traditional SQL database.", value: "D" }
      ]
    },
    {
      id: 9,
      text: "In a modern frontend framework like React, what is the safest way to display user-submitted text on the screen to prevent XSS?",
      options: [
        { label: "A) Write a complex backend algorithm to delete all punctuation marks from the user's input.", value: "A" },
        { label: "B) Rely on React's default text rendering (like <p>{user.bio}</p>), which automatically converts dangerous code into harmless text.", value: "B", isCorrect: true },
        { label: "C) Use the dangerouslySetInnerHTML command to ensure the text loads exactly as the user typed it.", value: "C" },
        { label: "D) Block anyone except the administrator from updating their own profile.", value: "D" }
      ]
    }
  ];

  // Handle radio button selection
  const handleSelect = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  // Calculate score and send to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if they answered all questions
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);

    // Calculate the final score out of 9
    let finalScore = 0;
    questions.forEach(q => {
      const selectedOption = q.options.find(opt => opt.value === answers[q.id]);
      if (selectedOption && selectedOption.isCorrect) {
        finalScore += 1;
      }
    });

    try {
      const currentName = localStorage.getItem('username') || 'Unknown Participant';

      // Send the data to your new backend route
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
        // Automatically send them to the dashboard to start the labs
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

  // View 1: The Welcome Screen
  if (!hasStarted) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h1 style={{ color: '#004085' }}>Welcome to the Security Experiment</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
          Thank you for participating in this research study. Before you begin the interactive hacking labs, we need to establish a baseline of your current knowledge.
        </p>
        
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', marginTop: '20px', borderLeft: '5px solid #004085' }}>
          <h3 style={{ marginTop: '0' }}>Important Information:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li><strong>This is not an exam.</strong> We are testing the effectiveness of the platform, not your personal skills.</li>
            <li>Your results are completely anonymous and linked only to your participant ID.</li>
            <li>Please answer the following 9 questions to the best of your ability.</li>
            <li>Do not use external search engines (like Google) during this test.</li>
          </ul>
        </div>

        <button 
          onClick={() => setHasStarted(true)}
          style={{ padding: '12px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '30px', width: '100%' }}
        >
          I Understand, Start Pre-Test
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
        {questions.map((q, index) => (
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