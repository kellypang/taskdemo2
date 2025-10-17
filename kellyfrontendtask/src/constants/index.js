/**
 * Application Constants
 * Centralized constants to eliminate magic strings and improve maintainability
 */

// API Configuration
export const API_BASE_URL = import.meta?.env?.VITE_API_BASE || '/api'
export const API_ENDPOINTS = {
  TASKS: '/tasks',
  SEARCH: '/tasks/search',
  TASK_BY_ID: (id) => `/tasks/${id}`,
  TASK_STATUS: (id) => `/tasks/${id}/status`,
}

// Task Status Values
export const TASK_STATUS = {
  NEW: 'NEW',
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
}

// Status Display Labels
export const STATUS_LABELS = {
  [TASK_STATUS.NEW]: 'New',
  [TASK_STATUS.PENDING]: 'Pending',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
  [TASK_STATUS.APPROVED]: 'Approved',
  [TASK_STATUS.CANCELLED]: 'Cancelled',
}

// Status Color Classes
export const STATUS_COLORS = {
  [TASK_STATUS.NEW]: 'status-new',
  [TASK_STATUS.PENDING]: 'status-pending',
  [TASK_STATUS.IN_PROGRESS]: 'status-in-progress',
  [TASK_STATUS.COMPLETED]: 'status-completed',
  [TASK_STATUS.APPROVED]: 'status-approved',
  [TASK_STATUS.CANCELLED]: 'status-cancelled',
}

// Routes
export const ROUTES = {
  HOME: '/',
  TASKS: '/tasks',
  NEW_TASK: '/tasks/new',
  TASK_DETAILS: (id) => `/tasks/${id}`,
  EDIT_TASK: (id) => `/tasks/${id}/edit`,
  SEARCH: '/tasks/search',
}

// Messages
export const MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  STATUS_UPDATED: (status) => `Task status updated to ${STATUS_LABELS[status]}`,
  LOAD_ERROR: 'Failed to load tasks',
  CREATE_ERROR: 'Failed to create task',
  UPDATE_ERROR: 'Failed to update task',
  DELETE_ERROR: 'Failed to delete task',
  NETWORK_ERROR: 'Network error - please check your connection',
}

// Validation
export const VALIDATION = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 200,
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_LONG: `Title must be ${100} characters or less`,
  DESCRIPTION_TOO_LONG: `Description must be ${200} characters or less`,
  DUE_DATE_PAST: 'Due date must be in the future',
}

// Date Formats
export const DATE_FORMAT = {
  INPUT: 'YYYY-MM-DDTHH:mm',
  DISPLAY: 'MMM D, YYYY h:mm A',
  SHORT: 'MMM D, YYYY',
}

// UI Constants
export const UI = {
  DEFAULT_PAGE_SIZE: 20,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
}
