import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, Copy, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

export function WalletDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState("0.00");
  const [accountNumber, setAccountNumber] = useState("••••");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [pinModal, setPinModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [pin, setPin] = useState("");

  // === Fetch wallet data ===
  const fetchWalletData = async () => {
    try {
      const balRes = await axios.get(
        "https://carlosphere-backend.onrender.com/api/wallet/balance"
      );
      setBalance(balRes.data.balance);
      setAccountNumber(balRes.data.accountNumber);

      const txRes = await axios.get(
        "https://carlosphere-backend.onrender.com/api/wallet/transactions"
      );
      setTransactions(txRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch wallet data");
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  // === Actions ===
  const confirmAction = (action: string) => {
    setPendingAction(action);
    setPinModal(true);
  };

  const executeAction = async () => {
    if (pin !== "1234") { // demo PIN check
      toast.error("Invalid PIN");
      return;
    }

    try {
      let res;
      if (pendingAction === "send") {
        res = await axios.post(
          "https://carlosphere-backend.onrender.com/api/wallet/send",
          { to: "Mary Smith", amount: 1000 }
        );
      } else if (pendingAction === "request") {
        res = await axios.post(
          "https://carlosphere-backend.onrender.com/api/wallet/request",
          { from: "John Doe", amount: 500 }
        );
      } else if (pendingAction === "topup") {
        res = await axios.post(
          "https://carlosphere-backend.onrender.com/api/wallet/topup",
          { amount: 2000 }
        );
      }
      toast.success(res?.data?.message || "Action complete");
      fetchWalletData();
    } catch (err) {
      toast.error("Transaction failed");
    } finally {
      setPinModal(false);
      setPin("");
      setPendingAction(null);
    }
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // === Export Transactions to PDF ===
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Statement", 14, 15);

    const tableData = transactions.map((tx) => [
      tx.date,
      tx.type,
      `KES ${tx.amount}`,
      tx.status,
    ]);

    autoTable(doc, {
      head: [["Date", "Type", "Amount", "Status"]],
      body: tableData,
      startY: 25,
    });

    doc.save("transactions.pdf");
    toast.success("Transactions exported to PDF");
  };

  // === Filters ===
  const filteredTx = transactions.filter((tx) => {
    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesSearch = tx.type.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <Card className="p-6 bg-green-500 text-white rounded-2xl shadow">
        <div className="flex justify-between items-start">
          {/* Left Side: Balance */}
          <div>
            <p className="text-sm uppercase">Total Balance</p>
            <h2 className="text-2xl font-bold mt-1">
              {showBalance ? `KES ${balance}` : "KES ••••••"}
            </h2>
          </div>

          {/* Right Side: Account Number */}
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Acc: {accountNumber}</p>
              <button onClick={copyAccount} className="hover:opacity-80">
                {copied ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <Copy className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white mt-1"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>

        {/* Top Up Button centered */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => confirmAction("topup")}
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" /> Top Up
          </Button>
        </div>
      </Card>

      {/* Send & Request Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className="p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow"
          onClick={() => confirmAction("send")}
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-700 mb-2">
            <ArrowUpRight className="h-6 w-6 text-white" />
          </div>
          <p className="font-semibold">Send Money</p>
          <p className="text-xs text-gray-500">To anyone, anywhere</p>
        </Card>

        <Card
          className="p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow"
          onClick={() => confirmAction("request")}
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-700 mb-2">
            <ArrowDownLeft className="h-6 w-6 text-white" />
          </div>
          <p className="font-semibold">Request Money</p>
          <p className="text-xs text-gray-500">From contacts</p>
        </Card>
      </div>

      {/* Transactions with filters */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="flex space-x-2">
            <Button onClick={exportToPDF} size="sm">Export PDF</Button>
          </div>
        </div>
        <div className="flex space-x-2 mb-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8"
            />
          </div>
        </div>
        {filteredTx.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          filteredTx.map((tx, i) => (
            <Card key={i} className="p-4 mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold capitalize">{tx.type}</p>
                <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
              <p
                className={`font-bold ${
                  tx.type === "credit" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type === "credit" ? "+" : "-"}KES {tx.amount}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* PIN Modal */}
      {pinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-6 w-80 space-y-4">
            <h2 className="font-semibold text-lg">Enter CarloPIN</h2>
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setPinModal(false)}>
                Cancel
              </Button>
              <Button onClick={executeAction}>Confirm</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
