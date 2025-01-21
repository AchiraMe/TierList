import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import Cookies from "js-cookie";
import withRouter from "../hoc/withRouter"; // นำเข้า HOC
import Service from "../services/Service"; // นำเข้า Service

class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
  }

  componentDidMount() {
    const token = Cookies.get("token");
    if (token) {
      this.getuserinfo(token);
    }
  }

  getuserinfo = async (token) => {
    try {
      const res = await new Service().getuserinfo(token);
      this.setState({
        username: res.data.username,
      });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  handleLogout = () => {
    Cookies.remove("isLoggedIn"); // ลบ cookie
    Cookies.remove("token"); // ลบ token
    this.props.router.navigate("/admin"); // เปลี่ยนเส้นทางกลับไปหน้า Login
  };

  render() {
    const { username } = this.state;

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
        <p style={{ textAlign: "center", color: "#fff" }}>
          {username ? `Welcome, ${username}` : "Loading..."}
        </p>
        <Nav className="flex-column">
          <Nav.Link href="/manager" style={{ color: "#fff" }}>
            Dashboard
          </Nav.Link>
          <Nav.Link href="/tierlist" style={{ color: "#fff" }}>
            Tier list
          </Nav.Link>
          <Nav.Link href="#" style={{ color: "#fff" }}>
            Reports
          </Nav.Link>
          <Nav.Link
            href="#"
            style={{ color: "#fff" }}
            onClick={this.handleLogout}
          >
            Logout
          </Nav.Link>
        </Nav>
      </div>
    );
  }
}

export default withRouter(AdminNavbar);
