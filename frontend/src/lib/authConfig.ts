import { Configuration, PopupRequest } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: "7312bbdd-a612-46e9-b482-eeb2003e1786",
    authority: "https://appendture.b2clogin.com/appendture.onmicrosoft.com/b2c_1_signin_inactionai",
    knownAuthorities: ["appendture.b2clogin.com"],
    redirectUri: typeof window !== "undefined" ? window.location.origin + "/login" : "/login",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 */
export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", "email"],
};

