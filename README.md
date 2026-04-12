# Interactive Web Security Platform (OWASP Vulnerabilities)

This repository contains an interactive educational platform built as a research prototype for a Master of Computer Science dissertation. The primary goal of this application is to practically demonstrate specific OWASP Top 10 web vulnerabilities and their corresponding mitigations within a modern web stack environment.

> ⚠️ **SECURITY WARNING:** This application contains intentionally vulnerable backend logic and frontend components designed strictly for educational research and penetration testing practice. Do not deploy this code in a production environment.

## The Interactive Security Labs

The platform features three core security labs, guiding users through both the exploitation (Red Team) and mitigation (Blue Team) phases of modern web vulnerabilities.

### 1. Insecure Direct Object Reference (IDOR)

- **The Vulnerability:** A broken access control implementation in the profile routing logic allows an attacker to manipulate the URL and view private data belonging to other users.
- **The Mitigation:** We implemented strict identity verification using JSON Web Token (JWT) payloads to ensure the user requesting the data is the rightful owner of the account.

### 2. NoSQL Injection

- **The Vulnerability:** The student directory search API blindly accepts user input without checking the data type. This allows attackers to bypass the text search by sending malicious MongoDB query objects (like `{"$ne": ""}`), forcing the database to leak all user records.
- **The Mitigation:** We secured the database queries by implementing strict type validation, ensuring the server rejects any incoming search request that is not a plain text string.

### 3. Stored Cross-Site Scripting (XSS)

- **The Vulnerability:** The user profile "About Me" section saves text directly to the database without filtering. The frontend React component then uses `dangerouslySetInnerHTML` to render this text, allowing attackers to permanently inject malicious JavaScript payloads that execute in the browsers of innocent visitors.
- **The Mitigation:** We integrated the `dompurify` library to act as a sanitisation filter, scrubbing away dangerous HTML tags and scripts before the content is ever rendered on the screen.

## System Architecture

This platform is built using the MERN stack, simulating a realistic, modern single-page application.

- **Database:** MongoDB Atlas (NoSQL)
- **Backend:** Node.js and Express
- **Frontend:** React and Vite
- **Security Libraries:** Bcrypt (password hashing), JSONWebToken (authentication), DOMPurify (input sanitisation)

## Local Installation Guide

If you are setting this up for local testing or academic review, follow these steps to run the application on your machine.

### Prerequisites

You will need Node.js installed on your system and a free MongoDB Atlas cluster.

### 1. Clone the Repository

````bash
git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
cd your-repo-name

### 2. Set Up the Backend
```bash
cd server
npm install

Create a file named `.env` in the server directory and add your private connection details:
MONGO_URI=your_mongodb_connection_string_here
jwtSecret=your_highly_secure_random_string

Start the backend server:
```bash
node index.js
````
