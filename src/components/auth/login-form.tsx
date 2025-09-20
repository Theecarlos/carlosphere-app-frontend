import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://carlosphere-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token); // Save JWT
        localStorage.setItem("user", JSON.stringify(data.user)); // Save user info
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/wallet-dashboard"), 1500);
      } else {
        setMessage("❌ " + (data.error || "Login failed"));
      }
    } catch (err) {
      setMessage("⚠️ Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4 p-6 max-w-md mx-auto bg-white rounded-2xl shadow"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("❌")
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-center text-sm mt-2">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-green-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
