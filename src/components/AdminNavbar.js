import React, { Component } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import withRouter from "../hoc/withRouter";
import Service from "../api/server";

class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
  }

  async componentDidMount() {
    const token = Cookies.get("token");
    if (token) {
      try {
        const data = await new Service().getuserinfo(token);
        this.setState({ username: data.username });
      } catch (error) {
        console.error("Token is invalid or expired:", error);
        Cookies.remove("token");
        this.props.router.navigate("/admin");
      }
    } else {
      console.error("No token found in cookies.");
      this.props.router.navigate("/admin");
    }
  }

  handleLogout = () => {
    Cookies.remove("isLoggedIn");
    Cookies.remove("token");
    this.props.router.navigate("/admin");
  };

  render() {
    const { username } = this.state;

    return (
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/manager">Admin Panel</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/manager">Dashboard</Nav.Link>
              <Nav.Link href="/tierlist">Tier list</Nav.Link>
              <Nav.Link href="/character">Character</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text style={{ marginRight: "15px", color: "#fff" }}>
                {username ? `Welcome, ${username}` : ""}
              </Navbar.Text>
              <Button variant="outline-light" onClick={this.handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(AdminNavbar);
