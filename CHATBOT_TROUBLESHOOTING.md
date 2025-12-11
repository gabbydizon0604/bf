# Betina Chatbot Troubleshooting Guide

## Issue: 404 Error When Sending Messages

### Problem
Getting error: `POST https://apianabet.herokuapp.com/api/chatbot/query 404 (Not Found)`

### Solution

The frontend is configured to use the local backend at `http://localhost:3010`, but the Angular dev server needs to be restarted to pick up the configuration change.

### Steps to Fix:

1. **Stop the Angular dev server** (if running):
   - Press `Ctrl + C` in the terminal running `ng serve`

2. **Verify backend is running**:
   ```powershell
   # Check if backend is running on port 3010
   netstat -ano | findstr :3010
   ```
   You should see output showing the port is LISTENING.

3. **Start the Angular dev server again**:
   ```powershell
   cd frontend
   npm run start-hmr
   ```
   OR use the safe script:
   ```powershell
   .\start-dev-safe.ps1
   ```

4. **Hard refresh your browser**:
   - Press `Ctrl + Shift + R` or `Ctrl + F5`
   - This clears the browser cache

5. **Test the chatbot again**:
   - Open the chat widget
   - Send "Hola" message
   - It should work now!

### Verify Configuration

The `frontend/src/environments/environment.ts` should have:
```typescript
urlIntegracion: 'http://localhost:3010',
```

### Common Issues

1. **Backend not running**:
   - Make sure the backend server is running on port 3010
   - Start it with: `cd backend && npm start`

2. **CORS errors**:
   - Backend has CORS enabled, but if you still see errors, check backend logs

3. **Wrong URL still showing**:
   - Browser cache might be holding old configuration
   - Do a hard refresh or clear browser cache
   - Restart the Angular dev server

### Test Backend API Directly

You can test if the backend is working:
```powershell
Invoke-WebRequest -Uri "http://localhost:3010/api/chatbot/query" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"message":"Hola"}'
```

If this works, the backend is fine and you just need to restart the Angular server.

