# Frontend Application - React Task Manager

A modern, production-ready React application for task management with comprehensive testing, built with React 18, Vite, and React Router.

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-purple.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2.4-green.svg)](https://vitest.dev/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Detailed File Documentation](#detailed-file-documentation)
- [Components](#components)
- [Pages](#pages)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Testing](#testing)
- [Configuration](#configuration)
- [Build & Deployment](#build--deployment)

---

## 🎯 Overview

This frontend application provides a modern, responsive interface for task management with:

- ✅ React 18 with hooks and modern patterns
- ✅ React Router 6 for client-side routing
- ✅ Vite for fast development and optimized builds
- ✅ Axios for API communication
- ✅ Comprehensive testing (unit, integration, functional, smoke)
- ✅ Custom hooks for reusable logic
- ✅ Error boundaries for graceful error handling
- ✅ Optimistic UI updates for better UX

---

## 🚀 Quick Start

### Development Mode

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Or with custom port
npm run dev -- --port 3001
```

Access at: http://localhost:3000

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

### Run Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## 📁 Project Structure

```
kellyfrontendtask/
├── src/
│   ├── main.jsx                      # Application entry point
│   ├── styles.css                    # Global styles
│   ├── pages/                        # Route components
│   │   ├── TaskListView.jsx          # List all tasks
│   │   ├── CreateTask.jsx            # Create new task
│   │   ├── TaskDetails.jsx           # View/edit task
│   │   └── SearchTasks.jsx           # Search tasks
│   ├── components/                   # Reusable components
│   │   ├── Header.jsx                # App header
│   │   ├── Footer.jsx                # App footer
│   │   ├── ErrorBoundary.jsx         # Error handling
│   │   └── shared/                   # Shared components
│   ├── api/                          # API client layer
│   │   └── tasks.js                  # Task API functions
│   ├── models/                       # Domain models
│   │   └── task.js                   # Task model & status cache
│   ├── utils/                        # Utility functions
│   │   ├── validation.js             # Form validation
│   │   └── taskUtils.js              # Task helpers
│   ├── hooks/                        # Custom React hooks
│   │   ├── index.js                  # Hook exports
│   │   ├── useAsync.js               # Async operations
│   │   ├── useMessage.js             # Message/toast state
│   │   ├── useTaskList.js            # Task list logic
│   │   ├── useTaskDetails.js         # Task details logic
│   │   ├── useTaskForm.js            # Task form logic
│   │   └── useTaskSearch.js          # Search logic
│   ├── constants/                    # Application constants
│   │   └── index.js                  # Constants export
│   ├── test/                         # Test utilities
│   │   └── setup.js                  # Test configuration
│   └── __tests__/                    # Test files
│       ├── CreateTask.test.jsx       # Unit tests
│       ├── TaskListView.test.jsx
│       ├── TaskDetails.test.jsx
│       ├── SearchTasks.test.jsx      # Integration tests
│       ├── api.*.test.jsx
│       └── *Flow.test.jsx            # Functional tests
├── index.html                        # HTML entry point
├── package.json                      # NPM dependencies
├── vite.config.js                    # Vite configuration
├── vitest.config.js                  # Vitest configuration
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

---

## 📚 Detailed File Documentation

### 🔵 Application Entry Point

#### `main.jsx`

**Location**: `src/main.jsx`

**Purpose**: Application bootstrap and routing configuration

**Key Components**:

- **`Boot()`** - Async initialization wrapper

  - Loads task statuses from API on startup
  - Shows loading state during initialization
  - Handles mount/unmount cleanup

- **`Layout()`** - Common layout wrapper

  - Includes `Header` component
  - Main content area with padding
  - Includes `Footer` component
  - Flex layout for sticky footer

- **Routing** - React Router setup
  - `/` - TaskListView (default)
  - `/tasks` - TaskListView
  - `/tasks/new` - CreateTask
  - `/tasks/:id` - TaskDetails
  - `/tasks/search` - SearchTasks

**Dependencies**:

- React, ReactDOM
- React Router (BrowserRouter, Routes, Route)
- Models (loadStatuses)
- API (listStatuses)
- All page components
- Header, Footer, ErrorBoundary

**Example**:

```jsx
function Boot() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    loadStatuses(listStatuses).finally(() => {
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return <div>Loading…</div>;
  return <BrowserRouter>...</BrowserRouter>;
}
```

---

### 🔵 Pages (`pages/`)

Page-level components mapped to routes.

#### `TaskListView.jsx`

**Route**: `/` and `/tasks`

**Purpose**: Display list of all tasks with actions

**Features**:

- Fetches all tasks on mount
- Create task button (navigates to `/tasks/new`)
- Search tasks button (navigates to `/tasks/search`)
- Task list display:
  - Task title (clickable → details page)
  - Task status with visual indicators
  - Description preview
  - Edit and Delete buttons
- Loading states
- Error messages
- Empty state handling
- Optimistic UI updates (immediate feedback)

**Custom Hook**: `useTaskList()`

**Key Functions**:

- `loadTasks()` - Fetch all tasks
- `handleDelete(id)` - Delete task with confirmation
- `handleEdit(id)` - Navigate to edit page
- `handleRefresh()` - Reload task list

**State**:

- `tasks` - Array of task objects
- `loading` - Boolean loading state
- `error` - Error message string
- `message` - Success message

**Example JSX**:

```jsx
<div className="task-list">
  {tasks.map((task) => (
    <div key={task.id} className="task-item">
      <h3 onClick={() => navigate(`/tasks/${task.id}`)}>{task.title}</h3>
      <span className={`status-${task.status}`}>{task.status}</span>
      <button onClick={() => handleDelete(task.id)}>Delete</button>
    </div>
  ))}
</div>
```

#### `CreateTask.jsx`

**Route**: `/tasks/new`

**Purpose**: Form to create a new task

**Features**:

- Form with title, description, status fields
- Real-time validation
- Status dropdown (TODO, IN_PROGRESS, DONE)
- Submit button (disabled during submission)
- Cancel button (returns to list)
- Error display
- Success message
- Auto-navigation to list after creation

**Custom Hook**: `useTaskForm()`

**Form Fields**:

- **Title** - Required, max 255 characters
- **Description** - Optional, max 2000 characters
- **Status** - Required, dropdown selection

**Validation**:

- Client-side validation before submit
- Server-side validation error display
- Field-level error messages

**Key Functions**:

- `handleSubmit(e)` - Form submission
- `handleChange(e)` - Input change handler
- `validateForm()` - Client-side validation

**State**:

- `formData` - { title, description, status }
- `errors` - Validation errors object
- `loading` - Submission loading state
- `message` - Success/error messages

**Example JSX**:

```jsx
<form onSubmit={handleSubmit}>
  <input
    name="title"
    value={formData.title}
    onChange={handleChange}
    placeholder="Task title"
    required
  />
  {errors.title && <span className="error">{errors.title}</span>}

  <select name="status" value={formData.status} onChange={handleChange}>
    <option value="TODO">To Do</option>
    <option value="IN_PROGRESS">In Progress</option>
    <option value="DONE">Done</option>
  </select>

  <button type="submit" disabled={loading}>
    {loading ? "Creating..." : "Create Task"}
  </button>
</form>
```

#### `TaskDetails.jsx`

**Route**: `/tasks/:id`

**Purpose**: View and edit individual task

**Features**:

- Fetches task by ID on mount
- Edit mode toggle
- View mode:
  - Display title, description, status
  - Show created/updated timestamps
  - Edit button
  - Delete button
  - Back to list button
- Edit mode:
  - Inline form editing
  - Save/Cancel buttons
  - Validation
- Loading state
- 404 handling for non-existent tasks
- Optimistic updates

**Custom Hook**: `useTaskDetails(id)`

**Key Functions**:

- `loadTask(id)` - Fetch task details
- `handleEdit()` - Enable edit mode
- `handleSave()` - Save changes
- `handleCancel()` - Cancel editing
- `handleDelete()` - Delete task with confirmation

**State**:

- `task` - Task object
- `editMode` - Boolean edit state
- `editData` - Form data during editing
- `loading` - Boolean loading state
- `error` - Error message

**Example JSX**:

```jsx
{!editMode ? (
  <div className="task-details">
    <h1>{task.title}</h1>
    <p>{task.description}</p>
    <span className={`status-${task.status}`}>{task.status}</span>
    <button onClick={handleEdit}>Edit</button>
  </div>
) : (
  <form onSubmit={handleSave}>
    <input value={editData.title} onChange={...} />
    <textarea value={editData.description} onChange={...} />
    <button type="submit">Save</button>
    <button onClick={handleCancel}>Cancel</button>
  </form>
)}
```

#### `SearchTasks.jsx`

**Route**: `/tasks/search`

**Purpose**: Search and filter tasks

**Features**:

- Search form with multiple filters:
  - Title (partial match)
  - Description (partial match)
  - Status (exact match)
- Search button
- Clear filters button
- Results display (same as TaskListView)
- No results message
- Loading state
- Error handling

**Custom Hook**: `useTaskSearch()`

**Search Filters**:

- **Title** - Case-insensitive partial match
- **Description** - Case-insensitive partial match
- **Status** - Exact match dropdown

**Key Functions**:

- `handleSearch(e)` - Execute search
- `handleFilterChange(e)` - Update filter values
- `handleClear()` - Reset all filters
- `handleTaskClick(id)` - Navigate to details

**State**:

- `filters` - { title, description, status }
- `results` - Array of matching tasks
- `loading` - Boolean search state
- `searched` - Boolean to track if search executed

**Example JSX**:

```jsx
<form onSubmit={handleSearch}>
  <input
    name="title"
    value={filters.title}
    onChange={handleFilterChange}
    placeholder="Search by title"
  />
  <input
    name="description"
    value={filters.description}
    onChange={handleFilterChange}
    placeholder="Search by description"
  />
  <select name="status" value={filters.status} onChange={handleFilterChange}>
    <option value="">All Statuses</option>
    <option value="TODO">To Do</option>
    <option value="IN_PROGRESS">In Progress</option>
    <option value="DONE">Done</option>
  </select>
  <button type="submit">Search</button>
  <button type="button" onClick={handleClear}>Clear</button>
</form>

<div className="results">
  {results.length === 0 && searched && <p>No tasks found</p>}
  {results.map(task => <TaskCard key={task.id} task={task} />)}
</div>
```

---

### 🔵 Components (`components/`)

Reusable UI components.

#### `Header.jsx`

**Purpose**: Application header with navigation

**Features**:

- App title/logo
- Navigation links:
  - Home / Task List
  - Create Task
  - Search Tasks
- Active route highlighting
- Responsive design

**Example**:

```jsx
<header className="app-header">
  <h1>Task Manager</h1>
  <nav>
    <Link to="/" className={location.pathname === "/" ? "active" : ""}>
      Tasks
    </Link>
    <Link to="/tasks/new">Create</Link>
    <Link to="/tasks/search">Search</Link>
  </nav>
</header>
```

#### `Footer.jsx`

**Purpose**: Application footer

**Features**:

- Copyright information
- Version number
- Links to documentation
- Sticky footer layout

**Example**:

```jsx
<footer className="app-footer">
  <p>&copy; 2025 Task Manager | Version 0.1.0</p>
</footer>
```

#### `ErrorBoundary.jsx`

**Purpose**: React error boundary for graceful error handling

**Features**:

- Catches React component errors
- Displays fallback UI
- Logs errors to console
- Prevents entire app crash
- Reset functionality

**Methods**:

- `componentDidCatch(error, errorInfo)` - Log error
- `static getDerivedStateFromError(error)` - Update state

**State**:

- `hasError` - Boolean error state
- `error` - Error object

**Example**:

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}
```

#### `components/shared/`

**Purpose**: Shared/common components

**Potential Components**:

- `Button.jsx` - Reusable button component
- `Input.jsx` - Reusable input component
- `Select.jsx` - Reusable select component
- `TaskCard.jsx` - Task display card
- `LoadingSpinner.jsx` - Loading indicator
- `Message.jsx` - Success/error message display

---

### 🔵 API Layer (`api/`)

API communication functions.

#### `tasks.js`

**Purpose**: Task API client functions

**Base URL**: Configured via `VITE_API_TARGET` (default: http://localhost:4000)

**Functions**:

##### `listTasks()`

- **Method**: GET
- **Endpoint**: `/api/tasks`
- **Returns**: `Promise<Array<Task>>`
- **Description**: Fetch all tasks

##### `getTaskById(id)`

- **Method**: GET
- **Endpoint**: `/api/tasks/{id}`
- **Parameters**: `id` (number)
- **Returns**: `Promise<Task>`
- **Description**: Fetch single task by ID

##### `createTask(taskData)`

- **Method**: POST
- **Endpoint**: `/api/tasks`
- **Parameters**: `taskData` ({ title, description, status })
- **Returns**: `Promise<Task>`
- **Description**: Create new task

##### `updateTask(id, taskData)`

- **Method**: PUT
- **Endpoint**: `/api/tasks/{id}`
- **Parameters**: `id` (number), `taskData` (object)
- **Returns**: `Promise<Task>`
- **Description**: Update existing task

##### `deleteTask(id)`

- **Method**: DELETE
- **Endpoint**: `/api/tasks/{id}`
- **Parameters**: `id` (number)
- **Returns**: `Promise<void>`
- **Description**: Delete task

##### `searchTasks(filters)`

- **Method**: GET
- **Endpoint**: `/api/tasks/search?title=...&description=...&status=...`
- **Parameters**: `filters` ({ title?, description?, status? })
- **Returns**: `Promise<Array<Task>>`
- **Description**: Search tasks with filters

##### `listStatuses()`

- **Method**: GET (or hardcoded)
- **Returns**: `Promise<Array<string>>`
- **Description**: Get available task statuses

**Error Handling**:

- Axios interceptors for global error handling
- Network error handling
- HTTP error status handling
- Returns rejected promises for error cases

**Example Implementation**:

```javascript
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_TARGET || "http://localhost:4000";
const api = axios.create({ baseURL: API_BASE });

export const listTasks = async () => {
  const response = await api.get("/api/tasks");
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/api/tasks", taskData);
  return response.data;
};

export const searchTasks = async (filters) => {
  const params = new URLSearchParams();
  if (filters.title) params.append("title", filters.title);
  if (filters.description) params.append("description", filters.description);
  if (filters.status) params.append("status", filters.status);

  const response = await api.get(`/api/tasks/search?${params}`);
  return response.data;
};
```

---

### 🔵 Models (`models/`)

Domain models and business logic.

#### `task.js`

**Purpose**: Task model and status management

**Status Cache**:

- Global status cache to avoid repeated API calls
- Loaded once on app initialization
- Used throughout app for status dropdown

**Functions**:

##### `loadStatuses(apiFunction)`

- **Parameters**: `apiFunction` - Function that returns Promise<Array<string>>
- **Returns**: `Promise<void>`
- **Description**: Load and cache task statuses
- **Side Effects**: Updates global status cache

##### `getStatuses()`

- **Returns**: `Array<string>`
- **Description**: Get cached statuses
- **Example**: `['TODO', 'IN_PROGRESS', 'DONE']`

##### `getStatusLabel(status)`

- **Parameters**: `status` (string)
- **Returns**: `string`
- **Description**: Convert status code to display label
- **Example**: `'IN_PROGRESS'` → `'In Progress'`

##### `getStatusColor(status)`

- **Parameters**: `status` (string)
- **Returns**: `string` (CSS color)
- **Description**: Get color for status badge
- **Example**: `'TODO'` → `'#blue'`, `'DONE'` → `'#green'`

**Task Model Type** (TypeScript/JSDoc):

```javascript
/**
 * @typedef {Object} Task
 * @property {number} id - Task ID
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string} status - Task status (TODO|IN_PROGRESS|DONE)
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */
```

**Example Implementation**:

```javascript
let statusCache = [];

export const loadStatuses = async (apiFunc) => {
  try {
    statusCache = await apiFunc();
  } catch (error) {
    console.error("Failed to load statuses:", error);
    statusCache = ["TODO", "IN_PROGRESS", "DONE"]; // Fallback
  }
};

export const getStatuses = () => statusCache;

export const getStatusLabel = (status) => {
  const labels = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };
  return labels[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    TODO: "#3b82f6", // blue
    IN_PROGRESS: "#f59e0b", // amber
    DONE: "#10b981", // green
  };
  return colors[status] || "#6b7280"; // gray
};
```

---

### 🔵 Utilities (`utils/`)

Helper functions and utilities.

#### `validation.js`

**Purpose**: Form validation functions

**Functions**:

##### `validateTaskTitle(title)`

- **Parameters**: `title` (string)
- **Returns**: `string | null` (error message or null)
- **Rules**: Required, max 255 characters

##### `validateTaskDescription(description)`

- **Parameters**: `description` (string)
- **Returns**: `string | null`
- **Rules**: Max 2000 characters

##### `validateTaskStatus(status)`

- **Parameters**: `status` (string)
- **Returns**: `string | null`
- **Rules**: Must be valid status (TODO, IN_PROGRESS, DONE)

##### `validateTask(taskData)`

- **Parameters**: `taskData` ({ title, description, status })
- **Returns**: `Object` - { valid: boolean, errors: {...} }
- **Description**: Validate entire task object

**Example**:

```javascript
export const validateTaskTitle = (title) => {
  if (!title || title.trim() === "") {
    return "Title is required";
  }
  if (title.length > 255) {
    return "Title must be 255 characters or less";
  }
  return null;
};

export const validateTask = (taskData) => {
  const errors = {};

  const titleError = validateTaskTitle(taskData.title);
  if (titleError) errors.title = titleError;

  const descError = validateTaskDescription(taskData.description);
  if (descError) errors.description = descError;

  const statusError = validateTaskStatus(taskData.status);
  if (statusError) errors.status = statusError;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
```

#### `taskUtils.js`

**Purpose**: Task-related utility functions

**Functions**:

##### `formatDate(dateString)`

- **Parameters**: `dateString` (ISO string)
- **Returns**: `string` (formatted date)
- **Description**: Format ISO date to readable format

##### `sortTasksByStatus(tasks)`

- **Parameters**: `tasks` (Array)
- **Returns**: `Array` (sorted tasks)
- **Description**: Sort tasks by status priority

##### `filterTasksByStatus(tasks, status)`

- **Parameters**: `tasks` (Array), `status` (string)
- **Returns**: `Array` (filtered tasks)
- **Description**: Filter tasks by status

##### `getTaskProgress(tasks)`

- **Parameters**: `tasks` (Array)
- **Returns**: `Object` - { total, todo, inProgress, done, percentage }
- **Description**: Calculate task completion statistics

**Example**:

```javascript
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const sortTasksByStatus = (tasks) => {
  const order = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
  return [...tasks].sort((a, b) => order[a.status] - order[b.status]);
};

export const getTaskProgress = (tasks) => {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todo = tasks.filter((t) => t.status === "TODO").length;

  return {
    total,
    todo,
    inProgress,
    done,
    percentage: total > 0 ? Math.round((done / total) * 100) : 0,
  };
};
```

---

### 🔵 Custom Hooks (`hooks/`)

Reusable React hooks for state and logic management.

#### `index.js`

**Purpose**: Export all hooks from single entry point

```javascript
export { useAsync } from "./useAsync";
export { useMessage } from "./useMessage";
export { useTaskList } from "./useTaskList";
export { useTaskDetails } from "./useTaskDetails";
export { useTaskForm } from "./useTaskForm";
export { useTaskSearch } from "./useTaskSearch";
```

#### `useAsync.js`

**Purpose**: Generic async operation state management

**Returns**: `{ loading, error, execute, reset }`

**State**:

- `loading` - Boolean loading state
- `error` - Error message or null
- `data` - Response data

**Methods**:

- `execute(asyncFunction)` - Execute async function
- `reset()` - Reset state

**Example**:

```javascript
export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (asyncFunction) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return { loading, error, data, execute, reset };
};
```

#### `useMessage.js`

**Purpose**: Manage success/error messages with auto-dismiss

**Returns**: `{ message, showMessage, clearMessage }`

**State**:

- `message` - { text: string, type: 'success'|'error' }

**Methods**:

- `showMessage(text, type)` - Show message
- `clearMessage()` - Clear message

**Features**:

- Auto-dismiss after 3 seconds
- Type-based styling

**Example**:

```javascript
export const useMessage = (timeout = 3000) => {
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), timeout);
  };

  const clearMessage = () => setMessage(null);

  return { message, showMessage, clearMessage };
};
```

#### `useTaskList.js`

**Purpose**: Task list page logic

**Returns**: `{ tasks, loading, error, message, loadTasks, handleDelete, handleRefresh }`

**State**:

- `tasks` - Array of tasks
- `loading` - Boolean
- `error` - Error message
- `message` - Success message

**Methods**:

- `loadTasks()` - Fetch all tasks
- `handleDelete(id)` - Delete task with confirmation
- `handleRefresh()` - Reload list

**Dependencies**: Uses `useAsync()`, `useMessage()`

#### `useTaskDetails.js`

**Purpose**: Task details page logic

**Parameters**: `taskId` (number)

**Returns**: `{ task, editMode, editData, loading, error, handleEdit, handleSave, handleCancel, handleDelete }`

**State**:

- `task` - Task object
- `editMode` - Boolean
- `editData` - Temporary edit data
- `loading` - Boolean
- `error` - Error message

**Methods**:

- `loadTask(id)` - Fetch task details
- `handleEdit()` - Enter edit mode
- `handleSave()` - Save changes
- `handleCancel()` - Cancel editing
- `handleDelete()` - Delete task

#### `useTaskForm.js`

**Purpose**: Task creation/editing form logic

**Parameters**: `initialData` (object, optional)

**Returns**: `{ formData, errors, loading, handleChange, handleSubmit, resetForm }`

**State**:

- `formData` - { title, description, status }
- `errors` - Validation errors
- `loading` - Submission state

**Methods**:

- `handleChange(e)` - Input change handler
- `handleSubmit(onSubmit)` - Form submission
- `resetForm()` - Reset to initial state

**Validation**: Uses `validation.js` utilities

#### `useTaskSearch.js`

**Purpose**: Task search page logic

**Returns**: `{ filters, results, loading, searched, handleFilterChange, handleSearch, handleClear }`

**State**:

- `filters` - { title, description, status }
- `results` - Array of matching tasks
- `loading` - Boolean
- `searched` - Boolean (has search been executed)

**Methods**:

- `handleFilterChange(e)` - Update filter values
- `handleSearch()` - Execute search
- `handleClear()` - Reset filters

---

### 🔵 Constants (`constants/`)

#### `index.js`

**Purpose**: Application-wide constants

**Constants**:

- `API_BASE_URL` - Backend API URL
- `STATUS_OPTIONS` - Task status options
- `VALIDATION_RULES` - Validation rule constants
- `MESSAGES` - UI message templates
- `ROUTES` - Route path constants

**Example**:

```javascript
export const API_BASE_URL =
  import.meta.env.VITE_API_TARGET || "http://localhost:4000";

export const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

export const VALIDATION_RULES = {
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000,
};

export const MESSAGES = {
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  CONFIRM_DELETE: "Are you sure you want to delete this task?",
};

export const ROUTES = {
  HOME: "/",
  TASK_LIST: "/tasks",
  TASK_CREATE: "/tasks/new",
  TASK_DETAILS: "/tasks/:id",
  TASK_SEARCH: "/tasks/search",
};
```

---

### 🔵 Styles

#### `styles.css`

**Purpose**: Global application styles

**Sections**:

- CSS Reset / Normalize
- CSS Variables (colors, spacing, fonts)
- Layout styles (header, footer, main)
- Component styles
- Utility classes
- Responsive breakpoints

**Key Variables**:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  --status-todo: #3b82f6;
  --status-in-progress: #f59e0b;
  --status-done: #10b981;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
```

**Utility Classes**:

- `.loading` - Loading spinner
- `.error` - Error message styling
- `.success` - Success message styling
- `.status-badge` - Status badge styling
- `.button-primary`, `.button-secondary` - Button styles

---

### 🔵 Configuration Files

#### `index.html`

**Purpose**: HTML entry point

**Features**:

- Meta tags (charset, viewport)
- Title
- Root div (`<div id="root"></div>`)
- Script tag to load `main.jsx`

#### `package.json`

**Purpose**: NPM dependencies and scripts

**Key Scripts**:

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - With coverage
- `npm run test:unit:cat` - Unit tests only
- `npm run test:integration:cat` - Integration tests only
- `npm run test:functional:cat` - Functional tests only
- `npm run test:smoke:cat` - Smoke tests only

**Dependencies**:

- `react`, `react-dom` - Core React
- `react-router-dom` - Routing
- `axios` - HTTP client

**Dev Dependencies**:

- `vite` - Build tool
- `vitest` - Testing framework
- `@testing-library/react` - React testing utilities
- `@testing-library/user-event` - User interaction simulation
- `@testing-library/jest-dom` - DOM matchers
- `jsdom` - DOM implementation for tests
- `@vitejs/plugin-react` - Vite React plugin
- `@vitest/coverage-v8` - Coverage reporting

#### `vite.config.js`

**Purpose**: Vite configuration

**Key Settings**:

- React plugin
- Server port (3000)
- Proxy to backend (/api → http://localhost:4000)
- Build output directory
- Source maps

**Example**:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
```

#### `vitest.config.js`

**Purpose**: Vitest test configuration

**Key Settings**:

- Test environment: jsdom
- Setup files
- Coverage settings
- Test globals

**Example**:

```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      exclude: ["node_modules/", "src/test/"],
    },
  },
});
```

#### `tsconfig.json`

**Purpose**: TypeScript configuration (for IDE support)

**Note**: Project uses JSX, not TypeScript, but config helps with IDE features

---

## 🧪 Testing

### Test Structure

```
src/__tests__/
├── CreateTask.test.jsx                 # Unit tests
├── TaskDetails.test.jsx
├── TaskListView.test.jsx
├── SearchTasks.test.jsx                # Integration tests
├── api.searchTasks.test.jsx
├── api.listTasks.normalize.test.jsx
├── *Flow.test.jsx                      # Functional tests
└── TaskListView.test.jsx               # Smoke tests (critical paths)
```

### Test Categories

| Category        | Count | Focus                 | Tools                     |
| --------------- | ----- | --------------------- | ------------------------- |
| **Unit**        | 15+   | Individual components | React Testing Library     |
| **Integration** | 10+   | Component + API       | MSW for API mocking       |
| **Functional**  | 8+    | Complete workflows    | Full render + user events |
| **Smoke**       | 2     | Critical paths        | Fast validation           |

### Running Tests

```bash
# All tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# With coverage report
npm run test:coverage
# Report: coverage/index.html

# Specific categories
npm run test:unit:cat            # Unit tests
npm run test:integration:cat     # Integration tests
npm run test:functional:cat      # Functional tests
npm run test:smoke:cat           # Smoke tests
```

### Test Utilities

#### `src/test/setup.js`

**Purpose**: Test environment setup

**Features**:

- Configure @testing-library/jest-dom matchers
- Mock browser APIs
- Setup global test utilities
- Configure jsdom environment

**Example**:

```javascript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Auto cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
```

### Example Test

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import TaskListView from "../pages/TaskListView";
import * as api from "../api/tasks";
import { vi } from "vitest";

vi.mock("../api/tasks");

describe("TaskListView", () => {
  it("displays tasks after loading", async () => {
    const mockTasks = [
      { id: 1, title: "Task 1", status: "TODO", description: "Desc 1" },
    ];
    api.listTasks.mockResolvedValue(mockTasks);

    render(
      <BrowserRouter>
        <TaskListView />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });
  });

  it("handles delete action", async () => {
    api.listTasks.mockResolvedValue([
      { id: 1, title: "Task 1", status: "TODO" },
    ]);
    api.deleteTask.mockResolvedValue();

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TaskListView />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Task 1"));

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});
```

---

## 🏗 Build & Deployment

### Development Build

```bash
# Start dev server with HMR
npm run dev

# Access at http://localhost:3000
# Changes auto-reload in browser
```

### Production Build

```bash
# Create optimized production build
npm run build

# Output: dist/ directory
# - Minified JavaScript
# - Optimized CSS
# - Asset hashing for cache busting
# - Source maps (optional)
```

### Build Output

```
dist/
├── index.html                  # Entry HTML
├── assets/
│   ├── index-[hash].js        # Main JS bundle
│   ├── index-[hash].css       # Main CSS bundle
│   └── [asset]-[hash].[ext]   # Images, fonts, etc.
└── favicon.ico
```

### Preview Production Build

```bash
# Serve production build locally
npm run preview

# Access at http://localhost:4173
```

### Deployment

**Static Hosting** (recommended):

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Nginx / Apache

**Build Command**: `npm run build`  
**Output Directory**: `dist`

**Environment Variables**:

```bash
# Set backend API URL
VITE_API_TARGET=https://api.yourdomain.com
```

**Example Nginx Config**:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:4000;
    }
}
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# Backend API URL
VITE_API_TARGET=http://localhost:4000

# Development server port
VITE_PORT=3000

# Auto-open browser
VITE_AUTO_OPEN=0
```

**Access in code**:

```javascript
const apiUrl = import.meta.env.VITE_API_TARGET;
```

### Vite Configuration

See `vite.config.js` for:

- Server port
- Proxy settings
- Build options
- Plugin configuration

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## 🎨 Styling Guidelines

### CSS Architecture

- Use CSS variables for theming
- BEM naming convention for classes
- Mobile-first responsive design
- Semantic HTML elements

### Component Styling

- Co-locate styles when possible
- Use descriptive class names
- Avoid inline styles (except dynamic values)
- Prefer CSS over JavaScript for animations

### Responsive Breakpoints

```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */

@media (max-width: 768px) {
  /* Mobile styles */
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
}

@media (min-width: 1025px) {
  /* Desktop styles */
}
```

---

## 📖 Best Practices

### React Patterns

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components small and focused
- Use proper key props in lists
- Implement error boundaries

### State Management

- Local state for component-specific data
- Lift state up when needed by multiple components
- Use context for deeply nested state (if needed)
- Custom hooks for shared state logic

### Performance

- Use `React.memo()` for expensive components
- Implement proper loading states
- Lazy load routes/components (if needed)
- Optimize images and assets
- Use production builds for deployment

### Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Use proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

---

## 🔍 Troubleshooting

### Common Issues

**Port already in use**:

```bash
# Change port in package.json or:
npm run dev -- --port 3001
```

**API connection errors**:

- Check `VITE_API_TARGET` environment variable
- Verify backend is running on correct port
- Check CORS configuration on backend

**Build failures**:

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

**Test failures**:

```bash
# Clear test cache
npm run test -- --clearCache
```

---

## 📞 Support

For issues or questions:

1. Check [parent README](../README.md)
2. Review test files for usage examples
3. Check browser console for errors

---

**Last Updated**: October 16, 2025  
**Version**: 0.1.0  
**Port**: 3000
