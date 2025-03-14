# Task App

This project is a Task application with a **frontend** built using React, Vite, TypeScript, Redux Toolkit (RTK Query), Tailwind CSS, and Bootstrap, and a **backend** using Node.js, Express

## Getting Started

### 1. Clone the Repository
### 2. Client set up:
-  Navigate to -> cd client
-  Install dependencies -> npm install
-  Create a .env file in the client folder to set the API base URL: VITE_BASE_URL=http://localhost:3000
-  Start the development server: npm run dev
### 3. Server set up:
-   Navigate to -> cd todo-be
-   Install dependencies -> npm install
-   Start the development server: npm run start

---

## Chnages on the server, added new routes:
#### 1. /tasks/deleted to handle deletion all completed tasks
#### 2. /tasks/completeAll to mark all tasks as completed
---

## Functionality Overview

The Todo App includes the following features:

### 📝 Task Management
- **Add New Task**: Users can create new tasks by entering text and submitting.
- **Edit Task**: Double-click on a task to edit. Updates are saved when pressing `Enter` or when focus is lost.
- **Delete Task**: Remove individual tasks using the delete button.

### ✅ Task Completion
- **Toggle Task Completion**: Mark a task as completed or active by clicking the checkbox.
- **Complete All Tasks**: Mark all visible tasks as completed with a single button.
- **Delete All Completed Tasks**: Remove all completed tasks at once.

### 🔍 Filtering & UI Feedback
- **Filter Tasks**: View all tasks, only completed tasks, or only active tasks.
- **Optimistic Updates**: UI updates instantly while waiting for the backend response.
- **Toast Notifications**: Success/error messages for task actions.

### 🚀 Performance Enhancements
- **RTK Query Caching**: Efficient data fetching and state management.
- **Optimistic UI Updates**: Reduces perceived wait time for actions.
---


