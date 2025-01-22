import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminNavbar from "../../components/AdminNavbar";

const Tierlist = () => {
  const token = Cookies.get("token"); // ใช้ token แทน isLoggedIn

  if (!token) {
    return <Navigate to="/admin" />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Admin Navbar ด้านซ้าย */}
      <AdminNavbar />

      {/* เนื้อหาหลัก */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Welcome to the Tierlist Dashboard</h1>
        <p>This is the main content area of the manager page.</p>
      </div>
    </div>
  );
};

export default Tierlist;
