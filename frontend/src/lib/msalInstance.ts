import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

/**
 * MSAL PublicClientApplication instance
 */
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
msalInstance.initialize().then(() => {
  console.log("MSAL initialized successfully");
}).catch((error) => {
  console.error("MSAL initialization error:", error);
});

