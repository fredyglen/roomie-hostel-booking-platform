---
type: "always_apply"
---

# ROOMi Project Guidelines

## MANDATORY CODE ARCHAEOLOGY PROCESS

* ALWAYS analyze the `src/be_conscious/` folder FIRST before writing any code
* Review existing components, hooks, utilities, types, and database schemas in the be_conscious folder
* Map out current patterns, naming conventions, and architectural decisions from existing files
* Identify reusable components and utilities that already exist
* Check for similar functionality that can be extended rather than recreated
* Document any technical debt or inconsistencies found in existing code

## CODEBASE ANALYSIS REQUIREMENTS

* Before implementing any feature, provide a detailed analysis of related existing code
* Identify all files that will be affected by proposed changes
* Check for existing API endpoints, database tables, and component patterns
* Assess potential breaking changes to existing functionality
* Justify why new code is needed vs extending existing code

## ROOMIe-SPECIFIC TECHNICAL STACK

* Use React 18 with TypeScript and Vite for all frontend development
* Implement UI components using shadcn/ui, Tailwind CSS, and Radix UI
* Handle forms with React Hook Form combined with Zod validation
* Manage state using TanStack Query (React Query) for server state
* Use Supabase for backend (PostgreSQL, Auth, Storage, Edge Functions)
* Integrate Paystack for payment processing
* Create charts and analytics using Recharts library
* Implement routing with React Router DOM

## DATABASE AND BACKEND PATTERNS

* Always start with Supabase schema changes before frontend implementation
* Include Row Level Security (RLS) policies for all database tables
* Create proper indexes for query performance
* Use Supabase Edge Functions for complex business logic
* Implement real-time subscriptions where appropriate
* Follow existing database naming conventions from be_conscious folder

## BUSINESS LOGIC REQUIREMENTS

* Implement shared payment system with primary booker concept
* Include student verification workflow for all booking processes
* Support property verification with multi-step approval process
* Implement geo-location based property ranking algorithms
* Create role-based access control for Students, Owners, Agents, Admins
* Handle commission calculations (5% + 100 GHS per booking)

## CODE QUALITY AND ARCHITECTURE

* Write TypeScript interfaces and types for all data structures
* Create reusable custom hooks for common functionality
* Implement proper error boundaries and loading states
* Use consistent naming conventions following existing patterns
* Add comprehensive JSDoc comments for complex functions
* Create modular, testable components with single responsibilities

## IMPLEMENTATION APPROACH

* Prioritize extending existing functionality over creating new isolated features
* Implement database changes first, then frontend components
* Create API contracts that match existing patterns
* Include optimistic updates for better user experience
* Implement progressive enhancement for mobile-first responsive design

## SUPABASE INTEGRATION PATTERNS

* Use Supabase client patterns established in existing code
* Implement proper authentication flows with existing auth setup
* Create type-safe database queries using existing utility patterns
* Handle file uploads using established storage patterns
* Use real-time subscriptions following existing subscription patterns

## FRONTEND COMPONENT PATTERNS

* Follow existing component structure and organization from be_conscious folder
* Use established prop patterns and component composition
* Implement consistent loading states and error handling
* Create reusable form components with Zod validation
* Use existing utility functions and custom hooks where applicable

## TESTING AND VALIDATION

* Write unit tests using Vitest and Testing Library following existing patterns
* Create integration tests for complex user flows
* Test database operations with proper cleanup
* Validate form inputs using existing Zod schemas
* Include edge case testing for payment and booking flows

## DEPLOYMENT AND INFRASTRUCTURE

* Follow existing environment variable patterns
* Use established build and deployment configurations
* Maintain consistency with existing CI/CD processes
* Document any new environment variables or configuration changes

## CRITICAL SAFETY RULES

* Never skip the code archaeology phase - always review be_conscious folder first
* Flag potential security issues immediately, especially for payment and auth flows
* Warn about breaking changes and provide migration strategies
* Explain business impact of technical decisions
* Include rollback plans for database schema changes

## DATABASE MIGRATION PROTOCOL (MANDATORY - NEVER SKIP)

**BEFORE ANY DATABASE MIGRATION OR SCHEMA CHANGE:**

1. **STOP AND VERIFY** - Create schema verification SQL queries for:
   - Table existence check
   - Column names and data types
   - Foreign key constraints
   - Existing RLS policies

2. **WAIT FOR USER** - Have user run verification queries in Supabase SQL Editor and provide ACTUAL output

3. **DOCUMENT FINDINGS** - Create analysis file showing:
   - What exists in database (tables, columns, constraints)
   - What needs to be created
   - Potential conflicts or naming issues
   - All dependencies

4. **USE EXACT NAMES** - Use EXACT column/table names from actual database output (e.g., `properties.id` not `property_id`)

5. **NEVER ASSUME** - If you don't have actual database output proving something exists/doesn't exist, STOP and ask user to verify

6. **CHECK FOR DUPLICATES** - Before creating tables, verify they don't already exist with different structure

**CRITICAL MISTAKES TO AVOID:**
- ❌ Creating migrations based on assumptions about schema
- ❌ Removing dependencies thinking they don't exist without checking
- ❌ Creating duplicate tables that conflict with existing ones
- ❌ Using wrong column names (check actual schema first)
- ❌ Rushing to "fix" things without understanding current state
-    

**See DATABASE_MIGRATION_PROTOCOL.md for complete protocol.**

**This protocol exists because an AI agent nearly destroyed the production database by making assumptions instead of checking the actual schema. DO NOT SKIP THIS PROTOCOL.**

## OUTPUT FORMAT REQUIREMENTS

* Start every response with analysis of existing code from be_conscious folder
* Provide clear justification for chosen implementation approach
* Include both database and frontend changes in parallel
* Document integration points and data flow
* Explain testing strategy and validation approach

## DOCUMENTATION STANDARDS

* Update existing documentation when modifying features
* Create clear README sections for new functionality
* Document API endpoints and database schema changes
* Include setup instructions for new dependencies
* Provide troubleshooting guides for common issues