# Application Tracking System (ATS)

A full-stack **Application Tracking System (ATS)** designed to simplify the recruitment process by enabling recruiters to manage job postings, screen resumes, track applications, schedule interviews, and manage candidates through a centralized platform.

## Features

### Candidate
- Register and login
- Create and update profile
- Search and apply for jobs
- Upload resume and cover letter
- Track application status
- View interview schedules

### Recruiter
- Create, edit and manage job postings
- View applications
- Resume match analysis
- Schedule interviews
- Update candidate status
- Provide recruiter feedback
- Dashboard and analytics

### Administrator
- Manage recruiters and users
- Manage jobs and applications
- View platform analytics
- Monitor user activity and logs
- Role-based access control

---

## Resume Screening

The application includes an automated resume screening module that:

- Extracts skills from uploaded resumes
- Compares candidate skills with job requirements
- Displays matched and missing skills
- Generates a resume match score to assist recruiters during candidate evaluation

---

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt
- Multer
- Nodemailer
- Cloudinary

### Resume Analyzer
- FastAPI
- Python

---

## Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- Password hashing using bcrypt
- Protected API routes
- Input validation
- Secure resume storage with Cloudinary

---

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Resume Analyzer | FastAPI |
| Source Code | GitHub |

---

## Project Structure

```
client/                 # React Frontend
server/                 # Node.js Backend
resume-analyzer/        # FastAPI Resume Analyzer
```

---

## Screenshots

### Admin Dashboard
- User Management
- Job Management
- Applications
- Analytics
- User Logs

### Recruiter Dashboard
- Manage Jobs
- Review Applications
- Resume Match Score
- Interview Scheduling

### Candidate Dashboard
- Browse Jobs
- Apply for Jobs
- Upload Resume
- Track Applications

### Resume Match Evaluation
- Resume Match Score
- Matched Skills
- Missing Skills
- Candidate Evaluation

---

## Installation

### Clone the repository

```bash
git clone https://github.com/uday-kiran-web-dev/ats_vite_app.git
cd ats_vite_app
```

### Install dependencies

Frontend

```bash
cd client
npm install
npm run dev
```

Backend

```bash
cd server
npm install
npm run dev
```

Resume Analyzer

```bash
cd resume-analyzer
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Authors

**Uday Kiran Chirra**

Master of Computer Science

Software Engineering (DLMCSPSE01)

IU International University of Applied Sciences