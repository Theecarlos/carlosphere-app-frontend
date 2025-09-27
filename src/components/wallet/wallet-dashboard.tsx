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

  // Send Money states
  const [sendModal, setSendModal] = useState(false);
  const [sendStep, setSendStep] = useState<"options"|"peer"|"networks"|"services"|"pin"|null>(null);
  const [formData, setFormData] = useState<any>({});
  const [pin, setPin] = useState("");

  // Request Money states
  const [requestModal, setRequestModal] = useState(false);
  const [requestStep, setRequestStep] = useState<"peer"|"pin"|null>(null);
  const [requestData, setRequestData] = useState<any>({});

  // === Fetch wallet data ===
  const fetchWalletData = async () => {
    try {
      const balRes = await axios.get("https://carlosphere-backend.onrender.com/api/wallet/balance");
      setBalance(balRes.data.balance);
      setAccountNumber(balRes.data.accountNumber);

      const txRes = await axios.get("https://carlosphere-backend.onrender.com/api/wallet/transactions");
      setTransactions(txRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch wallet data");
    }
  };
  useEffect(() => { fetchWalletData(); }, []);

  // === Actions ===
  const executeSend = async () => {
    if (pin !== "1234") { toast.error("Invalid PIN"); return; }
    try {
      await new Promise(res => setTimeout(res, 800));
      toast.success("Money sent successfully!");
      fetchWalletData();
    } catch { toast.error("Transaction failed"); }
    finally { setSendModal(false); setSendStep(null); setFormData({}); setPin(""); }
  };

  const executeRequest = async () => {
    if (pin !== "1234") { toast.error("Invalid PIN"); return; }
    try {
      await new Promise(res => setTimeout(res, 800));
      toast.success("Request sent successfully!");
    } catch { toast.error("Request failed"); }
    finally { setRequestModal(false); setRequestStep(null); setRequestData({}); setPin(""); }
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
    const tableData = transactions.map((tx) => [tx.date, tx.type, `KES ${tx.amount}`, tx.status]);
    autoTable(doc, { head: [["Date", "Type", "Amount", "Status"]], body: tableData, startY: 25 });
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
          <div>
            <p className="text-sm uppercase">Total Balance</p>
            <h2 className="text-2xl font-bold mt-1">{showBalance ? `KES ${balance}` : "KES ••••••"}</h2>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Acc: {accountNumber}</p>
              <button onClick={copyAccount} className="hover:opacity-80">
                {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
              </button>
            </div>
            <Button variant="ghost" size="icon" className="text-white mt-1" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button className="bg-white text-green-600 hover:bg-gray-100"><Plus className="h-4 w-4 mr-2" /> Top Up</Button>
        </div>
      </Card>

      {/* Send & Request Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow"
          onClick={() => {setSendModal(true); setSendStep("options");}}>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-700 mb-2">
            <ArrowUpRight className="h-6 w-6 text-white" />
          </div>
          <p className="font-semibold">Send Money</p>
          <p className="text-xs text-gray-500">To anyone, anywhere</p>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow"
          onClick={() => {setRequestModal(true); setRequestStep("peer");}}>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-700 mb-2">
            <ArrowDownLeft className="h-6 w-6 text-white" />
          </div>
          <p className="font-semibold">Request Money</p>
          <p className="text-xs text-gray-500">From contacts</p>
        </Card>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Button onClick={exportToPDF} size="sm">Export PDF</Button>
        </div>
        <div className="flex space-x-2 mb-3">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded px-2 py-1">
            <option value="all">All</option><option value="credit">Credits</option><option value="debit">Debits</option>
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-8" />
          </div>
        </div>
        {filteredTx.length === 0 ? <p className="text-gray-500">No transactions found.</p> :
          filteredTx.map((tx, i) => (
            <Card key={i} className="p-4 mb-2 flex justify-between items-center">
              <div><p className="font-semibold capitalize">{tx.type}</p><p className="text-sm text-gray-500">{tx.date}</p></div>
              <p className={`font-bold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                {tx.type === "credit" ? "+" : "-"}KES {tx.amount}
              </p>
            </Card>
          ))}
      </div>

      {/* Send Money Modal Flow */}
      {sendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-6 w-96 space-y-4">
            {sendStep === "options" && (
              <>
                <h2 className="font-semibold text-lg">💸 Send Money Options</h2>
                <Button onClick={() => setSendStep("peer")} className="w-full">Peer-to-Peer (Carlowallet → Carlowallet)</Button>
                <Button onClick={() => setSendStep("networks")} className="w-full">Send to Other Networks</Button>
                <Button onClick={() => setSendStep("services")} className="w-full">Other Services</Button>
                <Button variant="ghost" onClick={() => setSendModal(false)}>Cancel</Button>
              </>
            )}
            {sendStep === "peer" && (
              <>
                <h2 className="font-semibold text-lg">Peer-to-Peer</h2>
                <Input placeholder="Recipient Account Number" onChange={e => setFormData({...formData, acc: e.target.value})}/>
                <Input placeholder="Amount" type="number" onChange={e => setFormData({...formData, amt: e.target.value})}/>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setSendStep("options")}>Cancel</Button>
                  <Button onClick={() => setSendStep("pin")}>Continue</Button>
                </div>
              </>
            )}
            {sendStep === "networks" && (
              <>
                <h2 className="font-semibold text-lg">Send to Other Networks</h2>
                <select className="border rounded px-2 py-1 w-full" onChange={e => setFormData({...formData, network: e.target.value})}>
                  <option value="">Choose Network</option>
                  <option value="mpesa">Safaricom M-Pesa</option>
                  <option value="airtel">Airtel Money</option>
                </select>
                <Input placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})}/>
                <Input placeholder="Amount" type="number" onChange={e => setFormData({...formData, amt: e.target.value})}/>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setSendStep("options")}>Cancel</Button>
                  <Button onClick={() => setSendStep("pin")}>Continue</Button>
                </div>
              </>
            )}
            {sendStep === "services" && (
              <>
                <h2 className="font-semibold text-lg">Other Services</h2>
                <select className="border rounded px-2 py-1 w-full" onChange={e => setFormData({...formData, service: e.target.value})}>
                  <option value="">Choose Service</option>
                  <option value="till">Till Number</option>
                  <option value="paybill">Paybill Services</option>
                  <option value="pochi">Pochi la Biashara</option>
                </select>
                {formData.service === "till" && (
                  <>
                    <Input placeholder="Till Number" onChange={e => setFormData({...formData, till: e.target.value})}/>
                    <Input placeholder="Amount" type="number" onChange={e => setFormData({...formData, amt: e.target.value})}/>
                  </>
                )}
                {formData.service === "paybill" && (
                  <>
                    <Input placeholder="Paybill Number" onChange={e => setFormData({...formData, paybill: e.target.value})}/>
                    <Input placeholder="Account Ref" onChange={e => setFormData({...formData, ref: e.target.value})}/>
                    <Input placeholder="Amount" type="number" onChange={e => setFormData({...formData, amt: e.target.value})}/>
                  </>
                )}
                {formData.service === "pochi" && (
                  <>
                    <Input placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})}/>
                    <Input placeholder="Amount" type="number" onChange={e => setFormData({...formData, amt: e.target.value})}/>
                  </>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setSendStep("options")}>Cancel</Button>
                  <Button onClick={() => setSendStep("pin")}>Continue</Button>
                </div>
              </>
            )}
            {sendStep === "pin" && (
              <>
                <h2 className="font-semibold text-lg">Enter CarloPIN</h2>
                <Input type="password" placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value)}/>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setSendStep("options")}>Cancel</Button>
                  <Button onClick={executeSend}>Confirm</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Request Money Modal Flow */}
      {requestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-6 w-96 space-y-4">
            {requestStep === "peer" && (
              <>
                <h2 className="font-semibold text-lg">Request Money (Peer-to-Peer)</h2>
                <Input placeholder="Account Number" onChange={e => setRequestData({...requestData, acc: e.target.value})}/>
                <Input placeholder="Amount" type="number" onChange={e => setRequestData({...requestData, amt: e.target.value})}/>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setRequestModal(false)}>Cancel</Button>
                  <Button onClick={() => setRequestStep("pin")}>Continue</Button>
                </div>
              </>
            )}
            {requestStep === "pin" && (
              <>
                <h2 className="font-semibold text-lg">Enter CarloPIN</h2>
                <Input type="password" placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value)}/>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setRequestStep("peer")}>Cancel</Button>
                  <Button onClick={executeRequest}>Confirm</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
