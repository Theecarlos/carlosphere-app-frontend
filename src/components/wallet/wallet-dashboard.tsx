import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff, 
  Plus,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState } from "react";

export function WalletDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = "25,420.50";

  const recentTransactions = [
    {
      id: 1,
      type: "received",
      amount: "5,000.00",
      from: "John Doe",
      status: "completed",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "sent",
      amount: "1,250.00",
      to: "Mary Smith",
      status: "pending",
      time: "5 hours ago"
    },
    {
      id: 3,
      type: "sent",
      amount: "300.00",
      to: "Alex Johnson",
      status: "completed",
      time: "1 day ago"
    }
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Balance Card */}
      <Card className="gradient-primary text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/80 text-sm">Total Balance</p>
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl font-bold">
                {showBalance ? `KES ${balance}` : "KES ••••••"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">Account</p>
            <p className="text-white font-medium">•••• 4521</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Receive
          </Button>
          <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
            <Plus className="h-4 w-4 mr-2" />
            Top Up
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 card-hover cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-2">
              <ArrowUpRight className="h-6 w-6 text-white" />
            </div>
            <p className="font-medium">Send Money</p>
            <p className="text-xs text-muted-foreground">To anyone, anywhere</p>
          </div>
        </Card>
        
        <Card className="p-4 card-hover cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
              <ArrowDownLeft className="h-6 w-6 text-white" />
            </div>
            <p className="font-medium">Request Money</p>
            <p className="text-xs text-muted-foreground">From contacts</p>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4 card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "received" ? "bg-success/10" : "bg-primary/10"
                  }`}>
                    {transaction.type === "received" ? (
                      <ArrowDownLeft className={`h-5 w-5 ${
                        transaction.type === "received" ? "text-success" : "text-primary"
                      }`} />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.type === "received" ? transaction.from : transaction.to}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">{transaction.time}</p>
                      <Badge 
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {transaction.status === "completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : transaction.status === "pending" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === "received" ? "text-success" : "text-foreground"
                  }`}>
                    {transaction.type === "received" ? "+" : "-"}KES {transaction.amount}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}