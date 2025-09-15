import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";

export function WalletDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("https://carlosphere-backend.onrender.com/api/wallet/balance")
      .then(res => setBalance(res.data.balance))
      .catch(err => console.error(err));

    axios.get("https://carlosphere-backend.onrender.com/api/wallet/transactions")
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  // === Actions ===
  const sendMoney = async () => {
    const res = await axios.post("https://carlosphere-backend.onrender.com/api/wallet/send", {
      to: "Mary Smith", amount: 1000
    });
    alert(res.data.message);
  };

  const receiveMoney = async () => {
    const res = await axios.post("https://carlosphere-backend.onrender.com/api/wallet/receive", {
      from: "John Doe", amount: 500
    });
    alert(res.data.message);
  };

  const topUp = async () => {
    const res = await axios.post("https://carlosphere-backend.onrender.com/api/wallet/topup", {
      amount: 2000
    });
    alert(res.data.message);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <Card className="p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">
            {showBalance ? `KES ${balance}` : "KES ••••••"}
          </h2>
          <Button variant="ghost" size="icon"
            onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff /> : <Eye />}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <Button className="flex-1" onClick={sendMoney}>
            <ArrowUpRight className="h-4 w-4 mr-2" /> Send
          </Button>
          <Button className="flex-1" onClick={receiveMoney}>
            <ArrowDownLeft className="h-4 w-4 mr-2" /> Receive
          </Button>
          <Button className="flex-1" onClick={topUp}>
            <Plus className="h-4 w-4 mr-2" /> Top Up
          </Button>
        </div>
      </Card>

      {/* Transactions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        {transactions.map((tx, i) => (
          <Card key={i} className="p-4 mb-2">
            <p>{tx.type} - {tx.amount} - {tx.status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
