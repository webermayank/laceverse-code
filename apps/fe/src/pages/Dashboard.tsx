import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-background text-ui rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">Dashboard</h2>
      <p>Welcome, {user.username}!</p>
      {user.role === "Admin" ? (
        <p>You have admin privileges.</p>
      ) : (
        <p>You are logged in as a user.</p>
      )}
      <button
        onClick={handleLogout}
        className="mt-4 w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
