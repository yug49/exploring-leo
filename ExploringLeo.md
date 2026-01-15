# Exploring Leo - Complete Development Guide

> A comprehensive guide to building "Exploring Leo" — an interactive web-based tutorial for learning the Leo programming language, inspired by "A Tour of Go".

**Important**: This document contains all context needed to understand and build this project. If you are an AI assistant reading this, you now have the full background of what we are building and why.

---

## Table of Contents

1. [Background Context](#1-background-context)
2. [What is Leo](#2-what-is-leo)
3. [What is "A Tour of Go"](#3-what-is-a-tour-of-go)
4. [What is "Exploring Leo"](#4-what-is-exploring-leo)
5. [Architecture Decision](#5-architecture-decision)
6. [Technology Stack](#6-technology-stack)
7. [Project Structure](#7-project-structure)
8. [Development Phases](#8-development-phases)
9. [Lesson Content System](#9-lesson-content-system)
10. [Leo Language Curriculum](#10-leo-language-curriculum)
11. [Key External Resources](#11-key-external-resources)
12. [Development Checklist](#12-development-checklist)

---

## 1. Background Context

### The Problem We Are Solving

Learning a new programming language can be challenging, especially one as specialized as Leo which is designed for zero-knowledge applications. Currently, developers who want to learn Leo must piece together information from documentation, examples, and trial-and-error. There is no interactive, guided learning experience.

### The Solution

We are building "Exploring Leo" — a web-based interactive tutorial that teaches Leo through hands-on coding exercises. Users will read explanations, write code in a browser-based editor, execute it instantly, and receive feedback. This mirrors the successful "A Tour of Go" tutorial that has helped countless developers learn the Go programming language.

### Why This Matters

- Leo is gaining adoption in the blockchain/zero-knowledge space
- An interactive tutorial lowers the barrier to entry for new developers
- The Aleo ecosystem benefits from more Leo developers
- This fills a gap that currently exists in Leo's learning resources

---

## 2. What is Leo

### Overview

Leo is an open-source, statically-typed, imperative programming language designed specifically for building **private applications** on the Aleo blockchain. It compiles to zero-knowledge circuits, enabling verifiable computation with privacy.

### Key Characteristics

- **Privacy-focused**: Built for creating private, verifiable applications
- **Zero-knowledge proof enabled**: Leo programs compile to cryptographic circuits
- **Influenced by**: JavaScript, Scala, and Rust syntax
- **Part of Aleo ecosystem**: Programs deploy to the Aleo network with program identifiers ending in `.aleo`
- **Statically typed**: Strong type system with explicit types required

### Core Language Features

**Program Structure**: Every Leo program must be wrapped in a program block with an `.aleo` identifier, for example `program helloworld.aleo { }`.

**Types**: Leo supports primitive types including unsigned integers (u8, u16, u32, u64, u128), signed integers (i8, i16, i32, i64, i128), field elements, group elements, addresses, booleans, and scalars. It also supports composite types like structs, records, arrays, and tuples.

**Functions**: Leo has six function variants:
- `function` - Regular helper functions
- `inline` - Functions inlined at call site
- `transition` - Entry points that can manipulate records and create proofs
- `async transition` - Transitions that call async functions
- `async function` - Contains on-chain operations (finalize logic)

**Records**: Special structs with an `owner` field that represent private state owned by addresses. Records are fundamental to Leo's privacy model.

**Mappings**: On-chain key-value storage accessed via operations like get, set, contains, and remove. Mappings can only be manipulated inside async functions.

**Control Flow**: Leo supports if/else conditionals, ternary expressions, and bounded for loops with compile-time known bounds.

**Cryptographic Builtins**: Leo includes hash functions like BHP256 and Poseidon2, commitment schemes, signature verification, and random number generation via ChaCha.

### Official Resources

- **Compiler Repository**: github.com/ProvableHQ/leo — The official Leo compiler written in Rust
- **Documentation Source**: github.com/ProvableHQ/leo-docs-source — Markdown documentation files
- **Live Documentation**: docs.leo-lang.org — The rendered documentation website
- **Leo Playground**: play.leo-lang.org — A web-based IDE for writing and running Leo programs

---

## 3. What is "A Tour of Go"

### Overview

"A Tour of Go" (tour.golang.org) is the official interactive tutorial for learning the Go programming language. It has become a gold standard for how programming language tutorials should be designed.

### Key Features That Make It Successful

**Interactive Code Editor**: Users can write and modify Go code directly in the browser. No installation required — everything runs in the browser.

**Progressive Lessons**: The tutorial is structured into modules that build upon each other, starting with basics and advancing to complex topics.

**Immediate Execution**: Users click "Run" and see output instantly. The code executes server-side via the Go Playground API.

**Hands-on Exercises**: After explanations, users complete exercises that reinforce concepts. They must write code to proceed.

**Clean Two-Panel Layout**: The left side shows instructions and explanations, the right side shows the code editor and output.

**No Setup Required**: Everything works in the browser. Users can start learning immediately without installing anything.

### How It Works Technically

The Tour of Go is a standalone web application that calls the Go Playground API for code execution. The Playground API accepts Go code, compiles and runs it server-side, and returns the output. This separation means the tutorial frontend and execution backend are independent.

### Why We Are Inspired By It

The Tour of Go has proven that interactive, browser-based tutorials are highly effective for teaching programming languages. We want to replicate this success for Leo.

---

## 4. What is "Exploring Leo"

### Definition

"Exploring Leo" is the name of the interactive tutorial we are building. It is a web application that teaches developers the Leo programming language through progressive lessons with integrated code execution.

### Naming Decision

We specifically chose "Exploring Leo" rather than "Tour of Leo" to give it its own identity while still being reminiscent of the Tour of Go.

### Core User Experience

1. User opens the Exploring Leo website
2. A sidebar shows all available lessons organized by module
3. The main area is split: left side shows lesson content (explanations), right side shows the code editor
4. User reads the explanation, then modifies or writes code in the editor
5. User clicks "Run" to execute the code
6. Output appears below the editor
7. For exercises, user can click "Check" to validate their solution
8. User navigates to the next lesson when ready
9. Progress is saved in the browser so users can resume later

### What Makes It Different From the Leo Playground

The Leo Playground (play.leo-lang.org) is a general-purpose code editor for writing Leo programs. It does not have lessons, explanations, exercises, or guided learning. Exploring Leo uses similar code execution capabilities but wraps them in a structured educational experience.

---

## 5. Architecture Decision

### Chosen Approach: Standalone Web Application

After evaluating multiple approaches, we decided to build Exploring Leo as a **standalone web application** in a **separate repository** from the Leo compiler.

### Why a Separate Repository

**Independence**: The tutorial can be developed, deployed, and maintained independently from the Leo compiler. Web developers can contribute without knowing Rust.

**Simpler Tooling**: The project uses standard web development tools (npm, Vite, TypeScript) rather than mixing with the Rust ecosystem.

**Standard Practice**: This mirrors how Tour of Go is separate from the Go compiler repository.

**Easier Contributions**: Web developers familiar with React/Vue can contribute lessons and UI improvements without needing to understand the Leo compiler codebase.

### Why Not Inside the Leo Compiler Repository

We initially considered adding this as a feature inside the Leo compiler repository (github.com/ProvableHQ/leo). However, this would mean:
- Mixing Rust (compiler) with JavaScript (web app)
- Contributors would need to clone the entire compiler
- Deployment would be tied to compiler releases
- CI/CD would be more complex

### Code Execution Strategy

Leo code execution happens **entirely in the browser** using WebAssembly (WASM). This means:
- No backend server is required for code execution
- The Leo compiler and snarkVM have been compiled to WASM
- The official Provable SDK provides JavaScript bindings to this WASM
- All computation happens client-side in the user's browser

This is crucial because it means Exploring Leo can be deployed as a static website with no server costs for execution.

---

## 6. Technology Stack

### What is WASM (WebAssembly)

WebAssembly is a binary instruction format that allows code written in languages like Rust, C, and C++ to run in web browsers at near-native speed. The Leo compiler is written in Rust. Through WASM, this Rust code can be compiled to run inside a web browser, allowing Leo programs to be compiled and executed client-side.

### The Provable SDK

**Repository**: github.com/ProvableHQ/sdk

**NPM Package**: @provablehq/sdk

The Provable SDK is the official JavaScript/TypeScript SDK for interacting with Leo and the Aleo network. It includes:
- WASM-compiled Leo compiler and snarkVM
- JavaScript bindings for program execution
- Network client for on-chain interactions
- Account and key management utilities

For Exploring Leo, we primarily use the SDK's ability to compile and execute Leo programs in the browser.

### How the SDK Works

The SDK internally uses @provablehq/wasm which contains the compiled WebAssembly modules. When you call the SDK to execute a Leo program:
1. The Leo code is parsed and compiled to Aleo instructions
2. The Aleo instructions are executed by the snarkVM WASM module
3. Results are returned to JavaScript

All of this happens in the browser without any server communication.

### Frontend Technology Choices

**Framework**: Vue 3 or React (developer preference) — Both work well for this type of application.

**Build Tool**: Vite — Fast development server and optimized production builds.

**Language**: TypeScript — Type safety helps maintain code quality.

**Code Editor**: Monaco Editor — The same editor that powers VS Code, providing syntax highlighting, auto-completion, and a familiar editing experience.

**Styling**: Tailwind CSS — Utility-first CSS framework for rapid UI development.

**Markdown Rendering**: markdown-it or remark — For rendering lesson content which is written in Markdown.

**State Management**: Pinia (for Vue) or Zustand (for React) — For managing application state like current lesson, user progress, and editor content.

**Deployment**: Vercel or GitHub Pages — Static site hosting with automatic deployments from Git.

---

## 7. Project Structure

### Repository Location

The project will live in its own repository, separate from the Leo compiler. Suggested location: a new repository named `exploring-leo` under the developer's GitHub account or potentially under ProvableHQ if officially adopted.

### Directory Organization

The project follows a standard modern web application structure:

**Root Level**: Contains configuration files for the project including package.json for npm dependencies and scripts, TypeScript configuration, Vite configuration, and the main HTML entry point.

**Public Directory**: Static assets that are served directly, including images, the favicon, and the Leo logo.

**Source Directory**: All application source code organized into subdirectories:

- **Components**: Reusable UI components organized by feature area. Layout components handle the overall page structure including the sidebar, header, and footer. Editor components handle the code editing interface including the Monaco editor wrapper, output display, and run button. Lesson components display the instructional content including markdown rendering and hints.

- **Composables or Hooks**: Reusable logic for state management and side effects. These handle lesson loading and navigation, Leo code execution via the SDK, progress tracking using browser localStorage, and keyboard shortcuts.

- **Services**: Business logic separated from UI components. The primary service wraps the Provable SDK to provide a clean interface for executing Leo code.

- **Stores**: Centralized state management for lesson data and user progress.

- **Types**: TypeScript type definitions for lessons, execution results, and other data structures.

- **Utilities**: Helper functions for markdown parsing, localStorage operations, and other common tasks.

- **Router**: Route definitions mapping URLs to lesson content.

**Content Directory**: All lesson content organized by module. Each module is a folder containing multiple lessons. Each lesson consists of a Markdown file for the explanation and Leo files for starter code and solutions.

**Tests Directory**: Unit tests for components and services, plus end-to-end tests for the complete user flow.

**GitHub Directory**: CI/CD workflow definitions for automatic testing and deployment.

---

## 8. Development Phases

### Phase 1: Project Setup

**Objective**: Create the foundational project structure and verify the development environment works.

**Tasks**:
- Initialize a new project using Vite with the TypeScript template for the chosen framework (Vue or React)
- Install core dependencies including the Provable SDK, Monaco Editor, Tailwind CSS, and markdown parser
- Set up the basic folder structure as outlined in the project structure section
- Create a minimal "hello world" page to verify the setup works
- Configure TypeScript, ESLint, and Prettier for code quality
- Set up Git repository with appropriate gitignore and README

**Verification**: The development server runs and displays a basic page.

### Phase 2: SDK Integration

**Objective**: Confirm that Leo code can be executed in the browser using the Provable SDK.

**Tasks**:
- Create a service wrapper around the Provable SDK
- Implement a function that accepts Leo source code as a string and returns execution results
- Handle compilation errors gracefully with user-friendly messages
- Handle runtime errors and format them for display
- Add timeout handling to prevent infinite execution
- Test with various Leo programs to ensure reliability

**Verification**: A simple Leo program can be executed and its output displayed.

### Phase 3: Code Editor Component

**Objective**: Build a functional code editor using Monaco Editor.

**Tasks**:
- Integrate Monaco Editor as a Vue/React component
- Configure the editor for Leo syntax (basic highlighting, if no Leo language definition exists, use a similar language as base)
- Implement the Run button that triggers code execution
- Create an output panel below the editor to show results
- Handle loading and error states in the UI
- Make the editor resizable or appropriately sized for different screen sizes

**Verification**: Users can type Leo code, click Run, and see output.

### Phase 4: Lesson Display System

**Objective**: Build the system for loading and displaying lesson content.

**Tasks**:
- Design the lesson data structure including fields for id, title, module, order, content (markdown), starter code, solution code, hints, and validation rules
- Create a manifest file (JSON) that lists all lessons and their organization into modules
- Build a lesson loader that reads the manifest and lesson files
- Create a component that renders lesson markdown with proper formatting
- Display the lesson title, module name, and navigation breadcrumbs
- Load the starter code into the editor when a lesson is selected

**Verification**: Lessons can be selected and their content displayed alongside the starter code.

### Phase 5: Navigation and Layout

**Objective**: Create the full application layout with navigation.

**Tasks**:
- Build the sidebar component showing all modules and lessons
- Highlight the current lesson in the sidebar
- Implement module expansion/collapse in the sidebar
- Create the header with the Exploring Leo title and any navigation links
- Build previous/next navigation buttons in the footer
- Implement URL routing so each lesson has a unique URL
- Handle direct navigation to a lesson via URL

**Verification**: Users can navigate between lessons using the sidebar and prev/next buttons.

### Phase 6: Progress Tracking

**Objective**: Remember user progress across sessions.

**Tasks**:
- Store progress in browser localStorage
- Track which lessons have been completed
- Track the current lesson the user is on
- Show visual indicators (checkmarks or similar) for completed lessons
- Implement a "Continue" feature that takes users to where they left off
- Add a "Reset Progress" option for users who want to start over

**Verification**: Closing and reopening the browser preserves progress.

### Phase 7: Exercise Validation

**Objective**: For exercise-type lessons, validate user solutions.

**Tasks**:
- Design validation rules that can be specified per lesson (output matching, compilation success, contains specific constructs)
- Implement a Check Solution button for exercise lessons
- Compare execution output against expected output
- Provide feedback on success or failure with helpful messages
- Show hints progressively when users struggle
- Differentiate between explanation-only lessons and exercise lessons in the UI

**Verification**: Exercise solutions are validated and users receive appropriate feedback.

### Phase 8: Content Creation

**Objective**: Write the actual lesson content covering Leo fundamentals.

**Tasks**:
- Write the lesson manifest organizing all modules and lessons
- Create content for each lesson including explanations, starter code, solutions, and hints
- Test each lesson's code examples to ensure they work
- Review content for clarity and correctness
- Get feedback from Leo developers on accuracy
- Iterate on content based on feedback

**Verification**: All planned lessons have complete, tested content.

### Phase 9: Polish and Testing

**Objective**: Prepare the application for public release.

**Tasks**:
- Write unit tests for critical components and services
- Write end-to-end tests for the main user flows
- Test on different browsers (Chrome, Firefox, Safari)
- Test on different screen sizes (desktop, tablet, mobile)
- Optimize loading performance
- Add appropriate error boundaries and fallback UI
- Review accessibility (keyboard navigation, screen reader support)
- Create a loading state for initial SDK initialization

**Verification**: The application is stable, performant, and accessible.

### Phase 10: Deployment

**Objective**: Deploy the application to a public URL.

**Tasks**:
- Set up hosting on Vercel, GitHub Pages, or similar
- Configure the domain or subdomain
- Set up automatic deployments from the main branch
- Add appropriate caching headers for static assets
- Verify the deployed application works correctly
- Announce the launch and gather initial feedback

**Verification**: The application is live and accessible to the public.

---

## 9. Lesson Content System

### Lesson Data Structure

Each lesson needs to contain:

- **Unique Identifier**: A slug-style string like `basics-variables` used in URLs and internal references
- **Title**: Human-readable name displayed to users like "Variables and Let Bindings"
- **Module**: Which section it belongs to such as "Basics" or "Functions"
- **Order**: Numeric position within the module for sorting
- **Type**: Either "explanation" for read-only lessons or "exercise" for lessons requiring user code
- **Content**: Markdown text explaining the concept, which can include formatted text, bullet points, and inline code
- **Starter Code**: The initial Leo code shown in the editor when the lesson loads
- **Solution Code**: For exercises, the expected correct implementation (hidden from users but used for hints)
- **Hints**: An array of progressive hints, revealed one at a time when users request help
- **Validation Type**: How to check if the solution is correct, such as output-match, compiles, or contains
- **Expected Output**: For output-match validation, the expected program output

### Content File Organization

Lessons are stored as files in a content directory. Each module is a subdirectory. Within each module directory, there are files for each lesson.

The recommended format is to have a Markdown file for the lesson explanation, a Leo file for the starter code, and optionally a Leo file for the solution.

A manifest file at the root of the content directory lists all modules and lessons in order, providing the structured index needed for navigation.

### Content Writing Guidelines

- Keep explanations concise, ideally three to five short paragraphs
- Start with "why" before "how" — explain the purpose before the syntax
- Use simple examples before showing complex ones
- Teach one concept per lesson to avoid overwhelming users
- Provide exercises that directly reinforce the explanation
- Write hints that guide without giving away the answer
- Test all code examples by running them to ensure they work
- Use consistent terminology throughout all lessons

---

## 10. Leo Language Curriculum

### Module 1: Welcome and Basics

Introduces Leo and covers fundamental concepts every program needs.

Lessons:
- Introduction to Leo explaining what it is, what it is used for, and what makes it special
- Program structure covering the required program wrapper and .aleo naming
- Comments explaining single-line and block comment syntax
- Variables covering let bindings and type annotations
- Constants explaining const declarations for compile-time values
- Basic types introducing u32, field, bool, and address types
- Type suffixes explaining literal syntax like 1u32 and 5field

### Module 2: Types in Depth

Explores all the types available in Leo with examples of when to use each.

Lessons:
- Integer types covering all unsigned and signed variants with their ranges
- Field elements explaining the field type and its role in cryptography
- The address type for representing Aleo addresses
- Booleans covering bool values and basic logical operations
- Arrays explaining fixed-size array declaration and access
- Tuples covering tuple types for grouping values
- Type conversions explaining casting between types

### Module 3: Functions

Covers all the different function types in Leo and when to use each.

Lessons:
- Basic functions with the function keyword
- Function parameters and type annotations
- Return values and the return statement
- Inline functions that are substituted at call sites
- Transitions as the main entry points that create proofs
- Public and private parameter visibility
- Calling functions from other functions

### Module 4: Control Flow

Teaches conditional logic and loops.

Lessons:
- If expressions for conditional branching
- Else and else if for multiple branches
- The ternary operator for inline conditionals
- For loops with bounded iteration
- Loop ranges using the dot-dot syntax
- Early return statements

### Module 5: Operators

Covers all operators available in Leo.

Lessons:
- Arithmetic operators for math operations
- Comparison operators for equality and ordering
- Logical operators for boolean logic
- Bitwise operators for bit manipulation
- Compound assignment operators
- Wrapping operations that handle overflow

### Module 6: Data Structures

Introduces structs and records, which are fundamental to Leo programs.

Lessons:
- Defining structs for custom data types
- Creating struct instances
- Accessing struct fields
- Records as private state containers
- The required owner field in records
- Creating and consuming records in transitions

### Module 7: Mappings and On-Chain State

Covers how Leo programs store and access on-chain data.

Lessons:
- Mapping declarations for key-value storage
- Mapping operations including get, set, contains, and remove
- Async functions for on-chain logic
- Async transitions that combine local and on-chain execution
- Futures and how to work with them
- Block context including height and timestamp

### Module 8: Advanced Features

Covers specialized features for building real applications.

Lessons:
- Self references for caller, signer, and program address
- Assertions for runtime checks
- Cryptographic hash functions
- Signature verification
- Random number generation
- Importing other programs
- Const generics for type-level constants

### Module 9: Real-World Projects

Walks through complete, practical examples.

Lessons:
- Building a simple token with mint and transfer
- Creating a voting system with privacy
- Implementing an auction with sealed bids
- Best practices and coding conventions

---

## 11. Key External Resources

### Leo Compiler and Tools

- **Leo Compiler Repository**: github.com/ProvableHQ/leo — The source code for the Leo compiler written in Rust. Contains the interpreter, parser, AST definitions, and CLI.

- **Leo Documentation Source**: github.com/ProvableHQ/leo-docs-source — The Markdown source files for official Leo documentation. Useful for understanding language features and verifying accuracy.

- **Leo Documentation Website**: docs.leo-lang.org — The rendered documentation with guides, language reference, and CLI documentation.

- **Leo Playground**: play.leo-lang.org — The existing web-based IDE for Leo. Does not have tutorial features but demonstrates Leo execution in browser.

### Aleo SDK

- **SDK Repository**: github.com/ProvableHQ/sdk — The official JavaScript/TypeScript SDK that includes WASM-compiled Leo and snarkVM.

- **NPM Package**: @provablehq/sdk — Install via npm to use the SDK in a JavaScript project.

### Aleo Network

- **Network API**: api.explorer.provable.com/v1 — REST API for querying the Aleo network (not directly needed for Exploring Leo but useful context).

- **Block Explorer**: explorer.provable.com — Web interface for exploring the Aleo blockchain.

### Inspiration

- **Tour of Go**: tour.golang.org (or go.dev/tour) — The interactive Go tutorial that inspired this project. Worth studying for UI/UX patterns.

---

## 12. Development Checklist

Use this checklist to track progress through development:

### Foundation
- [ ] Initialize project with Vite and chosen framework
- [ ] Install and configure Tailwind CSS
- [ ] Install Provable SDK
- [ ] Install Monaco Editor
- [ ] Set up TypeScript configuration
- [ ] Create basic folder structure
- [ ] Initialize Git repository

### Core Functionality
- [ ] Create SDK service wrapper for code execution
- [ ] Build Monaco Editor component
- [ ] Implement Run button and output display
- [ ] Handle compilation errors gracefully
- [ ] Handle runtime errors gracefully
- [ ] Add execution timeout handling

### Lesson System
- [ ] Design lesson data structure
- [ ] Create lesson manifest format
- [ ] Build lesson loading logic
- [ ] Create lesson content renderer
- [ ] Implement starter code loading
- [ ] Build hint display system

### Navigation
- [ ] Build sidebar with module and lesson list
- [ ] Implement lesson routing
- [ ] Add prev/next navigation
- [ ] Create header and footer
- [ ] Handle direct URL navigation

### Progress Tracking
- [ ] Implement localStorage persistence
- [ ] Track completed lessons
- [ ] Show completion indicators
- [ ] Add resume functionality
- [ ] Add reset progress option

### Validation
- [ ] Implement output matching validation
- [ ] Implement compilation-only validation
- [ ] Build Check Solution button
- [ ] Create success/failure feedback UI
- [ ] Integrate hints on failure

### Content
- [ ] Write Module 1 lessons (Welcome and Basics)
- [ ] Write Module 2 lessons (Types)
- [ ] Write Module 3 lessons (Functions)
- [ ] Write Module 4 lessons (Control Flow)
- [ ] Write Module 5 lessons (Operators)
- [ ] Write Module 6 lessons (Data Structures)
- [ ] Write Module 7 lessons (Mappings)
- [ ] Write Module 8 lessons (Advanced)
- [ ] Write Module 9 lessons (Projects)
- [ ] Test all code examples

### Polish
- [ ] Write unit tests
- [ ] Test cross-browser compatibility
- [ ] Test responsive design
- [ ] Optimize performance
- [ ] Review accessibility
- [ ] Add loading states

### Deployment
- [ ] Set up hosting
- [ ] Configure automatic deployments
- [ ] Verify production build
- [ ] Launch publicly

---

## Final Notes

This document captures everything discussed during the planning phase of Exploring Leo. It is intended to serve as complete context for anyone (human or AI) who needs to understand or continue this project.

The key decisions made:
1. This is a web-only project (no CLI or TUI modes)
2. It lives in its own repository, separate from the Leo compiler
3. Code execution uses the Provable SDK's WASM capabilities, requiring no backend server
4. The UI is inspired by Tour of Go with a two-panel layout
5. Content is stored as Markdown and Leo files in a structured content directory
6. Progress is tracked in browser localStorage

The project name is **"Exploring Leo"** and should be referred to as such throughout.

---

*This guide was created in January 2026 to document the complete plan for the Exploring Leo project.*
