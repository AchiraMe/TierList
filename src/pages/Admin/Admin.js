import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Service from "../../api/server"; // นำเข้า Service class

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoggedIn: false,
      error: "", // เก็บข้อความแสดงข้อผิดพลาด
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  submitLogin = async () => {
    const { username, password } = this.state;

    if (!username || !password) {
      this.setState({ error: "Please enter both username and password." });
      return;
    }

    try {
      // เรียกใช้ gettoken เพื่อทำการล็อกอิน
      const data = await new Service().gettoken(username, password);

      console.log("Parsed response data:", data);

      if (data && data.success && data.token) {
        Cookies.set("token", data.token, {
          path: "/",
          expires: 1 / 6, // 4 ชั่วโมง
        });

        // เปลี่ยนสถานะเป็นล็อกอินสำเร็จ
        this.setState({ isLoggedIn: true, error: "" });
      } else {
        this.setState({ error: "Login failed. Please check your credentials." });
      }
    } catch (error) {
      console.error("Login error:", error);
      this.setState({ error: "An error occurred. Please try again later." });
    }
  };


  render() {
    const { username, password, isLoggedIn, error } = this.state;

    // เปลี่ยนเส้นทางไปหน้า /manager หากล็อกอินสำเร็จ
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
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
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
            onClick={this.submitLogin}
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
