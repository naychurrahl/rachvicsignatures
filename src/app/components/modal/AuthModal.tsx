import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useApp } from "@/app/contexts/AppContext";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";

export default function AuthModal() {
  const { modalOpen, modalScreen, closeModal, login } = useApp();

  const navigate = useNavigate();

  const [screen, setScreen] = useState(modalScreen);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setScreen(modalScreen);
  }, [modalScreen]);

  if (!modalOpen) return null;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await ApiRequest({
        url: `${baseUrl}/user`,
        method: "POST",
        body: { name, email, password },
      });
      
      //console.log(res);
      login(res);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await ApiRequest({
        url: `${baseUrl}/auth`,
        method: "POST",
        body: { email, password },
      });

      //console.log({ sent: {email, password}, res: res});
      //const data = await res.json();
      //if (!res.ok) return setError(data.message || "Invalid credentials");
      console.log(res);
      login(res.user);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setScreen("reset-sent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        {screen === "login" && (
          <form onSubmit={handleLogin}>
            <h2 className="text-xl font-medium mb-1">Sign in</h2>
            <p className="text-sm text-gray-500 mb-6">
              No account?{" "}
              <button
                type="button"
                onClick={() => setScreen("register")}
                className="text-blue-600 underline"
              >
                Register
              </button>
            </p>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">
                {error}
              </p>
            )}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="flex text-right justify-between mt-3 gap-2 w-full">
              <button
                type="button"
                onClick={() => closeModal(true) }
                className="text-sm text-red-600 underline"
              >
                Guest?
              </button>
              <button
                type="button"
                onClick={() => setScreen("forgot")}
                className="text-sm text-blue-600 underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
        )}

        {screen === "register" && (
          <form onSubmit={handleRegister}>
            <h2 className="text-xl font-medium mb-1">Create account</h2>
            <p className="text-sm text-gray-500 mb-6">
              Have an account?{" "}
              <button
                type="button"
                onClick={() => setScreen("login")}
                className="text-blue-600 underline"
              >
                Sign in
              </button>
            </p>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                User name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Jane Smith"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800"
            >
              Create account
            </button>
          </form>
        )}

        {screen === "forgot" && (
          <form onSubmit={handleForgot}>
            <button
              type="button"
              onClick={() => setScreen("login")}
              className="text-sm text-gray-500 mb-4 flex items-center gap-1 hover:text-gray-800"
            >
              ← Back
            </button>
            <h2 className="text-xl font-medium mb-1">Reset password</h2>
            <p className="text-sm text-gray-500 mb-6">
              We'll send a reset link to your email.
            </p>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        {screen === "reset-sent" && (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✉️
            </div>
            <h2 className="text-xl font-medium mb-2">Check your inbox</h2>
            <p className="text-sm text-gray-500 mb-6">
              Reset link sent. Expires in 30 minutes.
            </p>
            <button
              onClick={() => setScreen("login")}
              className="text-sm text-blue-600 underline"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
