# Azure AD B2C Authentication Setup

This application uses Azure AD B2C for authentication with Microsoft and Google sign-in.

## Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

The following packages have been added for authentication:
- `@azure/msal-browser` - Microsoft Authentication Library for browser
- `@azure/msal-react` - React wrapper for MSAL

## Configuration

The authentication is configured in `frontend/src/lib/authConfig.ts` with the following settings:

- **Tenant:** appendture.onmicrosoft.com
- **Policy:** b2c_1_signin_inactionai
- **Client ID:** 7312bbdd-a612-46e9-b482-eeb2003e1786
- **Authority:** https://appendture.b2clogin.com/appendture.onmicrosoft.com/b2c_1_signin_inactionai

## How It Works

### 1. **MSAL Provider**
The app is wrapped with `MsalProvider` in `App.tsx`, which provides authentication context throughout the application.

### 2. **AuthProvider**
A custom `AuthProvider` component (`frontend/src/components/auth/AuthProvider.tsx`) wraps the authentication logic and provides:
- `login(provider)` - Initiates login with Microsoft or Google
- `logout()` - Logs out the user
- `user` - Current authenticated user
- `isAuthenticated` - Authentication status

### 3. **Login Flow**
1. User clicks "Continue with Microsoft" or "Continue with Google"
2. Azure AD B2C popup window opens
3. User authenticates with their Microsoft/Google account
4. On success, user is redirected to:
   - `/onboarding` - If first-time user
   - `/dashboard` - If returning user

### 4. **Logout Flow**
1. User clicks logout from the profile dropdown
2. Azure AD B2C logout popup opens
3. User session is cleared
4. User is redirected to landing page

## Features

- ✅ **Microsoft Authentication** - Fully functional via Azure AD B2C
- ⚠️ **Google Authentication** - Requires additional configuration in Azure AD B2C
- ✅ **Email/Password** - Local authentication (fallback, not connected to Azure)
- ✅ **Demo Mode** - Skip login for testing purposes
- ✅ **Persistent Sessions** - Uses sessionStorage for token caching
- ✅ **Automatic Redirects** - Smart routing based on onboarding status

## Running the App

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## Notes

### Google Sign-In
Currently, Google sign-in shows an alert that it requires configuration in Azure AD B2C. To enable Google:
1. Configure Google as an identity provider in your Azure AD B2C tenant
2. Update the sign-in policy to include Google
3. Update `authConfig.ts` if needed

### Demo Mode
The "Skip Login (Demo Mode)" button allows you to bypass authentication for testing. This creates a local demo user without connecting to Azure AD B2C.

### Security
- All authentication tokens are stored in `sessionStorage` (more secure than localStorage)
- Popup authentication is used instead of redirects for better UX
- PKCE (Proof Key for Code Exchange) is automatically used by MSAL for security

## Troubleshooting

### Popup Blocked
If you see a "popup_window_error", allow popups for the site in your browser settings.

### Invalid Request
Check that the redirect URI in Azure AD B2C matches your local development URL (should include `/login`).

### CORS Issues
Make sure the Azure AD B2C tenant has proper CORS settings configured.

## File Structure

```
frontend/src/
├── lib/
│   ├── authConfig.ts          # Azure AD B2C configuration
│   └── msalInstance.ts        # MSAL instance initialization
├── components/
│   ├── auth/
│   │   └── AuthProvider.tsx   # Authentication context provider
│   └── app-header.tsx         # Header with logout functionality
├── pages/
│   └── Login.tsx              # Login page with social auth buttons
└── App.tsx                    # App wrapper with MsalProvider
```

## Additional Resources

- [Azure AD B2C Documentation](https://docs.microsoft.com/azure/active-directory-b2c/)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)

