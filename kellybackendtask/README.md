# Backend Service - Spring Boot Task API

## 🏗 Architecture Overview

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
