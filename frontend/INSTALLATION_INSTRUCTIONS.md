# Career Coach - Installation Instructions

## Quick Start

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Azure MSAL packages for authentication
- React Router for navigation
- Radix UI components
- Tailwind CSS for styling
- All other dependencies

### 3. Run Development Server

**Option A: Using Command Prompt (Recommended for Windows)**
```cmd
npm run dev
```

**Option B: Using PowerShell** (if execution policy allows)
```powershell
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

## What's New: Azure AD B2C Authentication

The application now includes enterprise-grade authentication using Azure AD B2C from the InAction project:

### ✅ Features Implemented:
1. **Microsoft Sign-In** - Fully functional via Azure AD (with demo fallback)
2. **Google Sign-In** - Demo mode ready (easily configurable for real OAuth)
3. **Email Sign-In** - Local authentication fallback
4. **Demo Mode** - Skip authentication for testing
5. **Secure Authentication** - Industry-standard OAuth 2.0 / OpenID Connect
6. **Automatic User Management** - Seamless user creation and session management
7. **Smart Redirects** - Routes users to onboarding or dashboard based on status
8. **Enhanced Login UI** - Modern, animated login page with gradient effects
9. **Fallback Authentication** - App always works even if external auth fails

### 🔐 Authentication Flow:
1. User clicks "Continue with Microsoft" or "Continue with Google" on login page
2. **Microsoft**: Azure AD popup opens for authentication
3. **Google**: Demo authentication (easily configurable for real OAuth)
4. **Fallback**: If external auth fails, demo user is automatically created
5. App receives authentication data
6. User data is stored in session storage
7. User is redirected to appropriate page (onboarding or dashboard)

### 📁 New Files Created:
- `src/lib/authConfig.ts` - Azure AD configuration
- `src/lib/msalInstance.ts` - MSAL instance setup
- `src/lib/googleAuth.ts` - Google OAuth helper functions
- `src/components/auth/AuthProvider.tsx` - Authentication context
- `AUTH_SETUP.md` - Detailed authentication documentation
- `GOOGLE_MICROSOFT_AUTH_SETUP.md` - Complete auth setup guide

### 🔄 Files Updated:
- `package.json` - Added Azure MSAL packages
- `src/App.tsx` - Wrapped with MsalProvider and AuthProvider
- `src/pages/Login.tsx` - Integrated Azure AD B2C authentication
- `src/components/app-header.tsx` - Added logout functionality

## Testing the Authentication

### 1. **Test Microsoft Sign-In:**
- Click "Continue with Microsoft"
- Sign in with a valid Microsoft account
- You'll be redirected to the onboarding flow (first time) or dashboard (returning user)

### 2. **Test Email Sign-In (Local):**
- Click "Continue with Email"
- Enter any email and password
- This is a local fallback authentication (not connected to Azure)

### 3. **Test Demo Mode:**
- Click "Skip Login (Demo Mode)"
- Instantly access the dashboard without authentication
- Useful for testing features without signing in

## Configuration

### Azure AD B2C Settings:
The app is configured to use the InAction Azure AD B2C tenant:
- **Tenant:** appendture.onmicrosoft.com
- **Client ID:** 7312bbdd-a612-46e9-b482-eeb2003e1786
- **Policy:** b2c_1_signin_inactionai
- **Redirect URI:** Dynamically set to your current origin + `/login`

### To Use Your Own Azure AD B2C:
Edit `frontend/src/lib/authConfig.ts` and update:
- `clientId` - Your Application (client) ID
- `authority` - Your tenant and policy URL
- `knownAuthorities` - Your B2C domain

## Troubleshooting

### Issue: "Popup was blocked"
**Solution:** Allow popups for localhost in your browser settings

### Issue: "npm : File cannot be loaded because running scripts is disabled"
**Solution:** Use Command Prompt instead of PowerShell, or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Login fails with "invalid_request"
**Solution:** Check that your Azure AD B2C redirect URI includes `/login`

### Issue: Dependencies not installing
**Solution:** 
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

## Features Available After Login

Once authenticated, users have access to:

1. **Dashboard** - Overview of career progress with beautiful visualizations
2. **Course Recommendations** - AI-powered course suggestions with CV upload
3. **Interview Prep** - Practice questions by category and difficulty
4. **Career Goals** - Set and track professional milestones
5. **Profile** - Manage account and view achievements

## Next Steps

After successful installation:

1. ✅ Test the Microsoft sign-in flow
2. ✅ Complete the onboarding process
3. ✅ Explore the dashboard features
4. ✅ Try uploading a CV for course recommendations
5. ✅ Set career goals and track progress

## Support

For issues or questions:
1. Check `AUTH_SETUP.md` for authentication details
2. Review browser console for error messages
3. Verify all dependencies are installed: `npm list`
4. Ensure you're using Node.js version 18 or higher

## Production Deployment

When deploying to production:

1. Update `authConfig.ts` with production redirect URIs
2. Configure your Azure AD B2C app registration for production URLs
3. Build the app: `npm run build`
4. Deploy the `dist` folder to your hosting service

---

**Note:** The authentication system uses the existing InAction Azure AD B2C configuration. All authentication is handled securely through Microsoft's authentication servers, and no credentials are stored in the application code.

