package uk.gov.hmcts.reform.dev.constants;

/**
 * Centralized constants for the Task Management application.
 *
 * <p>This class contains all magic strings, business rule values, and configuration constants used
 * throughout the application. Centralizing these values makes them easier to maintain and modify.
 */
public final class TaskConstants {

  private TaskConstants() {
    // Prevent instantiation
  }

  // ============================================================
  // Error Messages
  // ============================================================
  public static final String TASK_NOT_FOUND = "Task not found with id %d";
  public static final String TASK_DELETED_SUCCESS = "Task deleted successfully.";
  public static final String DATABASE_WRITE_ERROR = "Failed to save task to the database.";

  // ============================================================
  // Validation Messages
  // ============================================================
  public static final String TITLE_REQUIRED = "Title is required";
  public static final String STATUS_REQUIRED = "Status is required";
  public static final String DUE_DATE_REQUIRED = "Due date is required";
  public static final String DUE_DATE_FUTURE = "Due date must be in the future";

  // ============================================================
  // Business Rule Values
  // ============================================================
  public static final int MAX_TITLE_LENGTH = 100;
  public static final int MAX_DESCRIPTION_LENGTH = 200;
  public static final long MAX_DUE_DATE_YEARS = 2;

  // ============================================================
  // CORS Configuration
  // ============================================================
  public static final String[] CORS_ALLOWED_ORIGINS = {
    "http://localhost:3000", "http://localhost:3001"
  };

  // ============================================================
  // API Paths
  // ============================================================
  public static final String API_TASKS_PATH = "/api/tasks";
  public static final String API_MAPPING_PATTERN = "/api/**";
}
