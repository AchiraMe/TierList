import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin/Admin";
import Manager from "./pages/Admin/Manager";
import Tierlist from "./pages/Admin/Tierlist";
import Character from "./pages/Admin/Character";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /> </>} />
        <Route path="/about" element={<><Navbar /><About /></>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/tierlist" element={<Tierlist />} />
        <Route path="/character" element={<Character />} />
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <Manager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tierlist"
          element={
            <ProtectedRoute>
              <Tierlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/character"
          element={
            <ProtectedRoute>
              <Character />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
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
        <a className="navbar-brand" href="/">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "27px", width: "auto" }}
          />
        </a>
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
  );
};

export default App;
