# Exploring Leo 🦁

An interactive web-based tutorial for learning the Leo programming language, inspired by "A Tour of Go".

## What is Leo?

Leo is an open-source, statically-typed, imperative programming language designed for building **private applications** on the Aleo blockchain. It compiles to zero-knowledge circuits, enabling verifiable computation with privacy.

## Features

- 📚 **Progressive Lessons** - Learn Leo from basics to advanced topics
- ✏️ **Interactive Code Editor** - Write and modify Leo code directly in the browser
- ▶️ **Instant Execution** - Run your code and see results immediately
- 🎯 **Hands-on Exercises** - Practice what you learn with coding challenges
- 💾 **Progress Tracking** - Your progress is saved in your browser
- 🔒 **Privacy-First** - Learn to build applications with built-in privacy using zero-knowledge proofs

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Leo Execution**: Provable SDK (WASM)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Navigate to the app directory
cd exploring-leo/app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── src/
│   ├── components/       # React components
│   │   ├── editor/       # Code editor components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Business logic (Leo execution)
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application component
├── public/               # Static assets
└── content/              # Lesson content (Markdown + Leo files)
```

## How It Works

Leo code execution happens entirely in the browser using WebAssembly:

1. Leo source code is parsed and validated
2. The Provable SDK (compiled to WASM) compiles Leo to Aleo instructions
3. Results are returned to the JavaScript runtime
4. No backend server required!

## Resources

- [Leo Documentation](https://docs.leo-lang.org)
- [Leo Playground](https://play.leo-lang.org)
- [Provable SDK](https://github.com/ProvableHQ/sdk)
- [Aleo Network](https://aleo.org)

## License

MIT License

---

Built with ❤️ for the Aleo community
