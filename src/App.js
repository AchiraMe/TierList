import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home"; // Import หน้า Home
import About from "./pages/About"; // Import หน้า About

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Router>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          position: "fixed",
          top: "0",
          width: "100%",
          zIndex: "1000",
          backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.9)" : "transparent",
          transition: "background-color 0.3s ease-in-out",
          color: "#fff",
        }}
      >
        <div className="container">
          <a className="navbar-brand" href="#">
            <img
              src="/logo.png"
              alt="NVA Logo"
              style={{ height: "27px", width: "auto" }}
            />
          </a>

          {/* ปุ่มสำหรับทุกขนาดหน้าจอ */}
          <div id="navbarNav" style={{ display: "flex", marginLeft: "auto" }}>
            <a
              className="btn"
              href="/about"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #fff",
                color: "#fff",
                borderRadius: "100px",
                padding: "6px 20px",
                fontWeight: "bold",
                textDecoration: "none",
                marginRight: "10px",
              }}
            >
              About Us
            </a>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
