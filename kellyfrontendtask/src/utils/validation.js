/**
 * Shared validation utilities for task forms.
 * Provides consistent validation across CreateTask and TaskDetails components.
 */

/**
 * Validates a task object and returns an object with validation errors.
 *
 * @param {Object} task - The task object to validate
 * @param {string} task.title - Task title
 * @param {string} task.status - Task status
 * @param {string} task.dueDate - Task due date (ISO format)
 * @param {string} [task.description] - Optional task description
 * @returns {Object} Object with field names as keys and error messages as values
 */
export function validateTask(task) {
  const errors = {}

  // Title validation
  if (!task.title || !task.title.trim()) {
    errors.title = 'Title is required'
  } else if (task.title.length > 200) {
    errors.title = 'Title must be less than 200 characters'
  } else if (task.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long'
  }

  // Status validation
  if (!task.status) {
    errors.status = 'Status is required'
  }

  // Due date validation
  if (!task.dueDate) {
    errors.dueDate = 'Due date is required'
  } else {
    const dueDate = new Date(task.dueDate)
    const now = new Date()
    
    // Check if date is valid
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = 'Invalid date format'
    } else if (dueDate < now) {
      errors.dueDate = 'Due date must be in the future'
    }
  }

  // Description validation (optional, but with max length)
  if (task.description && task.description.length > 500) {
    errors.description = 'Description must be less than 500 characters'
  }

  return errors
}

/**
 * Checks if an errors object contains any validation errors.
 *
 * @param {Object} errors - The errors object to check
 * @returns {boolean} True if there are any errors, false otherwise
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}

/**
 * Validates a single field and returns the error message if invalid.
 *
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value of the field
 * @param {Object} task - Full task object for context-dependent validation
 * @returns {string|null} Error message or null if valid
 */
export function validateField(fieldName, value, task = {}) {
  const tempTask = { ...task, [fieldName]: value }
  const errors = validateTask(tempTask)
  return errors[fieldName] || null
}

/**
 * Sanitizes user input by trimming whitespace and removing control characters.
 *
 * @param {string} value - The value to sanitize
 * @returns {string} Sanitized value
 */
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value
  // Remove control characters and trim
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim()
}

/**
 * Validates status transition (client-side validation to match backend rules).
 *
 * @param {string} fromStatus - Current status
 * @param {string} toStatus - Target status
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateStatusTransition(fromStatus, toStatus) {
  const validTransitions = {
    NEW: ['PENDING', 'IN_PROGRESS', 'CANCELLED'],
    PENDING: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    COMPLETED: ['APPROVED'],
    APPROVED: [], // Terminal state
    CANCELLED: [] // Terminal state
  }

  if (fromStatus === toStatus) {
    return { valid: true, error: null }
  }

  const allowed = validTransitions[fromStatus] || []
  if (!allowed.includes(toStatus)) {
    return {
      valid: false,
      error: `Cannot transition from ${fromStatus} to ${toStatus}. Allowed transitions: ${
        allowed.length > 0 ? allowed.join(', ') : 'none (terminal state)'
      }`
    }
  }

  return { valid: true, error: null }
}
