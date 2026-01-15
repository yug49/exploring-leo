# Exploring Leo - Execution Server

A local Node.js server that compiles and executes Leo programs using the Leo CLI.

## Prerequisites

Before running the server, you must have the **Leo CLI** installed on your system.

### Installing Leo CLI

Follow the official installation guide: https://developer.aleo.org/leo/installation

**Quick install (macOS/Linux):**
```bash
curl -L https://raw.githubusercontent.com/ProvableHQ/leo/mainnet/install.sh | sh
```

**Verify installation:**
```bash
leo --version
```

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

3. **Verify it's working:**
   ```bash
   curl http://localhost:3001/health
   ```

   You should see:
   ```json
   {
     "status": "healthy",
     "leoInstalled": true,
     "message": "Leo CLI is installed and ready"
   }
   ```

## API Endpoints

### `GET /health`

Check if the server is running and Leo CLI is installed.

**Response:**
```json
{
  "status": "healthy" | "unhealthy",
  "leoInstalled": boolean,
  "message": string
}
```

### `POST /execute`

Execute Leo code.

**Request Body:**
```json
{
  "code": "program hello.aleo { transition main() -> u32 { return 42u32; } }",
  "functionName": "main",      // optional, defaults to "main"
  "inputs": ["5u32", "3u32"],  // optional, function inputs
  "timeout": 60000             // optional, timeout in ms (default: 60000)
}
```

**Response (Success):**
```json
{
  "success": true,
  "output": "Output: 42u32",
  "executionTime": 1234
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message here",
  "errorType": "compilation" | "runtime" | "timeout" | "setup",
  "executionTime": 1234
}
```

## How It Works

When you send code to the `/execute` endpoint:

1. **Create temporary project**: A temporary Leo project is created in the system's temp directory
2. **Write code**: Your Leo code is written to `src/main.leo`
3. **Build**: The server runs `leo build` to compile the program
4. **Run**: If compilation succeeds, `leo run <functionName> <inputs>` is executed
5. **Return results**: The output (or error) is returned to the client
6. **Cleanup**: The temporary project is deleted

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the server in development mode with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled server (production) |
| `npm run clean` | Remove the `dist` directory |

## Configuration

The server can be configured via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port to run the server on |

## Troubleshooting

### "Leo CLI is not installed"

Make sure you have installed Leo CLI following the instructions above. Run `leo --version` to verify.

### "Execution timed out"

The default timeout is 60 seconds. Leo programs that are complex or generate proofs can take a long time. You can increase the timeout in your request:

```json
{
  "code": "...",
  "timeout": 120000
}
```

### "Build failed" or compilation errors

Check that your Leo code is syntactically correct. Make sure:
- You have a `program name.aleo { }` wrapper
- All types are explicitly declared
- Transition functions are properly defined

## Development

The server is written in TypeScript. To make changes:

1. Edit files in `src/`
2. The dev server will automatically reload
3. Run `npm run build` to compile for production
