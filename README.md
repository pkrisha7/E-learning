# 📚 LearnHub — eLearning Platform

> A full-stack web application that enables learners to discover, enroll in, and complete online courses — with a seamless experience for both students and instructors.

[![JavaScript](https://img.shields.io/badge/JavaScript-97.4%25-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-2.3%25-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML](https://img.shields.io/badge/HTML-0.3%25-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

LearnHub is a modern, full-stack eLearning platform designed to bridge the gap between learners and quality educational content. Built with a decoupled client-server architecture, it provides a smooth, responsive experience for browsing courses, tracking progress, and managing content — all from a single web application.

---

## Features

- 🔐 **User Authentication** — Secure sign-up, login, and session management
- 🎓 **Course Catalogue** — Browse and search a library of courses by category or keyword
- 📖 **Course Enrollment** — One-click enrollment with persistent progress tracking
- 🎬 **Video Lessons** — Structured lesson delivery with video content support
- 📝 **Quizzes & Assessments** — Interactive quizzes to reinforce learning
- 🧑‍🏫 **Instructor Dashboard** — Create and manage course content
- 📊 **Student Dashboard** — Track enrolled courses and learning progress
- 📱 **Responsive UI** — Optimised for desktop and mobile browsers

---

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| **Frontend** | JavaScript, HTML5, CSS3                 |
| **Backend**  | Node.js, Express.js                     |
| **Database** | MongoDB (via Mongoose)                  |
| **Auth**     | JWT (JSON Web Tokens)                   |
| **Tools**    | npm, Git                                |

---

## Project Structure

```
E-learning/
│
├── client/                  # Frontend application
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Page-level views (Home, Course, Dashboard)
│       ├── services/        # API service calls
│       └── styles/          # Global and component-level CSS
│
├── server/                  # Backend REST API
│   ├── models/              # Mongoose data models
│   ├── routes/              # API route handlers
│   ├── middleware/          # Auth and error-handling middleware
│   ├── controllers/         # Business logic layer
│   └── server.js            # Express app entry point
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud instance)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/pkrisha7/E-learning.git
cd E-learning
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Start the Backend

```bash
cd server
npm install
npm start
```

The API server will be running at `http://localhost:5000`.

### 4. Start the Frontend

```bash
cd client
npm install
npm start
```

The frontend will be accessible at `http://localhost:3000`.

---

## API Reference

### Authentication

| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| POST   | `/api/auth/register`      | Register a new user     |
| POST   | `/api/auth/login`         | Log in and receive JWT  |

### Courses & Enrollment

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | `/api/courses`            | Retrieve all available courses   |
| GET    | `/api/courses/:id`        | Get details of a specific course |
| GET    | `/api/courses/my-enrollments` | List all enrolled courses for current user |
| POST   | `/api/courses`            | Create a new course (instructor/admin) |
| PUT    | `/api/courses/:id`        | Update course details            |
| DELETE | `/api/courses/:id`        | Delete a course                  |
| POST   | `/api/courses/:courseId/enroll` | Direct enrollment in a course |
| PUT    | `/api/courses/:courseId/progress/:lessonId` | Mark lesson as complete |

### Quizzes

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | `/api/quizzes/course/:courseId` | Retrieve quiz for a specific course |
| POST   | `/api/quizzes`            | Create a new quiz (instructor/admin) |
| PUT    | `/api/quizzes/:id`        | Update quiz details              |
| DELETE | `/api/quizzes/:id`        | Delete a quiz                    |

### Payments (Stripe Checkout)

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| POST   | `/api/payments/checkout/:courseId` | Create a Stripe checkout session |
| POST   | `/api/payments/success`   | Process successful payment & enroll student |

### Admin Panel

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | `/api/admin/stats`        | Get platform stats (users, courses, revenue) |
| GET    | `/api/admin/users`        | List all user accounts           |
| PUT    | `/api/admin/users/:id/role` | Update role of a specific user   |
| DELETE | `/api/admin/users/:id`    | Delete a user account            |
| GET    | `/api/admin/courses`      | List all courses (published & unpublished) |
| PUT    | `/api/admin/courses/:id/toggle` | Toggle course publish status |
| DELETE | `/api/admin/courses/:id`  | Delete any course admin-side     |

> All protected endpoints require a valid `Authorization: Bearer <token>` header.

---

## Roadmap

- [ ] Certificate generation on course completion
- [ ] Payment gateway integration
- [ ] Discussion forums per course
- [ ] AI-based course recommendations
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and include relevant tests where applicable.

---

## Author

**Krisha Pokharel**
- GitHub: [@pkrisha7](https://github.com/pkrisha7)

---

> ⭐ If you found this project useful, consider giving it a star!
