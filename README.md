# 🎬 CineTrack — Movie & TV Show Watchlist Full-Stack App

A modern, responsive full-stack Movie & TV Show Watchlist application built with **Django REST Framework** (Backend) and **React + Vite** (Frontend).

---

## ✨ Features

- **Two Tabs Organization**: Switch seamlessly between **"To Watch"** (Unwatched) and **"Watched"** with live item count badges.
- **Interactive 5-Star Rating Component**:
  - Clickable 1-5 stars with hover previews and descriptive tooltips (*Poor, Fair, Good, Great, Masterpiece*).
  - Optimistic UI updates with instant synchronization to the Django backend via `PATCH /api/media/<id>/rate/`.
  - Ability to clear/reset ratings.
- **Django REST Framework Models**:
  - `Media`: `title`, `type` (`Movie` / `TV`), `status` (`Watched` / `Unwatched`), `rating` (0-5 stars), `owner` (`User` foreign key), plus `genre`, `release_year`, `poster_url`, and `notes`.
- **Search, Filter & Sort**:
  - Live search across titles, genres, and review notes.
  - Filter by media type (All, Movies, TV Shows).
  - Sort by Recently Updated, Recently Added, Highest/Lowest Rated, Title (A-Z).
- **Authentication & Security**:
  - Token-based Authentication with Register, Login, and Current User profile endpoints.
  - 1-Click Demo Login (`demo` / `demo1234`) for instant testing.
  - Per-user data isolation (users only access their own watchlist).
- **CORS & Axios Client**:
  - Configured `django-cors-headers` middleware for cross-origin communication.
  - Axios client with request & response interceptors attaching `Authorization: Token <token>` headers and handling 401 expiration.
- **Delightful Micro-interactions**:
  - Confetti celebration when marking titles as Watched.
  - Smooth glassmorphism navigation and toast notifications.

---

## 🚀 Quick Start Guide

### 1. Backend (Django)

```bash
cd backend

# Run migrations
python manage.py migrate

# (Optional) Seed demo user with sample movies
python seed_demo.py

# Run Django REST Server (runs on http://127.0.0.1:8000)
python manage.py runserver 127.0.0.1:8000
```

#### Demo Account Credentials
- **Username**: `demo`
- **Password**: `demo1234`

---

### 2. Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 🧪 Testing

To run the automated test suite for the Django API:

```bash
cd backend
python manage.py test
```
All 9 test cases covering authentication, CRUD, 5-star ratings, status toggling, and data isolation pass.
