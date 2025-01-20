import React from "react";
import { Nav } from "react-bootstrap";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("isLoggedIn"); // ลบ cookie
    navigate("/admin"); // เปลี่ยนเส้นทางกลับไปหน้า Login
  };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#343a40",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
      }}
    >
      <h4 style={{ textAlign: "center", color: "#fff" }}>Admin Panel</h4>
      <Nav className="flex-column">
        <Nav.Link href="/manager" style={{ color: "#fff" }}>
          Dashboard
        </Nav.Link>
        <Nav.Link href="/admin" style={{ color: "#fff" }}>
          Admin Settings
        </Nav.Link>
        <Nav.Link href="#" style={{ color: "#fff" }}>
          Reports
        </Nav.Link>
        <Nav.Link
          href="#"
          style={{ color: "#fff" }}
          onClick={handleLogout} // เรียกฟังก์ชัน Logout
        >
          Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminNavbar;
