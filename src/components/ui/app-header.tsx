import { Bell, Search, User } from "lucide-react";
import { Button } from "./button";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

interface AppHeaderProps {
  title: string;
  showSearch?: boolean;
  showProfile?: boolean;
  showNotifications?: boolean;
}

export function AppHeader({ 
  title, 
  showSearch = false, 
  showProfile = true, 
  showNotifications = true 
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {showSearch && (
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {showNotifications && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
            </Button>
          )}

          {showProfile && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
}