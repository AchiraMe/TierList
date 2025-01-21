import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      error: "", // เก็บข้อความแสดงข้อผิดพลาด
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = async () => {
    const { email, password } = this.state;

    try {
      // เรียก API เพื่อนำข้อมูลผู้ใช้มาเปรียบเทียบ
      const response = await fetch("https://api.lemansturismo.com/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      // ตรวจสอบว่าผู้ใช้งานมีในฐานข้อมูลหรือไม่
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        // ตั้งค่า cookie และเปลี่ยนเส้นทาง
        Cookies.set("isLoggedIn", "true", { expires: 1 });
        this.setState({ isLoggedIn: true });
      } else {
        // หากไม่พบข้อมูลให้แสดงข้อผิดพลาด
        this.setState({ error: "Invalid email or password." });
      }
    } catch (error) {
      this.setState({ error: "An error occurred while logging in." });
      console.error(error);
    }
  };

  render() {
    const { email, password, isLoggedIn, error } = this.state;

    if (isLoggedIn) {
      return <Navigate to="/manager" />;
    }

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Admin Login</h1>
        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
        )}
        <form
          style={{
            display: "inline-block",
            textAlign: "left",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
            />
          </div>

          <button
            type="button"
            onClick={this.handleLogin}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default Admin;
