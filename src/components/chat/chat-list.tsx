import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ChatList() {
  const chats = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how are you doing?",
      time: "2:30 PM",
      unread: 2,
      avatar: "/placeholder-user.jpg",
      online: true
    },
    {
      id: 2,
      name: "CarloWorks Team",
      lastMessage: "New job opportunity available!",
      time: "1:15 PM",
      unread: 0,
      avatar: "/placeholder-group.jpg",
      online: false,
      isGroup: true
    },
    {
      id: 3,
      name: "Mary Smith",
      lastMessage: "Thanks for the help earlier",
      time: "11:45 AM",
      unread: 0,
      avatar: "/placeholder-user2.jpg",
      online: true
    },
    {
      id: 4,
      name: "Study Group",
      lastMessage: "Meeting at 3 PM today",
      time: "10:20 AM",
      unread: 5,
      avatar: "/placeholder-group2.jpg",
      online: false,
      isGroup: true
    }
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            className="pl-10 bg-muted/50"
          />
        </div>
      </div>

      {/* Stories Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <div className="flex flex-col items-center space-y-1 min-w-fit">
            <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-muted-foreground">Your Story</span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-1 min-w-fit">
              <div className="w-14 h-14 p-0.5 gradient-secondary rounded-full">
                <Avatar className="w-full h-full">
                  <AvatarImage src={`/story-${i}.jpg`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-muted-foreground">User {i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {chats.map((chat) => (
            <Card key={chat.id} className="p-3 card-hover cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>
                      {chat.isGroup ? (
                        <MessageCircle className="h-6 w-6" />
                      ) : (
                        chat.name.charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && !chat.isGroup && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-card rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{chat.name}</h4>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 min-w-[20px] h-5 rounded-full text-xs bg-primary text-primary-foreground">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-20 right-4">
        <Button size="icon" className="w-14 h-14 rounded-full gradient-primary shadow-lg">
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}