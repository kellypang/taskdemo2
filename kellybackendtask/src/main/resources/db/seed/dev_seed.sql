-- Enhanced Development seed data for comprehensive system testing
-- Safe to re-run: includes TRUNCATE for clean state
-- Clean slate for consistent testing
TRUNCATE TABLE public.task RESTART IDENTITY CASCADE;
-- =============================================================================
-- SECTION 1: Core Basic Tasks (Original Set - 10 tasks)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'Draft Spec',
    'Initial specification draft',
    'NEW',
    now() + interval '2 day',
    1001
  ),
  (
    'Data Import',
    'Import legacy dataset',
    'PENDING',
    now() + interval '5 day',
    1002
  ),
  (
    'Process Payments',
    'Handle queued payment jobs',
    'IN_PROGRESS',
    now() + interval '1 day',
    1003
  ),
  (
    'User Onboarding',
    'Automate onboarding flow',
    'COMPLETED',
    now() - interval '1 day',
    1004
  ),
  (
    'Security Review',
    'Perform security assessment',
    'APPROVED',
    now() + interval '7 day',
    1005
  ),
  (
    'Decommission Legacy',
    'Remove old service',
    'CANCELLED',
    now() - interval '5 day',
    1006
  ),
  (
    'Overdue Cleanup',
    'Clear out old sessions',
    'IN_PROGRESS',
    now() - interval '2 day',
    1007
  ),
  (
    'Near Deadline Report',
    'Generate monthly report',
    'PENDING',
    now() + interval '6 hour',
    1008
  ),
  (
    'Completed Hotfix',
    'Apply hotfix patch',
    'COMPLETED',
    now() - interval '3 hour',
    1009
  ),
  (
    'Approval Queue',
    'Tasks awaiting approval',
    'PENDING',
    now() + interval '3 day',
    1010
  );
-- =============================================================================
-- SECTION 2: Extended Edge Cases & Special Scenarios (26 tasks)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'Zero Day Migration',
    'Execute immediate migration task',
    'NEW',
    now() + interval '10 minute',
    1011
  ),
  (
    'Ref Data Sync',
    'Synchronize reference data feed',
    'PENDING',
    now() + interval '12 hour',
    1012
  ),
  (
    'Nightly Batch Cycle',
    'Process nightly ETL',
    'IN_PROGRESS',
    now() + interval '8 hour',
    1013
  ),
  (
    'Stale Session Purge',
    'Cleanup task executed successfully',
    'COMPLETED',
    now() - interval '10 day',
    1014
  ),
  (
    'Architecture Review',
    'Awaiting architecture board approval',
    'APPROVED',
    now() + interval '14 day',
    1015
  ),
  (
    'Rollback Deprecated API',
    'Canceled due to new direction',
    'CANCELLED',
    now() - interval '15 day',
    1016
  ),
  (
    'Null DueDate Example',
    'Record without due date for null handling',
    'NEW',
    NULL,
    1017
  ),
  (
    'Historical Audit',
    'Very old archived style task',
    'COMPLETED',
    now() - interval '120 day',
    1018
  ),
  (
    'Future Planning',
    'Long range planning placeholder',
    'PENDING',
    now() + interval '90 day',
    1019
  ),
  (
    'Edge Low TaskNum',
    'Boundary test low number',
    'IN_PROGRESS',
    now() + interval '30 minute',
    1
  ),
  (
    'Edge High TaskNum',
    'Boundary test high-ish number',
    'APPROVED',
    now() + interval '365 day',
    99999
  ),
  (
    'Duplicate Title Scenario',
    'First variant pending',
    'PENDING',
    now() + interval '4 day',
    1020
  ),
  (
    'Duplicate Title Scenario',
    'Second variant in progress',
    'IN_PROGRESS',
    now() + interval '5 day',
    1021
  ),
  (
    'Duplicate Title Scenario',
    'Completed variant for history',
    'COMPLETED',
    now() - interval '2 day',
    1022
  ),
  (
    'Pagination Cluster A',
    'Clustered for pagination tests',
    'NEW',
    now() + interval '1 day',
    1101
  ),
  (
    'Pagination Cluster B',
    'Clustered for pagination tests',
    'NEW',
    now() + interval '1 day',
    1102
  ),
  (
    'Pagination Cluster C',
    'Clustered for pagination tests',
    'NEW',
    now() + interval '1 day',
    1103
  ),
  (
    'Pagination Cluster D',
    'Clustered for pagination tests',
    'NEW',
    now() + interval '1 day',
    1104
  ),
  (
    'No Description Sample',
    NULL,
    'PENDING',
    now() + interval '2 day',
    1023
  ),
  (
    'Immediate Execution',
    'Due right now',
    'IN_PROGRESS',
    now(),
    1024
  ),
  (
    'Overdue Critical',
    'Should surface in overdue filter',
    'PENDING',
    now() - interval '3 day',
    1025
  ),
  (
    'Recently Completed',
    'Completed moments ago',
    'COMPLETED',
    now() - interval '5 minute',
    1026
  ),
  (
    'Awaiting Sign-off',
    'Approval pending on release',
    'APPROVED',
    now() + interval '2 day',
    1027
  ),
  (
    'Cancelled Rollout',
    'Change rollout aborted',
    'CANCELLED',
    now() - interval '1 hour',
    1028
  ),
  (
    'Processing Queue',
    'Currently processing items',
    'IN_PROGRESS',
    now() - interval '30 minute',
    1029
  ),
  (
    'Mass Import',
    'Large import job in backlog',
    'PENDING',
    now() + interval '18 hour',
    1030
  );
-- =============================================================================
-- SECTION 3: API Integration Testing (20 tasks)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'API Gateway Setup',
    'Configure API gateway for microservices',
    'NEW',
    now() + interval '3 day',
    2001
  ),
  (
    'OAuth Integration',
    'Implement OAuth 2.0 authentication flow',
    'IN_PROGRESS',
    now() + interval '4 day',
    2002
  ),
  (
    'REST Endpoint Validation',
    'Validate all REST endpoints for compliance',
    'PENDING',
    now() + interval '6 day',
    2003
  ),
  (
    'GraphQL Migration',
    'Migrate legacy REST to GraphQL',
    'APPROVED',
    now() + interval '15 day',
    2004
  ),
  (
    'Webhook Handler',
    'Create webhook event processing system',
    'IN_PROGRESS',
    now() + interval '2 day',
    2005
  ),
  (
    'Rate Limiting Implementation',
    'Add rate limiting to public APIs',
    'NEW',
    now() + interval '5 day',
    2006
  ),
  (
    'API Documentation',
    'Generate OpenAPI 3.0 documentation',
    'COMPLETED',
    now() - interval '2 day',
    2007
  ),
  (
    'API Versioning Strategy',
    'Define API versioning approach',
    'APPROVED',
    now() + interval '10 day',
    2008
  ),
  (
    'Legacy API Deprecation',
    'Deprecate v1 API endpoints',
    'CANCELLED',
    now() - interval '3 day',
    2009
  ),
  (
    'CORS Configuration',
    'Update CORS policies for new domains',
    'PENDING',
    now() + interval '1 day',
    2010
  ),
  (
    'API Monitoring Dashboard',
    'Build real-time API monitoring',
    'IN_PROGRESS',
    now() + interval '7 day',
    2011
  ),
  (
    'API Load Testing',
    'Perform stress testing on API endpoints',
    'NEW',
    now() + interval '8 day',
    2012
  ),
  (
    'API Security Audit',
    'Conduct security audit of all APIs',
    'APPROVED',
    now() + interval '12 day',
    2013
  ),
  (
    'API Error Handling',
    'Standardize error response formats',
    'COMPLETED',
    now() - interval '5 day',
    2014
  ),
  (
    'API Caching Layer',
    'Implement Redis caching for APIs',
    'IN_PROGRESS',
    now() + interval '3 day',
    2015
  ),
  (
    'API Analytics',
    'Track API usage analytics',
    'PENDING',
    now() + interval '9 day',
    2016
  ),
  (
    'Third-party API Integration',
    'Integrate with external payment API',
    'NEW',
    now() + interval '11 day',
    2017
  ),
  (
    'API SDK Generation',
    'Generate client SDKs for major languages',
    'APPROVED',
    now() + interval '20 day',
    2018
  ),
  (
    'API Throttling',
    'Implement intelligent request throttling',
    'PENDING',
    now() + interval '4 day',
    2019
  ),
  (
    'API Health Checks',
    'Add health check endpoints',
    'COMPLETED',
    now() - interval '1 day',
    2020
  );
-- =============================================================================
-- SECTION 4: Database & DevOps Tasks (20 tasks)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'Database Migration',
    'Migrate from MySQL to PostgreSQL',
    'IN_PROGRESS',
    now() + interval '10 day',
    3001
  ),
  (
    'Index Optimization',
    'Optimize database indexes for performance',
    'NEW',
    now() + interval '5 day',
    3002
  ),
  (
    'Backup Strategy',
    'Implement automated backup solution',
    'APPROVED',
    now() + interval '7 day',
    3003
  ),
  (
    'Query Performance Tuning',
    'Optimize slow-running queries',
    'IN_PROGRESS',
    now() + interval '3 day',
    3004
  ),
  (
    'Database Replication',
    'Set up master-slave replication',
    'PENDING',
    now() + interval '14 day',
    3005
  ),
  (
    'Data Archival',
    'Archive old transaction records',
    'NEW',
    now() + interval '21 day',
    3006
  ),
  (
    'Schema Versioning',
    'Implement Flyway for schema migrations',
    'COMPLETED',
    now() - interval '7 day',
    3007
  ),
  (
    'Database Security Hardening',
    'Apply security best practices',
    'APPROVED',
    now() + interval '9 day',
    3008
  ),
  (
    'Connection Pool Tuning',
    'Optimize HikariCP settings',
    'COMPLETED',
    now() - interval '4 day',
    3009
  ),
  (
    'Database Monitoring',
    'Set up Prometheus monitoring for DB',
    'IN_PROGRESS',
    now() + interval '6 day',
    3010
  ),
  (
    'CI/CD Pipeline Setup',
    'Configure Jenkins pipeline',
    'PENDING',
    now() + interval '8 day',
    3011
  ),
  (
    'Docker Containerization',
    'Containerize all microservices',
    'IN_PROGRESS',
    now() + interval '12 day',
    3012
  ),
  (
    'Kubernetes Deployment',
    'Deploy application to K8s cluster',
    'NEW',
    now() + interval '15 day',
    3013
  ),
  (
    'Infrastructure as Code',
    'Migrate to Terraform for IaC',
    'APPROVED',
    now() + interval '18 day',
    3014
  ),
  (
    'Log Aggregation',
    'Set up ELK stack for log management',
    'IN_PROGRESS',
    now() + interval '5 day',
    3015
  ),
  (
    'Secrets Management',
    'Implement HashiCorp Vault',
    'PENDING',
    now() + interval '11 day',
    3016
  ),
  (
    'Auto-scaling Configuration',
    'Configure horizontal pod autoscaling',
    'NEW',
    now() + interval '13 day',
    3017
  ),
  (
    'Disaster Recovery Plan',
    'Create and test DR procedures',
    'APPROVED',
    now() + interval '25 day',
    3018
  ),
  (
    'Blue-Green Deployment',
    'Implement zero-downtime deployments',
    'COMPLETED',
    now() - interval '6 day',
    3019
  ),
  (
    'Infrastructure Monitoring',
    'Set up Grafana dashboards',
    'IN_PROGRESS',
    now() + interval '4 day',
    3020
  );
-- =============================================================================
-- SECTION 5: Frontend & UI Tasks (20 tasks)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'React Component Library',
    'Build reusable component library',
    'IN_PROGRESS',
    now() + interval '10 day',
    4001
  ),
  (
    'Responsive Design',
    'Make application mobile-responsive',
    'NEW',
    now() + interval '7 day',
    4002
  ),
  (
    'Accessibility Audit',
    'WCAG 2.1 AA compliance audit',
    'APPROVED',
    now() + interval '12 day',
    4003
  ),
  (
    'Performance Optimization',
    'Optimize React rendering performance',
    'IN_PROGRESS',
    now() + interval '5 day',
    4004
  ),
  (
    'State Management',
    'Migrate from Redux to Zustand',
    'PENDING',
    now() + interval '14 day',
    4005
  ),
  (
    'Dark Mode Implementation',
    'Add dark mode theme support',
    'NEW',
    now() + interval '8 day',
    4006
  ),
  (
    'Form Validation',
    'Implement comprehensive form validation',
    'COMPLETED',
    now() - interval '3 day',
    4007
  ),
  (
    'Internationalization',
    'Add i18n support for 5 languages',
    'APPROVED',
    now() + interval '20 day',
    4008
  ),
  (
    'PWA Conversion',
    'Convert to Progressive Web App',
    'IN_PROGRESS',
    now() + interval '15 day',
    4009
  ),
  (
    'UI Testing',
    'Write Cypress E2E tests for critical flows',
    'PENDING',
    now() + interval '9 day',
    4010
  ),
  (
    'Design System',
    'Create comprehensive design system',
    'NEW',
    now() + interval '30 day',
    4011
  ),
  (
    'Animation Effects',
    'Add smooth transitions and animations',
    'IN_PROGRESS',
    now() + interval '6 day',
    4012
  ),
  (
    'Error Boundary',
    'Implement error boundaries for components',
    'COMPLETED',
    now() - interval '2 day',
    4013
  ),
  (
    'Code Splitting',
    'Implement route-based code splitting',
    'APPROVED',
    now() + interval '11 day',
    4014
  ),
  (
    'SEO Optimization',
    'Optimize for search engines',
    'PENDING',
    now() + interval '13 day',
    4015
  ),
  (
    'Image Optimization',
    'Implement lazy loading and WebP format',
    'NEW',
    now() + interval '5 day',
    4016
  ),
  (
    'Bundle Size Reduction',
    'Reduce JavaScript bundle size by 30%',
    'IN_PROGRESS',
    now() + interval '7 day',
    4017
  ),
  (
    'Browser Compatibility',
    'Test and fix IE11 compatibility',
    'CANCELLED',
    now() - interval '10 day',
    4018
  ),
  (
    'Storybook Documentation',
    'Document all components in Storybook',
    'APPROVED',
    now() + interval '16 day',
    4019
  ),
  (
    'User Analytics',
    'Integrate Google Analytics 4',
    'COMPLETED',
    now() - interval '8 day',
    4020
  );
-- =============================================================================
-- SECTION 6: Testing & Quality Assurance (15 tasks)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'Unit Test Coverage',
    'Achieve 80% code coverage',
    'IN_PROGRESS',
    now() + interval '10 day',
    5001
  ),
  (
    'Integration Testing',
    'Write integration tests for API layer',
    'NEW',
    now() + interval '12 day',
    5002
  ),
  (
    'E2E Test Suite',
    'Create comprehensive E2E test suite',
    'APPROVED',
    now() + interval '15 day',
    5003
  ),
  (
    'Performance Testing',
    'Load test with 10K concurrent users',
    'PENDING',
    now() + interval '8 day',
    5004
  ),
  (
    'Security Testing',
    'OWASP ZAP security scan',
    'IN_PROGRESS',
    now() + interval '6 day',
    5005
  ),
  (
    'Regression Testing',
    'Automated regression test suite',
    'NEW',
    now() + interval '9 day',
    5006
  ),
  (
    'API Contract Testing',
    'Implement Pact for contract tests',
    'APPROVED',
    now() + interval '14 day',
    5007
  ),
  (
    'Accessibility Testing',
    'Automated accessibility testing with axe',
    'COMPLETED',
    now() - interval '4 day',
    5008
  ),
  (
    'Smoke Test Suite',
    'Quick smoke tests for deployments',
    'COMPLETED',
    now() - interval '2 day',
    5009
  ),
  (
    'Mutation Testing',
    'Add mutation testing with Pitest',
    'PENDING',
    now() + interval '18 day',
    5010
  ),
  (
    'Visual Regression Testing',
    'Implement Percy for visual testing',
    'NEW',
    now() + interval '11 day',
    5011
  ),
  (
    'Test Data Management',
    'Create test data generation framework',
    'IN_PROGRESS',
    now() + interval '7 day',
    5012
  ),
  (
    'Chaos Engineering',
    'Implement chaos monkey testing',
    'APPROVED',
    now() + interval '21 day',
    5013
  ),
  (
    'Mobile Testing',
    'Test on iOS and Android devices',
    'PENDING',
    now() + interval '10 day',
    5014
  ),
  (
    'Code Quality Gates',
    'Configure SonarQube quality gates',
    'COMPLETED',
    now() - interval '5 day',
    5015
  );
-- =============================================================================
-- SECTION 7: Overdue & Critical Priority (10 tasks)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'Critical Bug Fix',
    'Fix production-blocking bug URGENT',
    'IN_PROGRESS',
    now() - interval '1 day',
    6001
  ),
  (
    'Security Patch',
    'Apply critical security update',
    'PENDING',
    now() - interval '2 day',
    6002
  ),
  (
    'Data Corruption Fix',
    'Repair corrupted customer records',
    'IN_PROGRESS',
    now() - interval '12 hour',
    6003
  ),
  (
    'Payment Gateway Down',
    'Restore payment processing',
    'NEW',
    now() - interval '6 hour',
    6004
  ),
  (
    'Database Deadlock',
    'Resolve recurring deadlock issue',
    'IN_PROGRESS',
    now() - interval '3 day',
    6005
  ),
  (
    'Memory Leak Investigation',
    'Find and fix memory leak in production',
    'PENDING',
    now() - interval '18 hour',
    6006
  ),
  (
    'API Timeout Issues',
    'Fix timeout errors on checkout API',
    'IN_PROGRESS',
    now() - interval '4 day',
    6007
  ),
  (
    'Authentication Failure',
    'Users cannot log in - CRITICAL',
    'NEW',
    now() - interval '2 hour',
    6008
  ),
  (
    'Data Loss Prevention',
    'Backup critical data immediately',
    'APPROVED',
    now() - interval '1 day',
    6009
  ),
  (
    'Service Outage Recovery',
    'Restore failed service cluster',
    'IN_PROGRESS',
    now() - interval '30 minute',
    6010
  );
-- =============================================================================
-- SECTION 8: Search & Filter Testing (15 tasks with specific keywords)
-- =============================================================================
INSERT INTO public.task (title, description, status, duedate, tasknum)
VALUES (
    'Search Algorithm Optimization',
    'Improve search algorithm efficiency using elasticsearch',
    'NEW',
    now() + interval '5 day',
    7001
  ),
  (
    'Search Feature Enhancement',
    'Add advanced search filters and facets',
    'PENDING',
    now() + interval '7 day',
    7002
  ),
  (
    'Filter Implementation',
    'Create multi-criteria filter system',
    'IN_PROGRESS',
    now() + interval '4 day',
    7003
  ),
  (
    'Payment Processing System',
    'Build new payment gateway integration',
    'APPROVED',
    now() + interval '12 day',
    7004
  ),
  (
    'Payment Security',
    'Enhance payment transaction security',
    'NEW',
    now() + interval '10 day',
    7005
  ),
  (
    'Report Generation',
    'Automated monthly report generation',
    'PENDING',
    now() + interval '6 day',
    7006
  ),
  (
    'Report Dashboard',
    'Create interactive reporting dashboard',
    'IN_PROGRESS',
    now() + interval '8 day',
    7007
  ),
  (
    'Migration Tool',
    'Build data migration utility tool',
    'COMPLETED',
    now() - interval '3 day',
    7008
  ),
  (
    'Migration Verification',
    'Verify all migrated data integrity',
    'APPROVED',
    now() + interval '9 day',
    7009
  ),
  (
    'Review Process Automation',
    'Automate code review workflows',
    'NEW',
    now() + interval '11 day',
    7010
  ),
  (
    'Review Guidelines',
    'Update code review guidelines and standards',
    'PENDING',
    now() + interval '5 day',
    7011
  ),
  (
    'Testing Framework',
    'Upgrade testing framework to latest version',
    'IN_PROGRESS',
    now() + interval '6 day',
    7012
  ),
  (
    'Testing Best Practices',
    'Document testing best practices guide',
    'COMPLETED',
    now() - interval '1 day',
    7013
  ),
  (
    'Optimization Study',
    'Performance optimization research and analysis',
    'APPROVED',
    now() + interval '15 day',
    7014
  ),
  (
    'Optimization Implementation',
    'Apply identified optimization improvements',
    'PENDING',
    now() + interval '13 day',
    7015
  );