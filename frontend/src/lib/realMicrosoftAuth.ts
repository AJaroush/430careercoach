import { msalInstance } from "./msalInstance";
import { loginRequest } from "./authConfig";

/**
 * Microsoft user interface
 */
export interface MicrosoftUser {
  username: string;
  name: string;
  idToken?: string;
}

export interface MicrosoftAuthResult {
  success: boolean;
  user?: MicrosoftUser;
  error?: string;
}

/**
 * Sign in with Microsoft using Azure AD B2C
 */
export async function signInWithMicrosoftReal(): Promise<MicrosoftAuthResult> {
  try {
    const accounts = msalInstance.getAllAccounts();
    
    // If user is already logged in, return their account
    if (accounts.length > 0) {
      const account = accounts[0];
      return {
        success: true,
        user: {
          username: account.username || "",
          name: account.name || "Microsoft User",
          idToken: account.idToken,
        },
      };
    }

    // Attempt to login via popup
    const response = await msalInstance.loginPopup(loginRequest);
    
    if (response && response.account) {
      return {
        success: true,
        user: {
          username: response.account.username || "",
          name: response.account.name || "Microsoft User",
          idToken: response.idToken,
        },
      };
    }

    return {
      success: false,
      error: "No account information received",
    };
  } catch (error: any) {
    // Handle popup blocked or user cancellation
    if (error.errorCode === "user_cancelled" || error.errorCode === "popup_window_error") {
      return {
        success: false,
        error: "User cancelled or popup was blocked",
      };
    }

    return {
      success: false,
      error: error.message || "Microsoft authentication failed",
    };
  }
}

