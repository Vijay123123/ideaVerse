# IdeaVerse

IdeaVerse is a platform for sharing and discovering innovative ideas. Built with the MERN stack (MongoDB, Express, React, Node.js) and Clerk for authentication.

## Features

- User authentication with Clerk
- Browse ideas on the home page
- Dashboard to view and filter ideas
- Add new ideas
- Dark mode UI with blue accents

## Tech Stack

### Frontend
- React
- React Router
- Clerk for authentication
- Axios for API requests
- CSS for styling

### Backend
- Node.js
- Express
- MongoDB
- Clerk SDK for authentication

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/Vijay123123/ideaVerse.git
cd ideaverse
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

4. Create .env files

Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ideaverse
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_c2Vuc2libGUtdHVuYS0yNS5jbGVyay5hY2NvdW50cy5kZXYk
```

Frontend (.env):
```
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_c2Vuc2libGUtdHVuYS0yNS5jbGVyay5hY2NvdW50cy5kZXYk
```

### Running the Application

1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend development server
```
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
ideaverse/
├── backend/
│   ├── models/
│   │   └── Idea.js
│   ├── routes/
│   │   └── ideas.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
└── README.md
```
