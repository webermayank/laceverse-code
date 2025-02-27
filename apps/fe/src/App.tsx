import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Arena from "./components/Arena";
import Navbar from "./components/Navbar";
import "./App.css";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProjectedRoutes";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {" "}
        {/* ✅ No need for BrowserRouter inside App.tsx */}
        <Route path="/" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/arena" element={<Arena />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navbar />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
