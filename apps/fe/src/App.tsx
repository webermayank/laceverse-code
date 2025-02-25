import React from "react";
import { Routes, Route } from "react-router-dom";
import Arena from "./components/Arena";

import Navbar from "./components/Navbar";
import "./App.css";
import Signup from "./components/Signup";
// require("dotenv").config();

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar/>} />
        <Route path="/" element={<div>Home</div>} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/signup" element={<Signup />} />{" "}
        {/* Add the Signup route */}
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
