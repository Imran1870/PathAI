<div align="center">

# 🧠 PathAI — AI Resume Analyzer

**A full-stack MERN application that uses Google Gemini AI to analyze your resume against real job descriptions and generate a personalized career roadmap.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Application Flow](#-application-flow)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [AI Integration](#-ai-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**PathAI** is an intelligent resume analyzer that bridges the gap between where you are and where you want to be. Upload your PDF resume, paste a target job description, and let Google Gemini AI do the heavy lifting — in seconds you receive a structured, deeply personalized analysis that includes:

- A **match score** showing how well your resume aligns with the role
- **Missing skills** you need to acquire
- Your **key strengths** relative to the job
- A **step-by-step career roadmap**
- **Suggested portfolio projects** to build
- **Anticipated technical interview questions** with ideal answers — based on *your own projects*

All analyses are persisted to your account history, giving you a timeline view of your career growth over multiple applications.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Auth** | Secure login & registration with HTTP-Only cookie-based tokens |
| 📄 **PDF Upload** | Upload resumes as PDFs via Multer; stored in Cloudinary cloud storage |
| 🤖 **Gemini AI Analysis** | Structured JSON analysis from Google Gemini 2.5 Flash with enforced response schema |
| 📊 **Match Score** | Percentage score showing resume-to-JD alignment |
| 🗺️ **Career Roadmap** | Personalized phase-by-phase action plan |
| 💡 **Missing Skills** | Gap analysis between your profile and the target role |
| 🎯 **Interview Prep** | Project-specific technical questions with model answers |
| 🏗️ **Project Suggestions** | Recommended projects to close skill gaps |
| 🕰️ **Analysis History** | Full history of past analyses in a single-active accordion UI |
| 🔒 **Protected Routes** | All data endpoints gated behind `protectRoute` middleware |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI component framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first styling (via Vite plugin) |
| React Router DOM | v7 | Client-side routing |
| Axios | 1.x | HTTP client with credential forwarding |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | ≥ 18 | JavaScript runtime |
| Express | 5 | HTTP server framework |
| MongoDB | Atlas | Cloud NoSQL database |
| Mongoose | 9 | ODM / schema modeling |
| JSON Web Token | 9 | Stateless authentication tokens |
| bcryptjs | 3 | Password hashing |
| Multer | 2 | Multipart/form-data file handling |
| Cloudinary SDK | v2 | Cloud media storage |
| pdf-parse | 2 | PDF text extraction |
| Google Generative AI | 0.24 | Gemini API client |
| cookie-parser | 1.4 | HTTP cookie parsing middleware |

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│   React 19 + Vite 8 + Tailwind CSS v4                          │
│   ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌─────────────┐  │
│   │  Login   │  │ Register │  │ Dashboard │  │   History   │  │
│   └──────────┘  └──────────┘  └───────────┘  └─────────────┘  │
│          │            │             │                │          │
│          └────────────┴─────────────┴────────────────┘          │
│                          AuthContext (JWT via HTTP-Only Cookie)  │
│                          Axios (withCredentials: true)           │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTPS / REST API
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPRESS 5 SERVER (Node.js)                  │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  /api/auth  │  │ /api/resumes │  │    /api/analyses       │ │
│  │  register   │  │  /upload     │  │  /resume  (AI trigger) │ │
│  │  login      │  │              │  │  /history              │ │
│  │  logout     │  │              │  │                        │ │
│  │  /me        │  │              │  │                        │ │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬─────────────┘ │
│         │                │                      │               │
│  ┌──────▼──────┐  ┌──────▼───────┐  ┌──────────▼─────────────┐ │
│  │protectRoute │  │ Multer       │  │ Google Gemini 2.5 Flash │ │
│  │(JWT verify) │  │ diskStorage  │  │ (application/json mode) │ │
│  └─────────────┘  └──────┬───────┘  └──────────┬─────────────┘ │
└─────────────────────────┬┼─────────────────────┬┘               
                          ││                     │
            ┌─────────────┘│  ┌──────────────────┘
            ▼              ▼  ▼
    ┌──────────────┐  ┌──────────────────────────┐
    │  MongoDB     │  │  Cloudinary Cloud         │
    │  Atlas       │  │  (PDF raw file storage)   │
    │              │  │                           │
    │  Users       │  │  resume-<timestamp>.pdf   │
    │  Resumes     │  └──────────────────────────┘
    │  Analyses    │
    └──────────────┘
```

---

## 📁 Project Structure

```
PathAI/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary SDK initialization
│   │   └── db.js                  # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js      # register, login, logout
│   │   ├── uploadResumeController.js  # PDF upload + parse + Cloudinary
│   │   └── analyzeResumeController.js # Gemini AI trigger + history fetch
│   ├── middleware/
│   │   ├── authmiddleware.js      # JWT protectRoute guard
│   │   └── uploadResumemiddleware.js  # Multer config (PDF only, 5MB limit)
│   ├── models/
│   │   ├── userModel.js           # User schema (name, email, password)
│   │   ├── resumeModel.js         # Resume schema (userId, fileUrl, parsedText)
│   │   └── analysisModel.js       # Analysis schema (full AI result + metadata)
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── uploadResumeRoutes.js  # Resume upload endpoint
│   │   ├── analyzeResumeRoutes.js # AI analysis endpoint
│   │   └── historyRoutes.js       # History fetch endpoint
│   ├── tmp/                       # Temporary PDF storage (auto-cleaned)
│   ├── .env                       # Environment variables (never commit!)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state + /me check on mount
    │   ├── pages/
    │   │   ├── Login.jsx          # Login form
    │   │   ├── Register.jsx       # Registration form
    │   │   ├── Dashhboard.jsx     # Main analyzer UI (upload + results)
    │   │   └── History.jsx        # Analysis history accordion
    │   ├── App.jsx                # Route definitions + auth guards
    │   ├── main.jsx               # React root + AuthProvider wrapper
    │   ├── App.css
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 18.0.0` — [Download](https://nodejs.org/)
- **npm** `>= 9.0.0` (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

You also need accounts for these **free-tier** cloud services:

- **MongoDB Atlas** — [cloud.mongodb.com](https://cloud.mongodb.com) (free M0 cluster)
- **Cloudinary** — [cloudinary.com](https://cloudinary.com) (free plan)
- **Google AI Studio** — [aistudio.google.com](https://aistudio.google.com) (free Gemini API key)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/PathAI.git
cd PathAI
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Environment Variables

Create a `.env` file inside the `backend/` directory. **Never commit this file.**

```bash
# backend/.env

# ── Server ──────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── Database ────────────────────────────────────────────────────
# Get from: MongoDB Atlas → Connect → Drivers → Copy connection string
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# ── Authentication ───────────────────────────────────────────────
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET_KEY=your_64_byte_random_hex_secret_here

# ── Cloudinary ───────────────────────────────────────────────────
# Get from: Cloudinary Dashboard → Settings → API Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Google Gemini ────────────────────────────────────────────────
# Get from: aistudio.google.com → Get API Key
GEMINI_API_KEY=your_gemini_api_key

# ── CORS ─────────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173
```

> ⚠️ **Security Note:** Generate your `JWT_SECRET_KEY` using the command shown above — never use a short, guessable string in production. Add `.env` to your `.gitignore`.

---

### Running the App

You need **two terminal windows** — one for the backend, one for the frontend.

**Terminal 1 — Start the backend:**
```bash
cd backend
node server.js
```
You should see:
```
MongoDB Connected: <your-cluster>.mongodb.net
Server running in localhost 5000
```

**Terminal 2 — Start the frontend:**
```bash
cd frontend
npm run dev
```
You should see:
```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Authenticated routes require a valid JWT stored in the `token` HTTP-Only cookie (set automatically on login/register).

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/register` | ❌ | `{ username, email, password }` | Create new account, sets cookie |
| `POST` | `/login` | ❌ | `{ email, password }` | Login, sets cookie |
| `POST` | `/logout` | ❌ | — | Clears the auth cookie |
| `GET` | `/me` | ✅ | — | Returns current user profile (no password) |

**Register / Login Response:**
```json
{
  "message": "Login Successful",
  "user": {
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

---

### Resume Upload — `/api/resumes`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/upload` | ✅ | `multipart/form-data` (`resume`: PDF file) | Upload PDF, parse text, store in Cloudinary |

**Request:** `Content-Type: multipart/form-data`
- Field name: `resume`
- Accepted types: `application/pdf` only
- Max size: **5 MB**

**Success Response `201`:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "resumeId": "64f3a1b2c9e77f001234abcd",
  "textPreview": "John Doe | Software Engineer | john@example.com..."
}
```

---

### AI Analysis — `/api/analyses`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/resume` | ✅ | JSON (see below) | Trigger Gemini AI analysis |
| `GET` | `/history` | ✅ | — | Fetch all past analyses for current user |

**POST `/resume` — Request Body:**
```json
{
  "resumeId": "64f3a1b2c9e77f001234abcd",
  "targetRole": "Senior Frontend Developer",
  "jobDescription": "We are looking for a React developer with 3+ years...",
  "currentScenario": {
    "year": "3rd Year B.Tech",
    "goal": "Get a summer internship at a product company",
    "currentSkills": ["React", "Node.js", "MongoDB"]
  }
}
```

**Success Response `200`:**
```json
{
  "_id": "64f3b8d1a2e90c001234cdef",
  "userId": "64f3a0c8b1d45e001234ab99",
  "resumeId": "64f3a1b2c9e77f001234abcd",
  "targetRole": "Senior Frontend Developer",
  "jobDescription": "...",
  "currentScenario": { "year": "...", "goal": "...", "currentSkills": ["..."] },
  "analysisResult": {
    "matchScore": 72,
    "missingSkills": ["TypeScript", "GraphQL", "Docker"],
    "strengths": ["Strong React fundamentals", "Full-stack exposure"],
    "suggestedProjects": [
      { "title": "GraphQL Blog API", "description": "Build a blog backend using Apollo Server..." }
    ],
    "roadmap": [
      { "phase": "Phase 1 (Month 1-2)", "description": "Master TypeScript fundamentals..." }
    ],
    "good_project_questions": [
      {
        "question": "Explain the state management approach in your e-commerce project.",
        "answer": "I used React Context API for global cart state because..."
      }
    ]
  },
  "createdAt": "2026-06-21T13:22:10.000Z",
  "updatedAt": "2026-06-21T13:22:10.000Z"
}
```

---

## 🔄 Application Flow

```
User visits app
      │
      ▼
AuthProvider mounts → GET /api/auth/me
      │
      ├── 200 OK → user state set → redirect to /dashboard
      └── 401    → user is null  → redirect to /login

         ┌──────────────────────────────────────────────────────┐
         │                    Dashboard                          │
         │                                                        │
         │  1. User fills form                                    │
         │     - PDF resume file                                  │
         │     - Target role                                      │
         │     - Job description                                  │
         │     - Current year/status                             │
         │     - Career goal                                     │
         │     - Current skills (comma-separated)               │
         │                                                        │
         │  2. Submit → handleAnalyze()                          │
         │                                                        │
         │  Phase 1: POST /api/resumes/upload                    │
         │    └── Multer saves PDF to ./tmp                      │
         │    └── Cloudinary.upload() → gets secure_url         │
         │    └── pdf-parse extracts full text                   │
         │    └── Resume document saved to MongoDB              │
         │    └── Local temp file deleted                        │
         │    └── Returns { resumeId }                           │
         │                                                        │
         │  Phase 2: POST /api/analyses/resume                   │
         │    └── Fetches parsedText from Resume by resumeId    │
         │    └── Builds Gemini prompt with user data           │
         │    └── Gemini returns strict JSON response           │
         │    └── Analysis saved to MongoDB                     │
         │    └── Returns full Analysis document                 │
         │                                                        │
         │  Phase 3: Display results in right column             │
         └──────────────────────────────────────────────────────┘

User clicks "View History" → /history
      │
      ▼
GET /api/analyses/history
      │
      ▼
Accordion list of all past analyses
(sorted newest → oldest)
Single-active-state: clicking one closes others
```

---

## 🔐 Authentication

PathAI uses a **stateless JWT + HTTP-Only Cookie** authentication pattern.

### How It Works

```
1. User registers or logs in
   └── Backend signs a JWT with { userId } payload
   └── Sets cookie: token=<jwt>, HttpOnly, Secure (prod), MaxAge=7d

2. Every subsequent request
   └── Browser automatically sends the cookie (withCredentials: true)
   └── protectRoute middleware reads req.cookies.token
   └── jwt.verify() validates signature + expiry
   └── Sets req.userId for downstream controllers

3. App mount
   └── AuthProvider fires GET /api/auth/me on mount
   └── Backend reads cookie → returns user profile
   └── React sets global user state
   └── Loading screen shown until this resolves (prevents route flash)
```

### Cookie Configuration

| Flag | Development | Production |
|------|-------------|------------|
| `httpOnly` | ✅ `true` | ✅ `true` |
| `secure` | ❌ `false` | ✅ `true` |
| `sameSite` | `lax` | `strict` |
| `maxAge` | 7 days | 7 days |

### Protected Routes

| Route | Frontend Guard | Backend Guard |
|-------|---------------|---------------|
| `/` (Dashboard) | `user ? <Dashboard> : <Navigate to="/login">` | — |
| `/history` | `user ? <History> : <Navigate to="/login">` | `protectRoute` |
| `POST /api/resumes/upload` | — | `protectRoute` |
| `POST /api/analyses/resume` | — | `protectRoute` |
| `GET /api/analyses/history` | — | `protectRoute` |
| `GET /api/auth/me` | — | `protectRoute` |

---

## 🗃 Database Schema

### `users` collection
```js
{
  _id: ObjectId,
  name: String,           // required
  email: String,          // required, unique
  password: String,       // required (bcryptjs hash, 10 rounds)
  createdAt: Date,
  updatedAt: Date
}
```

### `resumes` collection
```js
{
  _id: ObjectId,
  userId: ObjectId,       // ref: 'User', required
  fileName: String,       // original filename
  fileUrl: String,        // Cloudinary secure_url
  parsedText: String,     // full extracted text from pdf-parse
  createdAt: Date,
  updatedAt: Date
}
```

### `analyses` collection
```js
{
  _id: ObjectId,
  userId: ObjectId,       // ref: 'User', required
  resumeId: ObjectId,     // ref: 'Resume', required
  targetRole: String,     // required
  jobDescription: String, // required
  currentScenario: {
    goal: String,
    year: String,
    currentSkills: [String]
  },
  analysisResult: {
    matchScore: Number,
    missingSkills: [String],
    strengths: [String],
    suggestedProjects: [{ title: String, description: String }],
    roadmap: [{ phase: String, description: String }],
    good_project_questions: [{ question: String, answer: String }]
  },
  createdAt: Date,        // used for sorting history
  updatedAt: Date
}
```

---

## 🤖 AI Integration

PathAI uses **Google Gemini 2.5 Flash** via the `@google/generative-ai` SDK.

### Key Configuration

```js
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",  // Forces strict JSON output
    }
});
```

Setting `responseMimeType: "application/json"` instructs Gemini to return **only valid JSON** — no markdown code fences, no prose explanation, no extra text. This eliminates the need for regex post-processing.

### Prompt Structure

The prompt provides Gemini with:
1. **Role context** — expert technical recruiter and career coach persona
2. **Candidate data** — year/status, goal, and current skills
3. **Target role** — the job title they're applying for
4. **Job description** — the actual JD pasted by the user
5. **Resume text** — extracted by `pdf-parse` from their uploaded PDF
6. **Strict output schema** — the exact JSON structure required

### Output Schema

```json
{
  "matchScore": 72,
  "missingSkills": ["TypeScript", "Docker"],
  "strengths": ["React expertise", "Project breadth"],
  "suggestedProjects": [{ "title": "...", "description": "..." }],
  "roadmap": [{ "phase": "...", "description": "..." }],
  "good_project_questions": [{ "question": "...", "answer": "..." }]
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's the workflow:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-new-feature`
3. **Commit** your changes: `git commit -m 'feat: add my new feature'`
4. **Push** to the branch: `git push origin feature/my-new-feature`
5. **Open** a Pull Request

### Code Style

- Backend: ES Modules (`import`/`export`), async/await, descriptive error messages
- Frontend: Functional components, hooks-based state, no class components
- Keep controllers thin — business logic belongs in services

### Before Submitting

- [ ] Ensure the backend starts without errors (`node server.js`)
- [ ] Ensure the frontend builds without warnings (`npm run build`)
- [ ] Test the full upload → analyze → history flow manually
- [ ] Never commit `.env` files or API keys

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Built with ❤️ using the MERN stack + Google Gemini AI

**[⬆ Back to top](#-pathai--ai-resume-analyzer)**

</div>
