# 🔗 URL Shortener (Full Stack)

A modern **Full-Stack URL Shortener** built with **Next.js (Frontend)** and **Node.js + Express (Backend)**.  
It supports custom short links, expiration, analytics tracking, and caching.

## 🚀 Features

- ✂️ Shorten long URLs
- 🧩 Custom short codes
- ⏳ Link expiration support
- 🔁 Fast redirects
- 📊 Click analytics (IP + User-Agent)
- 🗄 SQLite database (lightweight & local)
- ⚡ Redis caching (optional)
- 🎨 Modern UI with Next.js (App Router)

## 🏗 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- Redis (optional, for caching)

## 📁 Project Structure

URLShortener/
│
├── frontend/ # Next.js frontend
│ ├── app/
│ ├── components/
│ ├── public/
│ └── package.json
│
├── backend/ # Express backend
│ ├── src/
│ │ ├── db/
│ │ │ └── database.js
│ │ ├── routes/
│ │ │ └── urlRoutes.js
│ │ ├── utils/
│ │ │ └── redisClient.js
│ │ └── index.js
│ └── package.json
│
├── .gitignore
└── README.md


## ⚙️ Setup Instructions (Local)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Aksharmadan/URLShortener.git
cd URLShortener

▶️ Backend Setup
cd backend
npm install
npm start


Backend will start on:

http://localhost:5050

▶️ Frontend Setup

Open a new terminal:

cd frontend
npm install
npm run dev


Frontend will start on:

http://localhost:3000

