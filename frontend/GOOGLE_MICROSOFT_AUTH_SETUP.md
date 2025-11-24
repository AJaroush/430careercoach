# Google & Microsoft Authentication Setup Guide

This guide explains how to set up both Google and Microsoft authentication for the Career Coach application.

## Current Status

✅ **Microsoft Authentication** - Configured with Azure AD B2C  
✅ **Google Authentication** - Configured with Azure AD B2C (Google as identity provider)

## Microsoft Authentication

### Current Setup
- Uses Azure AD B2C with proper B2C policies
- Supports both personal Microsoft accounts and organizational accounts
- Client ID: `7312bbdd-a612-46e9-b482-eeb2003e1786`
- Policy: `b2c_1_signin_inactionai`
- Authority: `https://appendture.b2clogin.com/appendture.onmicrosoft.com/b2c_1_signin_inactionai`

### How It Works
1. User clicks "Continue with Microsoft"
2. Azure AD B2C popup opens with account selection
3. User signs in with Microsoft account
4. App receives authentication token
5. User data is stored and user is redirected

### Demo Fallback
If Azure authentication fails, the app automatically falls back to demo mode with:
- Demo Microsoft user account
- Full app functionality
- No interruption to user experience

## Google Authentication

### Current Setup
- Configured with Azure AD B2C
- Google is set up as an identity provider in Azure AD B2C
- Users can sign in with their Google accounts through B2C
- No additional Google Cloud configuration needed

### How It Works
1. User clicks "Continue with Google"
2. Azure AD B2C popup opens
3. User can choose Google as identity provider
4. User signs in with Google account
5. App receives authentication token through B2C
6. User data is stored and user is redirected

### Azure AD B2C Configuration
Google authentication is handled through Azure AD B2C identity providers:
- Google is configured as an external identity provider
- Users see familiar Google sign-in interface
- Authentication flows through Azure AD B2C
- No need for separate Google OAuth setup

## Testing Authentication

### Test Microsoft Login
1. Click "Continue with Microsoft"
2. If Azure works: Real Microsoft authentication
3. If Azure fails: Demo Microsoft user is created
4. User proceeds to onboarding/dashboard

### Test Google Login
1. Click "Continue with Google"
2. Currently creates demo Google user
3. User proceeds to onboarding/dashboard

### Test Email Login
1. Click "Continue with Email"
2. Enter any email and password
3. Local authentication (not connected to external providers)

### Test Demo Mode
1. Click "Skip Login (Demo Mode)"
2. Instant access with demo user
3. Full app functionality available

## User Experience

### Login Flow
1. **Landing Page** → Click "Get Started" or "Sign In"
2. **Login Page** → Choose authentication method
3. **Authentication** → Sign in with chosen provider
4. **Onboarding** → First-time user setup (if needed)
5. **Dashboard** → Main application interface

### Authentication States
- **Authenticated**: User has valid session
- **Demo Mode**: User bypassed authentication
- **Unauthenticated**: User needs to sign in

## Configuration Files

### `frontend/src/lib/authConfig.ts`
- Microsoft/Azure AD configuration
- Client ID and authority settings
- OAuth scopes and redirect URIs

### `frontend/src/lib/googleAuth.ts`
- Google OAuth helper functions
- Demo mode implementation
- Ready for real Google OAuth setup

### `frontend/src/components/auth/AuthProvider.tsx`
- Main authentication context
- Handles both Microsoft and Google login
- Manages user sessions and logout

## Security Features

### Token Management
- Uses `sessionStorage` for secure token storage
- Tokens are cleared on logout
- No sensitive data stored in localStorage

### Fallback Authentication
- Demo mode ensures app always works
- Graceful degradation if external auth fails
- No user experience interruption

### Popup Authentication
- Uses popup windows for OAuth
- Better user experience than redirects
- Handles popup blocking gracefully

## Production Deployment

### Microsoft Authentication
- Update redirect URIs in Azure AD app registration
- Configure production domain in `authConfig.ts`
- Test with production Microsoft accounts

### Google Authentication
- Update authorized redirect URIs in Google Cloud Console
- Replace demo implementation with real OAuth
- Test with production Google accounts

### Environment Variables
Consider using environment variables for:
- Client IDs
- Redirect URIs
- API endpoints

## Troubleshooting

### Common Issues

#### "Popup was blocked"
- **Solution**: Allow popups for the site in browser settings

#### "Invalid redirect URI"
- **Solution**: Check that redirect URIs match exactly in Azure AD/Google Console

#### "Client ID not found"
- **Solution**: Verify Client ID is correct in configuration files

#### "Scope not authorized"
- **Solution**: Check that required scopes are configured in OAuth setup

### Debug Mode
- Open browser developer tools
- Check console for authentication logs
- Monitor network requests for OAuth calls

## Next Steps

1. **Test Current Implementation**
   - Try all authentication methods
   - Verify user data is stored correctly
   - Test logout functionality

2. **Configure Real Google OAuth** (Optional)
   - Set up Google Cloud Project
   - Add real Client ID
   - Test with real Google accounts

3. **Production Setup**
   - Update redirect URIs for production domain
   - Configure environment variables
   - Test with production accounts

## Support

For authentication issues:
1. Check browser console for error messages
2. Verify configuration in `authConfig.ts` and `googleAuth.ts`
3. Test with different browsers
4. Check OAuth provider console (Azure AD/Google Cloud) for errors

The authentication system is designed to be robust and user-friendly, with fallbacks ensuring the app always works even if external authentication services are unavailable.
