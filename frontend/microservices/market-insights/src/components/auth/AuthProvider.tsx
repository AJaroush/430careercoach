import { createContext, useContext } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig";
import { signInWithGoogleReal } from "@/lib/realGoogleAuth";
import { signInWithMicrosoftReal } from "@/lib/realMicrosoftAuth";
import { showEmailVerificationModal } from "@/lib/emailVerification";
import { useNavigate } from "react-router-dom";
import type { AccountInfo } from "@azure/msal-browser";

interface AuthContextType {
  user: AccountInfo | null;
  login: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const user = accounts.length > 0 ? accounts[0] : null;

  const login = async (provider: string) => {
    try {
      console.log("Starting login for provider:", provider);
      console.log("Login request config:", loginRequest);
      console.log("MSAL instance config:", instance.getConfiguration());
      
      let response;
      
      if (provider === "microsoft") {
        // Show Microsoft account selection (placeholder for SQL implementation)
        console.log("Showing Microsoft account selection...");
        
        const msResult = await signInWithMicrosoftReal();
        
        if (msResult.success && msResult.user) {
          // Store user data (placeholder - will use SQL later)
          const userData = {
            id: 'ms-' + Date.now(),
            email: msResult.user.username || '',
            name: msResult.user.name || 'Microsoft User',
            provider: 'microsoft',
            createdAt: new Date()
          };
          
          console.log('AuthProvider: Storing Microsoft user:', userData);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          navigate("/dashboard");
        } else {
          console.log("Microsoft account selection cancelled");
        }
      } else if (provider === "google") {
        // Show Google account selection (placeholder for SQL implementation)
        console.log("Showing Google account selection...");
        
        const googleResult = await signInWithGoogleReal();
        
        if (googleResult.success && googleResult.user) {
          // Store user data (placeholder - will use SQL later)
          const userData = {
            id: 'google-' + Date.now(),
            email: googleResult.user.email || '',
            name: googleResult.user.name || 'Google User',
            provider: 'google',
            createdAt: new Date()
          };
          
          console.log('AuthProvider: Storing Google user:', userData);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          navigate("/dashboard");
        } else {
          console.log("Google account selection cancelled");
        }
      } else {
        console.error("Unsupported provider:", provider);
        return;
      }

    } catch (error: any) {
      console.error("Authentication failed:", error);
      alert(`Authentication failed: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  const logout = async () => {
    const logoutRequest = {
      postLogoutRedirectUri: window.location.origin,
      mainWindowRedirectUri: window.location.origin
    };
    
    try {
      await instance.logoutPopup(logoutRequest);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('onboardingComplete');
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      // Fallback: clear local state and navigate
      localStorage.removeItem('auth_user');
      localStorage.removeItem('onboardingComplete');
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

