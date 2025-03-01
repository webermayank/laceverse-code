import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    try {
      await login(username, password);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-background text-ui rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary">
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-ui border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-ui border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-background font-semibold rounded-md shadow hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-accent">{message}</p>}
    </div>
  );
};

export default Login;
