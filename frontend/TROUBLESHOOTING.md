# Troubleshooting White Screen Issue

If you're seeing a white screen when accessing the microservices, here are common causes and solutions:

## Common Causes

1. **JavaScript Runtime Errors** - Check browser console (F12) for errors
2. **Missing Auth Configuration** - MSAL might not be configured
3. **CORS Issues** - Backend API might not be running
4. **Build Errors** - Check Docker build logs

## Quick Fixes

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors.

### 2. Verify Backend is Running
The microservices expect the backend API at `http://localhost:8000`. Make sure it's running.

### 3. Check Container Logs
```bash
docker logs careercoach-dashboard
docker logs careercoach-courses
# etc.
```

### 4. Rebuild Containers
```bash
cd frontend
docker-compose -p careercoach -f docker-compose-microservices-separate.yml down
docker-compose -p careercoach -f docker-compose-microservices-separate.yml up -d --build
```

### 5. Check if HTML/JS is Loading
```bash
curl http://localhost:4001/
curl http://localhost:4001/assets/index-*.js
```

## Most Likely Issue

The white screen is usually caused by:
- **Auth Provider Initialization Failure** - MSAL might be failing silently
- **Missing Environment Variables** - Check if auth config is set up
- **Component Import Errors** - Some component might have incorrect imports

## Debug Steps

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab to see if all assets are loading
5. Check if React is mounting by looking for React DevTools

## Temporary Workaround

If auth is the issue, you can temporarily disable auth checks in the AuthProvider component.


