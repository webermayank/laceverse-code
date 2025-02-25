import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import Hero from "./Hero";

const Navbar: React.FC = () => {
  return (
    <><nav className="flex justify-around items-center bg-background p-2 bg-amber-500 rounded-b-md fixed w-full">
      <div className="flex items-center">
        <img src={logo} alt="Laceverse Logo" className="h-12" />
        <a href="" className="text-lg p-2 font-sigmar font-bold">
          LaceVerse
        </a>
      </div>
      <ul className="flex space-x-8">
        <li>
          <a href="#about" className="text-ui">
            About
          </a>
        </li>
        <li>
          <a href="#explore" className="text-ui">
            Explore
          </a>
        </li>
        <li>
          <a href="#explore" className="text-ui">
            Customer Support
          </a>
        </li>
        <li>
          <a href="#pricing" className="text-ui">
            Pricing
          </a>
        </li>
      </ul>
      <div>
        <Link to="/signup" className="ml-4 text-ui">
          Sign Up
        </Link>
      </div>
    </nav><Hero />
    </>
  );
};

export default Navbar;
