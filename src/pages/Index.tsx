import { useState } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { WalletDashboard } from "@/components/wallet/wallet-dashboard";
import { ChatList } from "@/components/chat/chat-list";

const Index = () => {
  const [activeTab, setActiveTab] = useState("wallet");

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case "wallet":
        return "CarloWallet";
      case "chat":
        return "CarloChat";
      case "works":
        return "CarloWorks";
      case "learn":
        return "CarloLearn";
      case "community":
        return "CarloCommunity";
      default:
        return "CarloSphere One";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "wallet":
        return <WalletDashboard />;
      case "chat":
        return <ChatList />;
      case "works":
        return (
          <div className="p-4 space-y-6 animate-fade-in">
            <div className="text-center py-20">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">CarloWorks</h3>
              <p className="text-muted-foreground">Find jobs and showcase your skills</p>
              <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </div>
        );
      case "learn":
        return (
          <div className="p-4 space-y-6 animate-fade-in">
            <div className="text-center py-20">
              <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">CarloLearn</h3>
              <p className="text-muted-foreground">Learn new skills and earn certificates</p>
              <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </div>
        );
      case "community":
        return (
          <div className="p-4 space-y-6 animate-fade-in">
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">CarloCommunity</h3>
              <p className="text-muted-foreground">Connect with events and voting</p>
              <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <WalletDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader title={getPageTitle(activeTab)} />
      
      <main className="flex-1 pb-16 overflow-y-auto">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;