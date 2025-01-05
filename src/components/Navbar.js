import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "10px", color: "#fff", textDecoration: "none" }}>
        Home
      </Link>
      <Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>
        About Us
      </Link>
    </nav>
  );
};

export default Navbar;
