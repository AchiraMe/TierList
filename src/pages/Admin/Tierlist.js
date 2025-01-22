import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminNavbar from "../../components/AdminNavbar";
import Service from "../../api/server";

export default class Tierlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: Cookies.get("token"),
      dataX: [],
      error: null,
    };
  }

  componentDidMount() {
    const { token } = this.state;

    if (token) {
      this.getcharacters();
    } else {
      Cookies.remove("token", { path: "/" });
      localStorage.clear();
      window.location.assign("/admin");
    }
  }

  getcharacters = async () => {
    try {
      const res = await new Service().getcharacters(this.state.token);

      if (res && Array.isArray(res.characters)) {
        this.setState({ dataX: res.characters });
      } else {
        this.setState({ dataX: [], error: "No characters found in API response." });
        console.error("Expected characters array but received:", res);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
      this.setState({ error: "Failed to fetch character data." });
    }
  };



  render() {
    const { token, dataX, error } = this.state;

    if (!token) {
      return <Navigate to="/admin" />;
    }

    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <AdminNavbar />

        <div style={{ flex: 1, padding: "20px" }}>
          <h1>Tierlist Dashboard</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="characters-container">
            {dataX.length > 0 ? (
              <div className="characters-grid">
                {dataX.map((character) => (
                  <div key={character.id} className="character-card">
                    <h2>ID: {character.id}</h2>
                    <p>Name: {character.name}</p>
                    <img
                      src={`data:image/png;base64,${character.img}`} // ใช้ Base64 data จากฟิลด์ img
                      alt={character.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No characters available.</p>
            )}
          </div>
        </div>


      </div>
    );
  }
}
