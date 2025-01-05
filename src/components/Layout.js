import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: "url('/BG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <nav
        className="navbar navbar-expand-lg"
        style={{
          position: "fixed",
          top: "0",
          width: "100%",
          zIndex: "1000",
          backgroundColor: "transparent",
        }}
      >
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src="/logo.png"
              alt="NVA Logo"
              style={{ height: "27px", width: "auto" }}
            />
          </a>
          <Link
            className="btn d-lg-none"
            to="/about"
            style={{
              backgroundColor: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              borderRadius: "100px",
              padding: "5px 20px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            About Us
          </Link>
        </div>
      </nav>

      <div style={{ marginTop: "80px" }}>{children}</div>

      <footer
        style={{
          backgroundColor: "#240C31",
          color: "#fff",
          padding: "20px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p style={{ color: "#6E5C80" }}>Lorem Ipsum is simply dummy text.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
