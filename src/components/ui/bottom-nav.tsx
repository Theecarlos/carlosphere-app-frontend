import { cn } from "@/lib/utils";
import {
  Home,
  Wallet,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Users,
} from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAuthenticated: boolean; // add this
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "wallet", icon: Wallet, label: "Wallet" },
  { id: "chat", icon: MessageCircle, label: "Chat" },
  { id: "works", icon: Briefcase, label: "Works" },
  { id: "learn", icon: GraduationCap, label: "Learn" },
  { id: "community", icon: Users, label: "Community" },
];

export function BottomNav({ activeTab, onTabChange, isAuthenticated }: BottomNavProps) {
  // show only home if not logged in
  const visibleNavItems = isAuthenticated
    ? navItems
    : navItems.filter((item) => item.id === "home");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-1">
        {visibleNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
