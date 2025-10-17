# Full-Stack Task Management System (DTS1)

A production-ready full-stack task management application with comprehensive testing, built with Spring Boot (backend) and React (frontend).

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Documentation](#documentation)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

DTS1 is a full-stack task management system designed with enterprise-grade patterns and comprehensive test coverage. The application demonstrates:

- **Clean Architecture** with clear separation of concerns
- **RESTful API** following best practices
- **Comprehensive Testing** (unit, integration, functional, smoke, E2E)
- **Database Migrations** with Flyway
- **Containerized Development** with Docker Compose
- **Automated Testing** with Testcontainers
- **Code Quality Tools** (Spotless, Checkstyle, OWASP)
- **API Documentation** with OpenAPI/Swagger

### 📸 Application Screenshots

![Task Management Dashboard](./tasks-dashboard.png)
_Task Management Dashboard - View and manage all your tasks with real-time status updates_

---

## ✨ Features

### Task Management

- ✅ Create, read, update, and delete tasks
- ✅ Advanced search with multiple filters (title, description, status)
- ✅ Task status management (TODO, IN_PROGRESS, DONE)
- ✅ Real-time validation and error handling
- ✅ Optimistic UI updates

### Developer Experience

- 🚀 Fast development with hot reload (Vite + Spring DevTools)
- 🐳 Containerized development environment (Alpine Linux)
- 📝 Comprehensive test suites with multiple levels
- 📊 Test coverage reporting (JaCoCo + Vitest)
- 🔍 Code quality enforcement (Spotless, Checkstyle)
- 📚 Interactive API documentation (Swagger UI)
- 🎯 Unified build and test scripts

---

## 🛠 Technology Stack

### Backend (kellybackendtask)

- **Java 21** with modern language features
- **Spring Boot 3.5.5** (Web, Data JPA, Validation)
- **PostgreSQL** for production, **H2** for development
- **Flyway** for database migrations
- **Gradle 8.11.1** for build automation
- **Testcontainers** for E2E testing with real PostgreSQL
- **OpenAPI 3** for API documentation

### Frontend (kellyfrontendtask)

- **React 18.2** with hooks
- **React Router 6** for navigation
- **Vite 7** for fast builds and HMR
- **Axios** for API communication
- **Vitest** for testing
- **Testing Library** for React component testing

### Development Tools

- **Docker** & **Docker Compose** for containerization
- **Alpine Linux 3.22** as base image
- **Spotless** for code formatting
- **Checkstyle** for code quality
- **JaCoCo** for Java coverage
- **Vitest Coverage** for frontend coverage
- **OWASP Dependency Check** for security scanning

---

## 🚀 Quick Start

### Prerequisites

- Docker (for dev container environment)
- Or: Java 21, Node.js 18+, PostgreSQL 15+ (for local development)

### Option 1: Dev Container (Recommended)

1. **Open in VS Code with Dev Containers extension:**

   ```bash
   # VS Code will detect .devcontainer and offer to reopen in container
   # Or use Command Palette: "Dev Containers: Reopen in Container"
   ```

2. **Install dependencies:**

   ```bash
   npm run deps:install
   # or
   sh scripts/install-all-deps.sh
   ```

3. **Start development database:**

   ```bash
   sh scripts/dev-db.sh
   ```

4. **Build everything:**

   ```bash
   npm run build:all
   # or
   sh ./build-all.sh
   ```

5. **Run the application:**

   ```bash
   # Terminal 1: Backend (port 4000)
   cd kellybackendtask
   ./gradlew bootRun -Dspring.profiles.active=devdb

   # Terminal 2: Frontend (port 3000)
   cd kellyfrontendtask
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api/tasks
   - API Documentation: http://localhost:4000/swagger-ui
   - API Info: http://localhost:4000/api/info

### Option 2: Local Development

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd DTS1
   ```

2. **Start PostgreSQL:**

   ```bash
   sudo docker compose -f docker-compose.dev-db.yml up -d
   ```

3. **Install dependencies and build:**

   ```bash
   npm run deps:install
   npm run build:all
   ```

4. **Run the applications** (same as dev container step 5)

---

## 📁 Project Structure

```
DTS1/
├── kellybackendtask/              # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/uk/gov/hmcts/reform/dev/
│   │   │   │   ├── Application.java       # Main entry point
│   │   │   │   ├── controllers/           # REST endpoints
│   │   │   │   │   ├── TaskController.java
│   │   │   │   │   ├── InfoController.java
│   │   │   │   │   └── RootController.java
│   │   │   │   ├── service/               # Business logic
│   │   │   │   │   └── TaskService.java
│   │   │   │   ├── repository/            # Data access
│   │   │   │   │   ├── TaskRepository.java
│   │   │   │   │   └── TaskSpecifications.java
│   │   │   │   ├── entity/                # JPA entities
│   │   │   │   │   └── TaskEntity.java
│   │   │   │   ├── dto/                   # Data Transfer Objects
│   │   │   │   │   ├── request/TaskRequest.java
│   │   │   │   │   └── response/TaskResponse.java
│   │   │   │   ├── mapper/                # DTO ↔ Entity mapping
│   │   │   │   │   └── TaskMapper.java
│   │   │   │   ├── exception/             # Error handling
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   ├── constants/             # Constants
│   │   │   │   │   └── TaskConstants.java
│   │   │   │   ├── config/                # Configuration
│   │   │   │   │   └── WebConfig.java
│   │   │   │   └── models/                # Domain enums
│   │   │   │       └── Status.java
│   │   │   └── resources/
│   │   │       ├── db/migration/          # Flyway migrations
│   │   │       │   ├── V1__Create_task_table.sql
│   │   │       │   └── V2__Add_task_status.sql
│   │   │       └── application.yml        # Spring configuration
│   │   ├── test/java/                     # Unit tests
│   │   ├── integrationTest/java/          # Integration tests (Testcontainers)
│   │   ├── functionalTest/java/           # Functional/API tests
│   │   ├── smokeTest/java/                # Smoke tests
│   │   └── e2eTest/java/                  # E2E tests (Testcontainers)
│   ├── build.gradle                       # Build configuration
│   └── gradle.properties                  # Gradle properties
│
├── kellyfrontendtask/                     # React frontend
│   ├── src/
│   │   ├── main.jsx                       # Application entry point
│   │   ├── styles.css                     # Global styles
│   │   ├── pages/                         # Route components
│   │   │   ├── TaskListView.jsx           # List all tasks
│   │   │   ├── CreateTask.jsx             # Create new task
│   │   │   ├── TaskDetails.jsx            # View/edit task
│   │   │   └── SearchTasks.jsx            # Search tasks
│   │   ├── components/                    # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── api/                           # API client
│   │   │   └── tasks.js
│   │   ├── models/                        # Domain models
│   │   │   └── task.js
│   │   ├── utils/                         # Utilities
│   │   └── __tests__/                     # Test files
│   │       ├── CreateTask.test.jsx        # Unit tests
│   │       ├── TaskListView.test.jsx
│   │       ├── SearchTasks.test.jsx       # Integration tests
│   │       └── *Flow.test.jsx             # Functional tests
│   ├── package.json                       # NPM dependencies
│   ├── vite.config.js                     # Vite configuration
│   └── vitest.config.js                   # Vitest configuration
│
├── scripts/                               # Utility scripts
│   ├── dev-db.sh                          # Start dev database
│   ├── dev-db-seed.sh                     # Seed database
│   ├── db-apply-schema.js                 # Apply migrations
│   ├── install-all-deps.sh                # Install all dependencies
│   ├── cleanup-utils.sh                   # Cleanup utilities
│   ├── memory-utils.sh                    # Memory management
│   ├── timeout-config.sh                  # Timeout configuration
│   ├── spotless-utils.sh                  # Code formatting
│   ├── unified-log-indexer.js             # Log indexing
│   ├── unified-test-logger.js             # Test logging
│   └── serve-reports.js                   # Serve test reports
│
├── .devcontainer/                         # Dev container configuration
│   ├── devcontainer.json                  # VS Code dev container config
│   └── Dockerfile                         # Alpine Linux container
│
├── build-all.sh                           # Unified build script
├── test-all.sh                            # Unified test orchestrator
├── e2e.sh                                 # E2E test runner
├── docker-compose.dev-db.yml              # Development database
├── docker-compose.db.yml                  # Test database
├── package.json                           # Root NPM scripts
├── Makefile                               # Make targets
└── README.md                              # This file
```

---

## 💻 Development

### Build Commands

```bash
# Build everything (backend + frontend, all tests)
npm run build:all
sh ./build-all.sh

# Build backend only
npm run build:backend
sh ./build-all.sh backend

# Build frontend only
npm run build:frontend
sh ./build-all.sh frontend

# Install all dependencies
npm run deps:install
sh scripts/install-all-deps.sh
```

### Backend Development

```bash
cd kellybackendtask

# Run with H2 (in-memory, no external database)
./gradlew bootRun

# Run with PostgreSQL
./gradlew bootRun -Dspring.profiles.active=devdb

# Run tests
./gradlew test                    # Unit tests
./gradlew integrationTest         # Integration tests
./gradlew functionalTest          # Functional tests
./gradlew smokeTest              # Smoke tests
./gradlew e2e                    # E2E tests (Testcontainers)

# Code quality
./gradlew check                  # All quality checks
./gradlew spotlessApply          # Format code
./gradlew checkstyleMain         # Checkstyle
./gradlew dependencyCheckAnalyze # Security scan

# Generate coverage report
./gradlew test jacocoTestReport
# Open: build/reports/jacoco/test/html/index.html
```

### Frontend Development

```bash
cd kellyfrontendtask

# Development server (hot reload)
npm run dev                      # Port 3000

# Build for production
npm run build

# Run tests
npm test                         # All tests
npm run test:watch               # Watch mode
npm run test:coverage            # With coverage

# Test categories
npm run test:unit:cat            # Unit tests only
npm run test:integration:cat     # Integration tests
npm run test:functional:cat      # Functional tests
npm run test:smoke:cat           # Smoke tests
```

---

## 🧪 Testing

This project has **comprehensive test coverage** with multiple test levels:

### Test Categories

| Category        | Backend      | Frontend     | Purpose                                 |
| --------------- | ------------ | ------------ | --------------------------------------- |
| **Unit**        | ✅ 20+ tests | ✅ 15+ tests | Test individual components in isolation |
| **Integration** | ✅ 15+ tests | ✅ 10+ tests | Test component interaction              |
| **Functional**  | ✅ 8+ tests  | ✅ 8+ tests  | Test complete workflows                 |
| **Smoke**       | ✅ 3 tests   | ✅ 2 tests   | Quick validation of critical paths      |
| **E2E**         | ✅ 5 tests   | N/A          | Full system with real PostgreSQL        |

### Run All Tests

```bash
# Run ALL tests (backend + frontend)
npm run test:all
sh ./test-all.sh

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend

# Run E2E tests only
sh ./e2e.sh
```

### Run Specific Test Categories

```bash
# Backend specific categories
npm run test:backend:unit
npm run test:backend:integration
npm run test:backend:functional
npm run test:backend:smoke

# Frontend specific categories
npm run test:frontend:unit
npm run test:frontend:integration
npm run test:frontend:smoke
```

### E2E Testing with Testcontainers

The E2E tests use **Testcontainers** to automatically:

1. Pull `postgres:16-alpine` Docker image (if not cached)
2. Start PostgreSQL container with random port
3. Run Flyway migrations
4. Execute tests against real PostgreSQL
5. Clean up container after tests

**No manual database setup required!**

```bash
# Run E2E tests
sh ./e2e.sh

# Or via Gradle (backend directory)
cd kellybackendtask
./gradlew e2e
```

### Test Reports

```bash
# Serve all test reports on port 8080
npm run reports:serve

# Generate unified test logs
npm run logs:index:test

# Access reports:
# - Backend coverage: http://localhost:8080/build-logs/
# - Frontend coverage: http://localhost:8080/kellyfrontendtask/coverage/
# - Test logs: http://localhost:8080/test-logs/
```

---

## 📚 API Documentation

### OpenAPI/Swagger

The backend provides interactive API documentation:

- **Swagger UI**: http://localhost:4000/swagger-ui
- **OpenAPI JSON**: http://localhost:4000/openapi

### Generate OpenAPI Spec

```bash
# Generate docs/openapi.json
sh scripts/generate-openapi.sh

# Or via package.json
npm run build:openapi
```

### Key Endpoints

| Method   | Endpoint            | Description      |
| -------- | ------------------- | ---------------- |
| `GET`    | `/`                 | Welcome message  |
| `GET`    | `/api/info`         | Application info |
| `GET`    | `/api/tasks`        | List all tasks   |
| `POST`   | `/api/tasks`        | Create task      |
| `GET`    | `/api/tasks/{id}`   | Get task by ID   |
| `PUT`    | `/api/tasks/{id}`   | Update task      |
| `DELETE` | `/api/tasks/{id}`   | Delete task      |
| `GET`    | `/api/tasks/search` | Search tasks     |

### API Request Examples

```bash
# List tasks
curl http://localhost:4000/api/tasks

# Create task
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Description","status":"TODO"}'

# Search tasks
curl "http://localhost:4000/api/tasks/search?title=test&status=TODO"

# Update task
curl -X PUT http://localhost:4000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"New description","status":"DONE"}'

# Delete task
curl -X DELETE http://localhost:4000/api/tasks/1
```

---

## 🗄 Database

### Development Database

```bash
# Start PostgreSQL container
sh scripts/dev-db.sh

# Seed with sample data
sh scripts/dev-db-seed.sh

# Apply migrations manually
npm run db:apply-schema
```

**Connection Details:**

- Host: `localhost`
- Port: `55432` (configurable via `PG_HOST_PORT`)
- Database: `devdb`
- Username: `devuser`
- Password: `devpass`

### Database Migrations

Migrations are managed with **Flyway** and located in:

```
kellybackendtask/src/main/resources/db/migration/
```

**Migration naming:** `V{version}__{description}.sql`

Example:

- `V1__Create_task_table.sql`
- `V2__Add_task_status.sql`

Migrations run automatically on application startup.

### Access Database

```bash
# Using docker exec
sudo docker exec -it dts-dev-postgres psql -U devuser -d devdb

# Using psql (if installed locally)
psql -h localhost -p 55432 -U devuser -d devdb
```

---

## 🔧 Scripts

The project includes comprehensive utility scripts:

### Main Scripts

| Script         | Description                |
| -------------- | -------------------------- |
| `build-all.sh` | Unified build orchestrator |
| `test-all.sh`  | Comprehensive test runner  |
| `e2e.sh`       | E2E test orchestrator      |

### Utility Scripts (`scripts/`)

| Script                   | Description                     |
| ------------------------ | ------------------------------- |
| `install-all-deps.sh`    | Install backend & frontend deps |
| `dev-db.sh`              | Start development PostgreSQL    |
| `dev-db-seed.sh`         | Seed database with sample data  |
| `db-apply-schema.js`     | Apply Flyway migrations         |
| `cleanup-utils.sh`       | Database cleanup utilities      |
| `memory-utils.sh`        | Memory management helpers       |
| `timeout-config.sh`      | Timeout configurations          |
| `spotless-utils.sh`      | Code formatting utilities       |
| `serve-reports.js`       | Serve test reports (port 8080)  |
| `unified-log-indexer.js` | Index and organize logs         |
| `unified-test-logger.js` | Centralized test logging        |
| `generate-openapi.sh`    | Generate OpenAPI docs           |

### Script Usage Examples

```bash
# Build with verbose output
sh ./build-all.sh --verbose

# Build backend only
sh ./build-all.sh backend

# Run tests with coverage
npm run test:coverage

# Serve reports
npm run reports:serve
```

---

## ⚙️ Configuration

### Environment Variables

**Backend:**

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:55432/devdb
SPRING_DATASOURCE_USERNAME=devuser
SPRING_DATASOURCE_PASSWORD=devpass

# Spring Profile
SPRING_PROFILES_ACTIVE=dev  # or: devdb, test, e2e

# Server Port
SERVER_PORT=4000
```

**Frontend:**

```bash
# API Configuration
VITE_API_TARGET=http://localhost:4000
VITE_PORT=3000
VITE_AUTO_OPEN=0  # Set to 1 to auto-open browser
```

### Spring Profiles

| Profile | Database       | Use Case                          |
| ------- | -------------- | --------------------------------- |
| `dev`   | H2 in-memory   | Quick development, no external DB |
| `devdb` | PostgreSQL     | Development with persistent DB    |
| `test`  | H2 in-memory   | Unit/functional tests             |
| `e2e`   | Testcontainers | E2E tests with real PostgreSQL    |

### Docker Compose Files

| File                        | Purpose                | Port  |
| --------------------------- | ---------------------- | ----- |
| `docker-compose.dev-db.yml` | Development PostgreSQL | 55432 |
| `docker-compose.db.yml`     | Test PostgreSQL        | 5432  |

---

## 🔍 Troubleshooting

### Common Issues

**1. Port Already in Use**

```bash
# Check what's using the port
lsof -i :4000  # Backend
lsof -i :3000  # Frontend
lsof -i :55432 # Database

# Kill the process
kill -9 <PID>
```

**2. Database Connection Issues**

```bash
# Check if database is running
sudo docker ps | grep postgres

# Restart database
sh scripts/dev-db.sh

# Check database logs
sudo docker logs dts-dev-postgres
```

**3. Build Failures**

```bash
# Clean and rebuild backend
cd kellybackendtask
./gradlew clean build --no-daemon

# Clean and rebuild frontend
cd kellyfrontendtask
rm -rf node_modules dist
npm install
npm run build
```

**4. Test Failures**

```bash
# Run with verbose logging
sh ./test-all.sh --verbose

# Check test logs
ls -la test-logs/
cat test-logs/backend-unit-*.log

# Serve reports for detailed analysis
npm run reports:serve
```

**5. Docker Permission Issues**

```bash
# Fix docker socket permissions
sudo chmod 666 /var/run/docker.sock

# Or add user to docker group (requires logout/login)
sudo usermod -aG docker $USER
```

**6. Memory Issues**

```bash
# Check available memory
free -h

# Set conservative Gradle options
export GRADLE_OPTS="-Xmx1g -XX:MaxMetaspaceSize=512m"

# Run with memory-aware settings
FAST_TEST=1 sh ./test-all.sh
```

### Debug Mode

```bash
# Enable debug output
E2E_DEBUG=1 sh ./e2e.sh

# Backend with debug logging
./gradlew bootRun --debug -Dlogging.level.root=DEBUG

# Frontend with verbose errors
npm run dev -- --debug
```

### Clean Everything

```bash
# Remove all build artifacts and caches
make clean  # If Makefile exists

# Or manually:
rm -rf build-logs test-logs
rm -rf kellybackendtask/build
rm -rf kellyfrontendtask/dist kellyfrontendtask/node_modules
sudo docker compose -f docker-compose.dev-db.yml down -v
```

---

## 📝 Code Quality

### Automated Checks

The project enforces code quality through:

- ✅ **Spotless** - Automated code formatting
- ✅ **Checkstyle** - Code style validation
- ✅ **Compiler Warnings** - Treated as errors
- ✅ **OWASP Dependency Check** - Security vulnerability scanning
- ✅ **JaCoCo** - Code coverage reporting
- ✅ **ESLint** - Frontend code quality (if configured)

### Running Quality Checks

```bash
# Backend
cd kellybackendtask
./gradlew check                   # All checks
./gradlew spotlessApply           # Auto-format
./gradlew checkstyleMain          # Style check
./gradlew dependencyCheckAnalyze  # Security scan

# Frontend
cd kellyfrontendtask
npm run typecheck                 # TypeScript checks
npm run test:coverage             # Coverage report
```

---

## 🚢 Production Deployment

### Build for Production

```bash
# Build both backend and frontend
sh ./build-all.sh

# Backend JAR location
ls -lh kellybackendtask/build/libs/*.jar

# Frontend static files
ls -lh kellyfrontendtask/dist/
```

### Run Production Build

```bash
# Backend (requires PostgreSQL)
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-host:5432/taskdb
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=secure_password
java -jar kellybackendtask/build/libs/kellybackendtask-0.0.1.jar

# Frontend (serve static files)
# Use nginx, Apache, or any static file server
# Point to: kellyfrontendtask/dist/
```

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**

   ```bash
   sh ./build-all.sh
   sh ./test-all.sh
   ```

3. **Format code**

   ```bash
   cd kellybackendtask
   ./gradlew spotlessApply
   ```

4. **Commit with clear messages**

   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Run all checks before pushing**
   ```bash
   sh ./test-all.sh
   cd kellybackendtask && ./gradlew check
   ```

### Code Style

- Follow existing patterns and conventions
- Write comprehensive tests for new features
- Add Javadoc for public methods (backend)
- Update README for significant changes
- Use helper methods to avoid duplication

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Kelly Pang** - Initial work and maintenance

---

## 📞 Support

For issues, questions, or contributions:

1. Check existing [documentation](docs/)
2. Review [troubleshooting](#troubleshooting) section
3. Search existing issues on GitHub
4. Create a new issue with detailed information

---

## 🎉 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the robust UI library
- Testcontainers for simplified integration testing
- HMCTS for Java plugin and best practices
- All contributors and maintainers

---

**Last Updated:** October 16, 2025  
**Version:** 0.0.1  
**Repository:** DTS1
