# Frontend Application - React Task Manager

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-purple.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2.4-green.svg)](https://vitest.dev/)

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

**Dependencies**:

- React, ReactDOM
- React Router (BrowserRouter, Routes, Route)
- Models (loadStatuses)
- API (listStatuses)
- All page components
- Header, Footer, ErrorBoundary

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
