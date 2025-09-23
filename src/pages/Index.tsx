import { useState } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { WalletDashboard } from "@/components/wallet/wallet-dashboard";
import { ChatList } from "@/components/chat/chat-list";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

export const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case "home": return "CarloSphere";
      case "wallet": return "CarloWallet";
      case "chat": return "CarloChat";
      case "works": return "CarloWorks";
      case "learn": return "CarloLearn";
      case "community": return "CarloCommunity";
      default: return "CarloSphere One";
    }
  };

  const renderContent = () => {
    if (authMode === "login") {
      return (
        <LoginForm 
          onSuccess={() => { setIsAuthenticated(true); setAuthMode(null); }}
          onSwitch={() => setAuthMode("signup")}
        />
      );
    }
    if (authMode === "signup") {
      return (
        <SignupForm 
          onSuccess={() => { setIsAuthenticated(true); setAuthMode(null); }}
          onSwitch={() => setAuthMode("login")}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return (
          <div className="p-6 text-center space-y-6 animate-fade-in">
            <img src="/logo.png" alt="CarloSphere Logo" className="mx-auto w-32" />
            <h1 className="text-3xl font-bold">CarloSphere Technologies</h1>
            <p className="text-lg italic text-muted-foreground">
              “Solution that inspires progress.”
            </p>

            {isAuthenticated ? (
              <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-semibold">Welcome back 👋</h2>
                <p className="text-gray-600">You can now explore your wallet, chat, and more.</p>
              </div>
            ) : (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setAuthMode("login")}
                  className="px-6 py-2 bg-primary text-white rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => setAuthMode("signup")}
                  className="px-6 py-2 bg-secondary text-white rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Vision, Mission always visible */}
            <div>
              <h2 className="text-xl font-semibold mt-8">🌍 Vision</h2>
              <p>
                To become Africa’s first true SuperApp, simplifying daily life through one secure, locally-driven platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mt-4">🎯 Mission</h2>
              <p>
                To empower youth, hustlers, and communities in Africa by providing a single trusted digital ecosystem that connects money, work, learning, and life.
              </p>
            </div>
          </div>
        );

      case "wallet":
        return isAuthenticated ? (
          <WalletDashboard />
        ) : (
          <div className="p-6 text-center">
            <p className="mb-4">Please log in to access your CarloWallet.</p>
            <button
              onClick={() => setAuthMode("login")}
              className="px-6 py-2 bg-primary text-white rounded-lg"
            >
              Log In
            </button>
          </div>
        );

      case "chat":
        return isAuthenticated ? (
          <ChatList />
        ) : (
          <div className="p-6 text-center">
            <p className="mb-4">Please log in to access CarloChat.</p>
            <button
              onClick={() => setAuthMode("login")}
              className="px-6 py-2 bg-primary text-white rounded-lg"
            >
              Log In
            </button>
          </div>
        );

      case "works":
        return (
          <div className="p-4 text-center py-20 animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">CarloWorks</h3>
            <p className="text-muted-foreground">Find jobs and showcase your skills</p>
            <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
          </div>
        );

      case "learn":
        return (
          <div className="p-4 text-center py-20 animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">CarloLearn</h3>
            <p className="text-muted-foreground">Learn new skills and earn certificates</p>
            <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
          </div>
        );

      case "community":
        return (
          <div className="p-4 text-center py-20 animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">CarloCommunity</h3>
            <p className="text-muted-foreground">Connect with events and voting</p>
            <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
          </div>
        );

      default:
        return <WalletDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader title={getPageTitle(activeTab)} />
      <main className="flex-1 pb-16 overflow-y-auto">{renderContent()}</main>
      {/* ✅ pass isAuthenticated here */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isAuthenticated={isAuthenticated} 
      />
    </div>
  );
};

export default Index;
