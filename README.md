# TaskSpace

## App Description

A task completion application with the functionality to add or remove tasks with a RESTful backend has been made and deployed. Along with a task completion list, I've made a Kanban board as well where we can drag and drop tasks between columns to dynamically update their status.

* **Deployed Link**: [https://kanban-board-tasks-ruby.vercel.app/](https://kanban-board-tasks-ruby.vercel.app/)
* **Frontend Tech Stack**: I’ve made the frontend using vanilla React.
* **Backend Tech Stack**: A RESTful API server powered by Node.js, Express, and MongoDB.

### Demo Credentials

For demo, I’ve made a demo account with pre-added tasks. Use the following credentials to access that:

* **Email**: `demo@mail.com`
* **Password**: `123456`

---

## Setup Instructions

Follow these steps to run the application locally.

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` directory:
   ```bash
   touch .env
   ```
4. Add the following environment variables to your `backend/.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   The server will start running at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Navigate to the root folder (if you are in the backend directory, run `cd ..` first):
   ```bash
   cd ..
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
4. Add the backend API base URL to your root `.env` file:
   ```env
   REACT_APP_API_BASE=http://localhost:5000/api
   ```
5. Start the React frontend application:
   ```bash
   npm start
   ```
   The application will open and run locally at `http://localhost:3000`.
