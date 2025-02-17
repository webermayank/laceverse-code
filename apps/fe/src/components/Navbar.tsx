import React from "react";
import logo from "../images/logo.png";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-around items-center bg-background p-4">
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
        <a href="#signin" className="text-ui">
          Sign In
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
