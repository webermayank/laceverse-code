import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

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
    </div>
  );
};

export default Dashboard;
