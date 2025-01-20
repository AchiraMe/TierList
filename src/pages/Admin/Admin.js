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
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = () => {
    const { email, password } = this.state;

    if (email === "admin" && password === "admin") {
      Cookies.set("isLoggedIn", "true", { expires: 1 }); // ตั้งค่า cookie
      this.setState({ isLoggedIn: true });
    } else {
      alert("Invalid email or password.");
    }
  };

  render() {
    const { email, password, isLoggedIn } = this.state;

    if (isLoggedIn) {
      return <Navigate to="/manager" />;
    }

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Admin Login</h1>
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
