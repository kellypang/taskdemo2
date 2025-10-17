# Backend Service - Spring Boot Task API

A comprehensive REST API for task management built with Spring Boot 3.5.5 and Java 21, following clean architecture principles and enterprise best practices.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Testing](#testing)
- [API Documentation](#api-documentation)

---

## 🏗 Architecture Overview

The backend follows a **layered clean architecture** pattern:

```
Controller Layer → Service Layer → Repository Layer → Database
     ↓                  ↓               ↓
   DTOs            Business Logic    JPA Entities
```

### Design Principles

- ✅ **Separation of Concerns** - Each layer has distinct responsibilities
- ✅ **Dependency Injection** - Constructor-based DI throughout
- ✅ **SOLID Principles** - Single responsibility, open/closed, etc.
- ✅ **DRY** - Reusable helper methods and constants
- ✅ **Fail-Fast** - Validation at API boundaries
- ✅ **Explicit Error Handling** - Custom exceptions with global handler

---

## 📁 Project Structure

```
kellybackendtask/
├── src/
│   ├── main/
│   │   ├── java/uk/gov/hmcts/reform/dev/
│   │   │   ├── Application.java           # Spring Boot entry point
│   │   │   ├── controllers/               # REST API endpoints
│   │   │   ├── service/                   # Business logic
│   │   │   ├── repository/                # Data access
│   │   │   ├── entity/                    # JPA entities
│   │   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── mapper/                    # DTO ↔ Entity mapping
│   │   │   ├── exception/                 # Custom exceptions
│   │   │   ├── constants/                 # Application constants
│   │   │   ├── config/                    # Spring configuration
│   │   │   └── models/                    # Domain enums
│   │   └── resources/
│   │       ├── application.yml            # Spring configuration
│   │       └── db/migration/              # Flyway migrations
│   ├── test/java/                         # Unit tests
│   ├── integrationTest/java/              # Integration tests
│   ├── functionalTest/java/               # Functional tests
│   ├── smokeTest/java/                    # Smoke tests
│   └── e2eTest/java/                      # E2E tests
├── build.gradle                           # Build configuration
├── gradle.properties                      # Gradle properties
└── README.md                              # This file
```

---

## 🔧 Core Components

### 1. Application Entry Point

#### `Application.java`

**Package:** `uk.gov.hmcts.reform.dev`  
**Purpose:** Spring Boot application main class  
**Responsibilities:**

- Bootstrap Spring application context
- Enable component scanning
- Auto-configuration trigger point

**Key Annotations:**

- `@SpringBootApplication` - Enables Spring Boot auto-configuration

---

### 2. Controller Layer (REST API)

Controllers handle HTTP requests, validate input, and return appropriate responses.

#### `TaskController.java`

**Package:** `uk.gov.hmcts.reform.dev.controllers`  
**Path:** `/api/tasks`  
**Purpose:** Main REST API for task management

**Endpoints:**

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update existing task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/search` - Search tasks with filters

**Query Parameters (Search):**

- `title` - Filter by title (partial match)
- `description` - Filter by description (partial match)
- `status` - Filter by status (exact match)
- `dueBefore` - Filter tasks due before date
- `dueAfter` - Filter tasks due after date

**Request/Response:**

- Accepts: `application/json`
- Returns: `application/json`
- Uses: `TaskRequest` (input), `TaskResponse` (output)

**Key Features:**

- OpenAPI/Swagger documentation
- Request validation with `@Valid`
- CORS enabled for localhost:3000, localhost:3001
- Comprehensive error responses

---

#### `InfoController.java`

**Package:** `uk.gov.hmcts.reform.dev.controllers`  
**Path:** `/api/info`  
**Purpose:** Operational information endpoint

**Endpoints:**

- `GET /api/info` - Application runtime information

**Returns:**

- Application name
- Active Spring profiles
- Default profile
- Database product name
- Sanitized JDBC URL (credentials removed)

**Use Cases:**

- Health checks during deployment
- Environment verification
- Debugging database connections

---

#### `RootController.java`

**Package:** `uk.gov.hmcts.reform.dev.controllers`  
**Path:** `/`  
**Purpose:** Simple welcome endpoint

**Endpoints:**

- `GET /` - Welcome message

**Returns:**

- Plain text: "Welcome to test-backend"

**Use Cases:**

- Quick smoke test
- Verify application started
- Load balancer health checks

---

### 3. Service Layer (Business Logic)

#### `TaskService.java`

**Package:** `uk.gov.hmcts.reform.dev.service`  
**Purpose:** Core business logic for task operations

**Methods:**

| Method                          | Parameters        | Returns              | Description           |
| ------------------------------- | ----------------- | -------------------- | --------------------- |
| `getAllTasks()`                 | -                 | `List<TaskResponse>` | Retrieve all tasks    |
| `getTaskById(Long)`             | `id`              | `TaskResponse`       | Get single task by ID |
| `createTask(TaskRequest)`       | `taskRequest`     | `TaskResponse`       | Create new task       |
| `updateTask(Long, TaskRequest)` | `id, taskRequest` | `TaskResponse`       | Update existing task  |
| `deleteTask(Long)`              | `id`              | `void`               | Delete task by ID     |
| `searchTasks(...)`              | Multiple filters  | `List<TaskResponse>` | Advanced search       |

**Key Features:**

- Transaction management (via `@Service`)
- DTO ↔ Entity conversion via `TaskMapper`
- Exception handling with custom exceptions
- Logging for debugging
- Business rule validation

**Exception Handling:**

- Throws `ResourceNotFoundException` when task not found
- Throws `DatabaseWriteException` on persistence errors
- Wraps database exceptions with user-friendly messages

**Search Capabilities:**

- Title filtering (case-insensitive, partial match)
- Description filtering (case-insensitive, partial match)
- Status filtering (exact match)
- Due date range filtering
- Multiple criteria combination using JPA Specifications

---

### 4. Repository Layer (Data Access)

#### `TaskRepository.java`

**Package:** `uk.gov.hmcts.reform.dev.repository`  
**Interface:** `JpaRepository<TaskEntity, Long>`, `JpaSpecificationExecutor<TaskEntity>`

**Purpose:** Database operations for tasks

**Inherited Methods:**

- `findAll()` - Get all tasks
- `findById(Long)` - Get task by ID
- `save(TaskEntity)` - Create or update task
- `deleteById(Long)` - Delete task by ID
- `existsById(Long)` - Check if task exists
- `count()` - Count total tasks

**Specification Support:**

- `findAll(Specification<TaskEntity>)` - Query with dynamic criteria
- Enables complex queries without writing JPQL/SQL

**Key Features:**

- Spring Data JPA repository
- Automatic query generation
- Transaction management
- Pagination support (if needed)

---

#### `TaskSpecifications.java`

**Package:** `uk.gov.hmcts.reform.dev.repository`  
**Purpose:** Dynamic query building using JPA Specifications

**Methods:**

| Method                   | Parameters    | Returns                     | Description                             |
| ------------------------ | ------------- | --------------------------- | --------------------------------------- |
| `hasTitle(String)`       | `title`       | `Specification<TaskEntity>` | Filter by title (case-insensitive LIKE) |
| `hasDescription(String)` | `description` | `Specification<TaskEntity>` | Filter by description (contains)        |
| `hasStatus(Status)`      | `status`      | `Specification<TaskEntity>` | Filter by exact status                  |
| `dueBefore(LocalDate)`   | `date`        | `Specification<TaskEntity>` | Tasks due before date                   |
| `dueAfter(LocalDate)`    | `date`        | `Specification<TaskEntity>` | Tasks due after date                    |

**Usage Pattern:**

```java
Specification<TaskEntity> spec = Specification
    .where(TaskSpecifications.hasTitle("meeting"))
    .and(TaskSpecifications.hasStatus(Status.TODO))
    .and(TaskSpecifications.dueAfter(LocalDate.now()));

List<TaskEntity> results = taskRepository.findAll(spec);
```

**Key Features:**

- Type-safe query building
- Null-safe (returns null spec if parameter is null)
- Composable (use `.and()`, `.or()`)
- Avoids SQL injection
- Cleaner than Criteria API

---

### 5. Entity Layer (Domain Model)

#### `TaskEntity.java`

**Package:** `uk.gov.hmcts.reform.dev.entity`  
**Table:** `task`  
**Purpose:** JPA entity representing a task in the database

**Fields:**

| Field         | Type            | Constraints                        | Description                     |
| ------------- | --------------- | ---------------------------------- | ------------------------------- |
| `id`          | `Long`          | `@Id`, `@GeneratedValue`           | Primary key (auto-increment)    |
| `title`       | `String`        | `@Column(nullable=false)`          | Task title (required)           |
| `description` | `String`        | `@Column(columnDefinition="TEXT")` | Detailed description (optional) |
| `status`      | `Status`        | `@Enumerated(EnumType.STRING)`     | Task status enum                |
| `dueDate`     | `LocalDate`     | -                                  | Task due date (optional)        |
| `createdAt`   | `LocalDateTime` | `@Column(nullable=false)`          | Creation timestamp              |
| `updatedAt`   | `LocalDateTime` | -                                  | Last update timestamp           |

**Annotations:**

- `@Entity` - Marks as JPA entity
- `@Table(name = "task")` - Maps to database table
- `@Id` - Primary key
- `@GeneratedValue(strategy = IDENTITY)` - Auto-increment ID
- `@Enumerated(EnumType.STRING)` - Store enum as string in DB

**Key Features:**

- Automatic timestamp management in service layer
- PostgreSQL enum type mapping
- Lombok annotations for boilerplate reduction (if used)

---

### 6. DTO Layer (Data Transfer Objects)

DTOs decouple the API contract from internal domain models.

#### `TaskRequest.java`

**Package:** `uk.gov.hmcts.reform.dev.dto.request`  
**Purpose:** Request payload for creating/updating tasks

**Fields:**

| Field         | Type        | Validation  | Description                            |
| ------------- | ----------- | ----------- | -------------------------------------- |
| `title`       | `String`    | `@NotBlank` | Task title (required)                  |
| `description` | `String`    | -           | Task description (optional)            |
| `status`      | `Status`    | -           | Task status (defaults to TODO if null) |
| `dueDate`     | `LocalDate` | -           | Due date (optional)                    |

**Validation Rules:**

- `@NotBlank` on title - cannot be null, empty, or whitespace
- Uses Jakarta Bean Validation
- Validated automatically via `@Valid` in controllers

**Example JSON:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README files",
  "status": "TODO",
  "dueDate": "2025-10-20"
}
```

---

#### `TaskResponse.java`

**Package:** `uk.gov.hmcts.reform.dev.dto.response`  
**Purpose:** Response payload for task data

**Fields:**

| Field         | Type            | Description           |
| ------------- | --------------- | --------------------- |
| `id`          | `Long`          | Task ID               |
| `title`       | `String`        | Task title            |
| `description` | `String`        | Task description      |
| `status`      | `Status`        | Task status           |
| `dueDate`     | `LocalDate`     | Due date              |
| `createdAt`   | `LocalDateTime` | Creation timestamp    |
| `updatedAt`   | `LocalDateTime` | Last update timestamp |

**Key Features:**

- Read-only representation
- Includes all entity fields
- Used for all API responses (list, get, create, update)

**Example JSON:**

```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive README files",
  "status": "IN_PROGRESS",
  "dueDate": "2025-10-20",
  "createdAt": "2025-10-15T10:30:00",
  "updatedAt": "2025-10-16T14:45:00"
}
```

---

### 7. Mapper Layer

#### `TaskMapper.java`

**Package:** `uk.gov.hmcts.reform.dev.mapper`  
**Purpose:** Convert between entities and DTOs

**Methods:**

| Method                   | Input         | Output         | Description                |
| ------------------------ | ------------- | -------------- | -------------------------- |
| `toEntity(TaskRequest)`  | `TaskRequest` | `TaskEntity`   | Convert request to entity  |
| `toResponse(TaskEntity)` | `TaskEntity`  | `TaskResponse` | Convert entity to response |

**Key Features:**

- Manual mapping (no MapStruct/ModelMapper for simplicity)
- Handles null values gracefully
- Sets timestamps during entity creation
- Default status handling (null → TODO)

**Usage:**

```java
TaskEntity entity = taskMapper.toEntity(request);
TaskResponse response = taskMapper.toResponse(entity);
```

---

### 8. Exception Layer

#### `GlobalExceptionHandler.java`

**Package:** `uk.gov.hmcts.reform.dev.exception`  
**Purpose:** Centralized exception handling for all controllers

**Handled Exceptions:**

| Exception                         | HTTP Status               | Response            |
| --------------------------------- | ------------------------- | ------------------- |
| `ResourceNotFoundException`       | 404 NOT FOUND             | Error message       |
| `DatabaseWriteException`          | 500 INTERNAL SERVER ERROR | Error message       |
| `MethodArgumentNotValidException` | 400 BAD REQUEST           | Validation errors   |
| `HttpMessageNotReadableException` | 400 BAD REQUEST           | "Malformed request" |
| `Exception` (catch-all)           | 500 INTERNAL SERVER ERROR | Generic error       |

**Annotations:**

- `@ControllerAdvice` - Global exception handler
- `@ExceptionHandler` - Maps exception to handler method

**Response Format:**

```json
{
  "timestamp": "2025-10-16T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Task not found with id: 123",
  "path": "/api/tasks/123"
}
```

---

#### `ResourceNotFoundException.java`

**Package:** `uk.gov.hmcts.reform.dev.exception`  
**Extends:** `RuntimeException`  
**Purpose:** Thrown when a requested resource doesn't exist

**Usage:**

```java
throw new ResourceNotFoundException("Task not found with id: " + id);
```

**HTTP Status:** 404 NOT FOUND

---

#### `DatabaseWriteException.java`

**Package:** `uk.gov.hmcts.reform.dev.exception`  
**Extends:** `RuntimeException`  
**Purpose:** Thrown when database write operations fail

**Usage:**

```java
throw new DatabaseWriteException("Failed to save task", cause);
```

**HTTP Status:** 500 INTERNAL SERVER ERROR

---

### 9. Constants

#### `TaskConstants.java`

**Package:** `uk.gov.hmcts.reform.dev.constants`  
**Purpose:** Centralized application constants

**Constants:**

| Constant               | Value                          | Usage                        |
| ---------------------- | ------------------------------ | ---------------------------- |
| `API_TASKS_PATH`       | `"/api/tasks"`                 | Base path for TaskController |
| `ERROR_TASK_NOT_FOUND` | `"Task not found with id: %d"` | Error message template       |
| `ERROR_DATABASE_WRITE` | `"Failed to save task"`        | Database error message       |

**Benefits:**

- Single source of truth for constants
- Easy to update values
- Prevents typos and inconsistencies
- Supports internationalization (future)

---

### 10. Configuration

#### `WebConfig.java`

**Package:** `uk.gov.hmcts.reform.dev.config`  
**Purpose:** Web layer configuration

**Configurations:**

- CORS settings (if not using controller-level `@CrossOrigin`)
- Custom message converters
- Interceptors
- Argument resolvers

**Key Annotations:**

- `@Configuration` - Spring configuration class
- `@EnableWebMvc` - Enable Spring MVC (if needed)

---

### 11. Models

#### `Status.java`

**Package:** `uk.gov.hmcts.reform.dev.models`  
**Type:** Enum  
**Purpose:** Task status values

**Values:**

- `TODO` - Task not started
- `IN_PROGRESS` - Task in progress
- `DONE` - Task completed

**Database Mapping:**

- Stored as `VARCHAR` in PostgreSQL
- Maps to PostgreSQL enum type via custom type
- `@Enumerated(EnumType.STRING)` in entity

**Usage:**

```java
TaskEntity task = new TaskEntity();
task.setStatus(Status.TODO);
```

---

## 🛠 Technology Stack

### Core Framework

- **Java 21** - Modern Java with latest features
- **Spring Boot 3.5.5** - Application framework
- **Spring Web** - REST API support
- **Spring Data JPA** - Database abstraction
- **Spring Validation** - Bean validation

### Database

- **PostgreSQL 15** - Production database
- **H2 Database** - Development/testing
- **Flyway** - Database migrations
- **HikariCP** - Connection pooling

### Testing

- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing
- **Testcontainers** - Containerized testing
- **AssertJ** - Fluent assertions
- **RestAssured** - API testing

### Build & Quality

- **Gradle 8.11.1** - Build automation
- **Spotless** - Code formatting
- **Checkstyle** - Code quality
- **JaCoCo** - Code coverage
- **OWASP Dependency Check** - Security scanning

### Documentation

- **OpenAPI 3** - API specification
- **Swagger UI** - Interactive API docs
- **Javadoc** - Code documentation

---

## 🚀 Quick Start

### Prerequisites

- Java 21
- Gradle 8.11.1 (or use wrapper)
- PostgreSQL 15+ (for production mode)

### Development Mode (H2 Database)

```bash
# Run with in-memory H2 database
./gradlew bootRun

# Access points:
# - API: http://localhost:4000/api/tasks
# - Swagger: http://localhost:4000/swagger-ui
# - H2 Console: http://localhost:4000/h2-console
```

### Production Mode (PostgreSQL)

```bash
# Set environment variables
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskdb
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres

# Run application
./gradlew bootRun

# Or build and run JAR
./gradlew bootJar
java -jar build/libs/kellybackendtask-0.0.1.jar
```

### Using Development Database (Docker Compose)

```bash
# Start PostgreSQL container (from root directory)
sh scripts/dev-db.sh

# Run with devdb profile
./gradlew bootRun -Dspring.profiles.active=devdb

# Seed with sample data
sh scripts/dev-db-seed.sh
```

---

## 🧪 Testing

### Test Structure

The project has **5 levels of testing**:

| Type            | Location                   | Purpose                        | Database                  |
| --------------- | -------------------------- | ------------------------------ | ------------------------- |
| **Unit**        | `src/test/java`            | Test individual classes        | None/Mocks                |
| **Integration** | `src/integrationTest/java` | Test component integration     | Testcontainers PostgreSQL |
| **Functional**  | `src/functionalTest/java`  | Test API workflows             | H2 in-memory              |
| **Smoke**       | `src/smokeTest/java`       | Quick critical path validation | H2 in-memory              |
| **E2E**         | `src/e2eTest/java`         | Full system testing            | Testcontainers PostgreSQL |

### Run Tests

```bash
# All tests
./gradlew test integrationTest functionalTest smokeTest e2e

# Individual test suites
./gradlew test                  # Unit tests
./gradlew integrationTest       # Integration tests
./gradlew functionalTest        # Functional tests
./gradlew smokeTest            # Smoke tests
./gradlew e2e                  # E2E tests

# With coverage report
./gradlew test jacocoTestReport
# Open: build/reports/jacoco/test/html/index.html
```

### Test Examples

**Unit Test:**

```java
@Test
void createTask_shouldReturnTaskResponse() {
    TaskRequest request = new TaskRequest("Test", "Description", Status.TODO, null);
    TaskEntity entity = new TaskEntity(/* ... */);

    when(taskMapper.toEntity(request)).thenReturn(entity);
    when(taskRepository.save(entity)).thenReturn(entity);

    TaskResponse response = taskService.createTask(request);

    assertThat(response).isNotNull();
    verify(taskRepository).save(entity);
}
```

**Integration Test:**

```java
@SpringBootTest
@Testcontainers
class TaskControllerIntegrationTest {
    @Test
    void shouldCreateAndRetrieveTask() {
        // Test with real database
    }
}
```

---

## 📚 API Documentation

### Swagger UI

Interactive API documentation available at:

- **Local:** http://localhost:4000/swagger-ui
- **OpenAPI JSON:** http://localhost:4000/openapi

### Generate OpenAPI Spec

```bash
# From root directory
sh scripts/generate-openapi.sh

# Output: docs/openapi.json
```

### API Examples

See the [root README.md](../README.md#api-documentation) for complete API examples.

---

## 🔧 Configuration Files

### `application.yml`

Main Spring Boot configuration file with profiles:

- `default` - Default settings
- `dev` - H2 database for development
- `devdb` - PostgreSQL for development
- `test` - H2 for testing
- `e2e` - Testcontainers for E2E tests

### `build.gradle`

Build configuration with:

- Dependencies management
- Source sets for different test types
- Code quality plugins
- Test configuration

### `gradle.properties`

Gradle properties:

- JVM arguments
- Gradle daemon settings
- Build optimizations

---

## 📝 Code Quality

### Formatting

```bash
# Check formatting
./gradlew spotlessCheck

# Apply formatting
./gradlew spotlessApply
```

### Static Analysis

```bash
# Checkstyle
./gradlew checkstyleMain checkstyleTest

# All quality checks
./gradlew check
```

### Security Scanning

```bash
# OWASP dependency check
./gradlew dependencyCheckAnalyze

# Report: build/reports/dependency-check-report.html
```

---

## 🚢 Build & Deployment

### Build JAR

```bash
# Build executable JAR
./gradlew bootJar

# Output: build/libs/kellybackendtask-0.0.1.jar
```

### Run Built JAR

```bash
java -jar build/libs/kellybackendtask-0.0.1.jar
```

### Environment Variables

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password

# Server
SERVER_PORT=4000

# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# JVM Options
JAVA_OPTS="-Xmx512m -Xms256m"
```

---

## 🤝 Contributing

### Code Style

- Follow existing patterns (controller → service → repository)
- Use helper methods to avoid duplication
- Add constants to `TaskConstants` instead of magic strings
- Write comprehensive Javadoc comments
- Include unit and integration tests

### Testing

- Write unit tests for all service methods
- Add integration tests for database operations
- Include functional tests for new API endpoints
- Update smoke tests for critical paths

### Documentation

- Update OpenAPI annotations for API changes
- Add Javadoc for all public methods
- Update README for significant changes

---

**Last Updated:** October 16, 2025  
**Version:** 0.0.1  
**Port:** 4000  
**Base Path:** `/api/tasks`
