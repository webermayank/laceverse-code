import React from "react";
import { Routes, Route } from "react-router-dom";
// import Arena from "./components/Arena";
import Navbar from "./components/Navbar";
import "./App.css";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navbar />} />
        {/* <Route path="/" element={<Arena />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
