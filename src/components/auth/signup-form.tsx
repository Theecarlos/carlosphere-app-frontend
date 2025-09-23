import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SignupFormProps = {
  onSuccess?: () => void; // called after successful signup
  onSwitch?: () => void;  // called when switching to login tab
};

export function SignupForm({ onSuccess, onSwitch }: SignupFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://carlosphere-backend.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName, // ✅ must match backend
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("✅ Signup successful!");
        onSuccess?.(); // fire callback if parent needs it
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("❌ " + (data.error || "Signup failed"));
      }
    } catch (err) {
      setMessage("⚠️ Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="space-y-4 p-6 max-w-md mx-auto bg-white rounded-2xl shadow"
    >
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>

      <Input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

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
        {loading ? "Creating account..." : "Sign Up"}
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
        Already have an account?{" "}
        <span
          className="text-green-600 hover:underline cursor-pointer"
          onClick={onSwitch}
        >
          Login
        </span>
      </p>
    </form>
  );
}
