# Interactive Web Security Platform (OWASP Vulnerabilities)

This repository contains an interactive educational platform built as a research prototype for a Master of Computer Science dissertation. The primary goal of this application is to practically demonstrate specific OWASP Top 10 web vulnerabilities and their corresponding mitigations within a modern web stack environment.

> ⚠️ **SECURITY WARNING:** This application contains intentionally vulnerable backend logic and frontend components designed strictly for educational research and penetration testing practice. Do not deploy this code in a production environment.

## The Interactive Security Labs

The platform features three core security labs, guiding users through both the exploitation (Red Team) and mitigation (Blue Team) phases of modern web vulnerabilities.

### 1. Insecure Direct Object Reference (IDOR)

- **The Vulnerability:** A broken access control implementation in the profile routing logic allows an attacker to manipulate the URL and view private data belonging to other users.
- **The Mitigation:** We implemented strict session ownership verification alongside Role-Based Access Control (RBAC) to ensure the user requesting the data is the rightful owner of the account.

### 2. NoSQL Injection

- **The Vulnerability:** The student directory search API blindly accepts user input without checking the data type. This allows attackers to bypass the text search by sending malicious MongoDB query objects (like `{"$ne": "null"}`), forcing the database to leak all user records.
- **The Mitigation:** We secured the database queries by implementing strict type validation, ensuring the server rejects any incoming search request that is not a plain text string.

### 3. Stored Cross-Site Scripting (XSS)

- **The Vulnerability:** The user profile "About Me" section saves text directly to the database without filtering. The frontend React component then uses `dangerouslySetInnerHTML` to render this text, allowing attackers to permanently inject malicious JavaScript payloads that execute in the browsers of innocent visitors.
- **The Mitigation:** We replaced the unsafe `dangerouslySetInnerHTML` property with standard React JSX data binding, utilising the framework's native auto-escaping features to neutralise malicious scripts before they render.

## System Architecture

This platform is built using the MERN stack, simulating a realistic, modern single-page application.

- **Database:** MongoDB Atlas (NoSQL)
- **Backend:** Node.js and Express
- **Frontend:** React and Vite
- **Security Libraries:** Bcrypt (password hashing), JSONWebToken (authentication)

## Local Installation Guide

If you are setting this up for local testing or academic review, follow these steps to run the application on your machine.

### Prerequisites

You will need Node.js installed on your system and a free MongoDB Atlas cluster.

### 1. Clone the Repository

```bash
git clone https://github.com/farisfitrijuraidi/my-security-project.git
cd my-security-project
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a file named `.env` in the server directory and add your private connection details:

```bash
MONGO_URI=your_mongodb_connection_string_here
jwtSecret=your_highly_secure_random_string
```

Start the backend server:

```bash
node index.js
```

The server should display a message confirming it is running on port 5000 and connected to MongoDB.

### 3. Set Up the Frontend

Open a new terminal window, navigate to the client folder, and install the dependencies.

```bash
cd client
npm install
```

Start the React development server:

```bash
npm run dev
```

The application will now be accessible in your web browser at `http://localhost:5173`.
