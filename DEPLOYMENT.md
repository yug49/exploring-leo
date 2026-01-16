# Exploring Leo - Deployment Guide

## Architecture

- **Frontend**: React/Vite app (deploy to Vercel)
- **Backend**: Express.js server with Leo CLI (deploy to Railway)

The backend requires the Leo CLI binary, so it needs a proper server environment (not serverless).

---

## Step 1: Deploy Backend to Railway

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** → "Deploy from GitHub repo"

3. **Configure the service:**
   - Root Directory: `server`
   - Railway will automatically detect the Dockerfile

4. **Add environment variables:**
   ```
   PORT=3001
   ```

5. **Deploy** and wait for the build (takes ~10-15 min first time due to Leo CLI installation)

6. **Copy your Railway URL** (e.g., `https://exploring-leo-server-production.up.railway.app`)

---

## Step 2: Deploy Frontend to Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repo**

3. **Configure the project:**
   - Framework Preset: Vite
   - Root Directory: `app`

4. **Add environment variables:**
   ```
   VITE_LEO_SERVER_URL=https://your-railway-url.up.railway.app
   ```
   (Replace with your actual Railway URL from Step 1)

5. **Deploy!**

---

## Alternative: Deploy Everything to Railway

You can also deploy both frontend and backend to Railway:

1. Create two services in the same Railway project
2. Service 1: Backend (root: `server`)
3. Service 2: Frontend (root: `app`, build command: `npm run build`, start: `npx serve dist`)

---

## Local Development

```bash
# Terminal 1: Start the backend
cd server
npm install
npm run dev

# Terminal 2: Start the frontend
cd app
npm install
npm run dev
```

Open http://localhost:5173

---

## Troubleshooting

### Backend build fails
- Ensure the Dockerfile is in the `server` folder
- Check Railway logs for specific errors

### Frontend can't connect to backend
- Verify `VITE_LEO_SERVER_URL` is set correctly in Vercel
- Ensure the Railway backend is running and healthy
- Check browser console for CORS errors

### Leo CLI errors
- The Leo CLI takes time to compile (~10-15 min)
- Check Railway logs: `leo --version` should show the installed version
