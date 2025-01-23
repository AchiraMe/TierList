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
      patch: "",
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
  onChangePatch = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  SubmitPatch = async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า
    const { token, patch } = this.state; // ดึง token และ patch จาก state

    if (patch) {
      console.log("Form Data:", { patch });
      try {
        // เรียก API สำหรับส่งข้อมูล
        const response = await new Service().submitPatch(token, patch);
        console.log("API Response:", response);

        alert("Patch submitted successfully!");

        this.setState({ patch: "" }); // รีเซ็ตค่า patch หลังส่งสำเร็จ
      } catch (error) {
        // จัดการข้อผิดพลาด
        console.error("Error submitting patch:", error);
        alert("Failed to submit patch. Please try again.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };





  render() {
    const { token } = this.state;

    if (!token) {
      return <Navigate to="/admin" />;
    }
    return (
      <>
        <style>
          {`
          .layout-wrapper {
            display: flex;
          }
          .sidebar {
            width: 250px; /* ความกว้าง Sidebar */
            background-color: #f8f9fa; /* สีพื้นหลัง */
          }
          .main-content {
            flex: 1;
            padding: 20px;
          }
        `}</style>

        <div className="layout-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            <AdminNavbar />
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="card mt-2" id="container">
              <div className="card-body">
                <div className="row col-12 m-auto">
                  <div className="col-12 col-xl-12 xl-100 box-col-12">
                    <div className="row">
                      <div className="col-12 m-auto m-t-15">
                        <h4>Tierlist Patch</h4>
                        <form onSubmit={this.SubmitPatch}>
                          <div className="form-group">
                            <label htmlFor="patch">Patch Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="patch"
                              name="patch"
                              placeholder="Enter patch name"
                              value={this.state.patch || ""}
                              onChange={this.onChangePatch}
                              required
                            />
                          </div>
                          <button type="submit" className="btn btn-primary mt-3">
                            Save
                          </button>
                        </form>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}
