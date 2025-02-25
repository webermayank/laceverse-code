import axios from "axios";
import React, { useState } from "react";
import { VITE_HTTP_URL } from "./Config";

interface SignupProps {
  onClose?: () => void; // Optional prop for closing the modal
}

const Signup: React.FC<SignupProps> = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");
  const [message, setMessage] = useState("");

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${VITE_HTTP_URL}/signup`, {
        username,
        password,
        type,
      });
      setMessage(`Signup successful! User ID: ${response.data.userId}`);
      console.log(response.data.token)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Log the error response from the server
        console.error("Error response:", error.response.data);
        setMessage(
          `Signup failed: ${error.response.data.message || "Please try again."}`
        );
      } else {
        console.error("Error:", error);
        setMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-background text-ui rounded-lg shadow-md">
      {onClose && (
        <button
          onClick={onClose}
          className="float-right text-secondary hover:text-accent"
        >
          Close
        </button>
      )}
      <h2 className="text-2xl font-bold mb-4 text-primary">Signup</h2>
      <form onSubmit={handleSignup} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-secondary">
            Type:
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-ui border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-background font-semibold rounded-md shadow hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Signup
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-accent">{message}</p>}
    </div>
  );
};

export default Signup;
