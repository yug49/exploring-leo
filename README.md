# Exploring Leo

An interactive tutorial for learning the Leo programming language, inspired by "A Tour of Go". Learn to build zero-knowledge applications on Aleo through hands-on coding exercises.

**Live Demo:** [https://exploring-leo.vercel.app](https://exploring-leo.vercel.app)

## Overview

Exploring Leo is a web-based interactive learning platform that teaches the Leo programming language from the ground up. Leo is a functional, statically-typed language designed for writing private applications on the Aleo blockchain.

### Features

- 40 comprehensive lessons covering Leo fundamentals to advanced topics
- Live code editor with syntax highlighting
- Real-time code execution with instant feedback
- Progressive curriculum from basic types to complex patterns
- No local setup required for the hosted version

### Topics Covered

1. **Basics**: Program structure, variables, data types
2. **Types**: Integers, booleans, fields, addresses, groups, scalars
3. **Operators**: Arithmetic, comparison, bitwise operations
4. **Control Flow**: Conditionals, ternary expressions, loops
5. **Data Structures**: Structs, arrays, tuples
6. **Functions**: Transitions, helper functions, inline functions
7. **State Management**: Records, mappings, async functions
8. **Advanced**: Assertions, hashing, type casting
9. **Exercises**: Hands-on coding challenges

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite build system
- Tailwind CSS for styling
- CodeMirror for the code editor

### Backend
- Node.js with Express
- Leo CLI for code compilation and execution
- Docker for deployment

## Local Development

### Prerequisites

- Node.js 18 or higher
- Leo CLI installed ([Installation Guide](https://developer.aleo.org/leo/installation))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yug49/exploring-leo.git
cd exploring-leo
```

2. Install dependencies and start the backend:
```bash
cd server
npm install
npm run dev
```

3. In a new terminal, start the frontend:
```bash
cd app
npm install
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application consists of two parts that need to be deployed separately:

### Backend (Railway)

The backend requires a server environment to run the Leo CLI.

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will automatically detect the Dockerfile
4. Add the environment variable `PORT=3001`
5. Deploy and copy the generated URL

### Frontend (Vercel)

1. Import the repository on [Vercel](https://vercel.com)
2. Set the root directory to `app`
3. Add the environment variable:
   - `VITE_LEO_SERVER_URL=https://your-railway-url.up.railway.app`
4. Deploy

## Project Structure

```
exploring-leo/
├── app/                    # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main application with lessons
│   └── package.json
├── server/                 # Backend server
│   ├── src/
│   │   └── index.ts        # Express server with Leo execution
│   └── package.json
└── Dockerfile              # Docker configuration for deployment
```

## Contributing

Contributions are welcome. Please feel free to submit a pull request or open an issue for bugs, feature requests, or improvements.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Aleo](https://aleo.org) for the Leo programming language
- [ProvableHQ](https://github.com/ProvableHQ) for Leo documentation and tooling
- Inspired by [A Tour of Go](https://go.dev/tour/)
