import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./lib/msalInstance";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AppLayout } from "./components/app-layout";
import InterviewPrep from "./InterviewPrep";

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <AppLayout>
                <InterviewPrep />
              </AppLayout>
            </div>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;
