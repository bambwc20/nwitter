import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <Link to="/">Home</Link>
      </ul>
      <ul>
        <Link to="/profile">My Profile</Link>
      </ul>
    </nav>
  );
};

export default Navigation;
