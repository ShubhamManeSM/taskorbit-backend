# TaskOrbit - Backend API

A robust REST API service built for the TaskOrbit project management platform. It provides endpoints for task tracking, team management, user authentication, and detailed reporting analytics.

---

## Quick Start

Follow these steps to run the server locally:

```bash
git clone https://github.com/ShubhamManeSM/taskorbit-backend
cd taskorbit-backend
npm install
```

Create a `.env` file in the root directory and configure your variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:
```bash
npm start      # Or `node index.js`
```
The server will run on `http://localhost:5000`.

## Technologies
- **Node.js** & **Express** (Server framework)
- **MongoDB** & **Mongoose** (Database & ODM)
- **JWT & bcryptjs** (Authentication & Security)
- **CORS** (Cross-Origin Resource Sharing)
- **Dotenv** (Environment variables)

## Features
- **Task Tracking**: Create, update, and fetch tasks with rich sorting and filters.
- **Project & Team Management**: Organize tasks into teams and specific project categories.
- **Reporting Analytics**: Aggregate complex data for dashboard charts (last week stats, pending days, closed tasks).
- **User Authentication**: Secure signup and login endpoints using JSON Web Tokens.

## API Reference

### **Auth & Users**
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate user
- `GET /auth/me` - Get current user profile

### **Tasks**
- `GET /tasks` - List tasks (supports filtering by team, owner, status, tags, project)
- `GET /tasks/:id` - Get specific task details
- `POST /tasks` - Create a new task
- `POST /tasks/:id` - Update an existing task
- `DELETE /tasks/:id` - Delete a task

### **Projects & Teams**
- `GET /projects` - List all projects
- `POST /projects` - Add a new project
- `GET /teams` - List all teams
- `POST /teams` - Add a new team

### **Tags**
- `GET /tags` - List all tags
- `POST /tags` - Create a new tag

### **Reports**
- `GET /report/last-week` - Stats for tasks completed per day in the last week
- `GET /report/pending` - Stats for total pending task days by project
- `GET /report/closed-tasks` - Stats for closed tasks grouped by team and owner

## Contact
For bugs or feature requests, please reach out to [Email Me](mailto:shubhammane7096@gmail.com)
