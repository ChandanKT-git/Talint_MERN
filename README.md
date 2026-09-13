# Talint

[Live URL](https://talilnt-mern.onrender.com/)

Talint is a modern, real-time collaborative coding platform designed for technical interviews, pair programming, and algorithmic practice. It provides a synchronized coding environment paired with built-in video conferencing and chat, entirely self-hosted without reliance on third-party SaaS SDKs.

## Architecture and Technologies

The project is structured as a monorepo containing a React frontend and a Node.js backend.

### Frontend
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, daisyUI
- **Editor:** Monaco Editor (VS Code core)
- **State Management:** React Context (Auth), React Query (Data Fetching)
- **Real-Time Communication:** 
  - Socket.IO Client (Signaling, Code Sync, Chat)
  - Native WebRTC (Peer-to-Peer Video/Audio Streaming)
- **Code Execution:** Piston API Integration

### Backend
- **Framework:** Node.js, Express
- **Database:** MongoDB, Mongoose ODM
- **Authentication:** Custom JWT-based auth with HTTP-only cookies and bcrypt password hashing
- **Real-Time Server:** Socket.IO

## Features

- **Custom Authentication:** Secure, session-based authentication using JSON Web Tokens (JWT) stored in HTTP-only cookies to prevent XSS attacks.
- **Collaborative Code Editor:** Real-time code synchronization between session participants via WebSockets.
- **In-Browser Compilation:** Execute code against the Piston API in real-time and view stdout/stderr output directly in the editor panel.
- **Peer-to-Peer Video Conferencing:** Integrated video and audio streams using native WebRTC, utilizing Socket.IO exclusively for SDP offer/answer signaling and ICE candidate exchanges.
- **Persistent Chat:** Real-time text communication within sessions, backed by MongoDB for message history retrieval.
- **Session Management:** Create coding rooms with specific problem definitions, difficulty tiers, and control over session lifecycles.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Cluster (Atlas or local instance)

## Local Development Setup

### 1. Repository Initialization
Clone the repository to your local machine:
```bash
git clone https://github.com/ChandanKT-git/Talint_MERN.git
cd Talint_MERN
```

### 2. Environment Configuration

Create a `.env` file in the **backend** directory (`backend/.env`):
```env
PORT=3000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the **frontend** directory (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Install Dependencies

The project utilizes a root `package.json` to manage both environments. You can install all dependencies from the root directory:
```bash
npm run build
```
*(This command is configured to install both backend and frontend dependencies).*

Alternatively, install them manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Running the Application

Open two separate terminal instances.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Deployment

The repository is structured to support single-service deployment on PAAS providers like Render or Heroku. The root `package.json` contains the necessary scripts to build the frontend and serve it statically via the Express backend.

### Build Command
```bash
npm install --prefix backend && npm install --prefix frontend --include=dev && npm run build --prefix frontend
```

### Start Command
```bash
npm start --prefix backend
```

### Production Environment Variables
When deploying, ensure the host environment is configured with:
- `NODE_ENV=production`
- `DB_URL`
- `JWT_SECRET`
- `CLIENT_URL` (The public URL of your deployed application)

## License

This project is licensed under the ISC License.