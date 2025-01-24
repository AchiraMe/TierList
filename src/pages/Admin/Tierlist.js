import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminNavbar from "../../components/AdminNavbar";
import Service from "../../api/server";
import { Modal, Button } from "react-bootstrap";

export default class Tierlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: Cookies.get("token"),
      dataX: [],
      patch: "",
      activeTabS: 1,
      activeTabA: 1,
      isContentVisibleS: true,
      isContentVisibleA: true,
      showModal: false,
      characterName: "",
    };
    this.fileInputRef = React.createRef();

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
      try {
        const response = await new Service().submitPatch(token, patch);

        alert("Patch submitted successfully!");

        this.setState({ patch: "" });
      } catch (error) {
        alert("Failed to submit patch. Please try again.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };
  Addcharacters = async (base64Image, characterName) => {
    const { token } = this.state;
    try {
      const response = await new Service().Addcharacters(token, base64Image, characterName);

      if (response.success) {
        alert("เพิ่มตัวละครสำเร็จ!");
        console.log("Character added successfully.");
        this.setState({ uploadedFile: null, base64Image: null, characterName: "" });
        this.getcharacters();
      } else {
        console.warn("Add character failed:", response.message || "Unknown error");
        alert("ไม่สามารถเพิ่มตัวละครได้");
      }
    } catch (error) {
      console.error("Error adding character:", error);
      alert("Failed to submit. Please try again.");
    }
  };


  changeTabS = (tabNumber) => {
    this.setState({ activeTabS: tabNumber });
  };

  // ฟังก์ชันเปลี่ยนแท็บของ A Tier
  changeTabA = (tabNumber) => {
    this.setState({ activeTabA: tabNumber });
  };

  handleModalShow = () => {
    this.setState({ showModal: true });
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
  };

  handleOptionSelect = (option) => {
    this.setState({ selectedOption: option, showModal: false });
  };

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ uploadedFile: file, base64Image: reader.result.split(",")[1] }); // เก็บ Base64
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
    } else {
      alert("กรุณาอัปโหลดเฉพาะไฟล์ PNG");
    }
  };
  handleConfirmUpload = () => {
    const { base64Image, characterName } = this.state;
    if (!characterName) {
      alert("กรุณากรอกชื่อตัวละครก่อนยืนยัน");
      return;
    }
    if (!base64Image) {
      alert("กรุณาอัปโหลดรูปก่อนยืนยัน");
      return;
    }

    // เรียกใช้ Addcharacters
    this.Addcharacters(base64Image, characterName);
  };



  render() {
    const { token, activeTabS, activeTabA, isContentVisibleS, isContentVisibleA } = this.state;

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
                      .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          .tab {
            padding: 10px 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
          }
          .tab.active {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
          }
          .hexagon-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 150px;
          background: #007bff;
          color: white;
          font-weight: bold;
          text-align: center;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          transition: transform 0.2s, background-color 0.2s;
          cursor: pointer;
        }
        .hexagon-button:hover {
          background: #0056b3;
          transform: scale(1.05);
        }
        .hexagon-button span {
          pointer-events: none; /* Prevents text selection inside the button */
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
            {/* S Tier */}
            <div className="card mt-3" id="container">
              <div className="card-body">
                <div className="row col-12 m-auto">
                  <div className="col-12 col-xl-12 xl-100 box-col-12">
                    <div className="row">
                      <div className="col-12 m-auto m-t-15">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4>S Tier</h4>
                          <button
                            onClick={() =>
                              this.setState({ isContentVisibleS: !isContentVisibleS })
                            }
                            style={{
                              padding: "5px 10px",
                              backgroundColor: isContentVisibleS ? "#d9534f" : "#5cb85c",
                              color: "white",
                              borderRadius: "5px",
                              cursor: "pointer",
                              border: "none",
                            }}
                          >
                            {isContentVisibleS ? "ย่อเนื้อหา" : "ขยายเนื้อหา"}
                          </button>

                        </div>

                        {isContentVisibleS && (
                          <>
                            <div className="tabs" style={{ marginTop: "20px" }}>
                              {[...Array(9)].map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`tab ${activeTabS === idx + 1 ? "active" : ""}`}
                                  onClick={() => this.changeTabS(idx + 1)}
                                >
                                  Tab {idx + 1}
                                </div>
                              ))}
                            </div>

                            <div style={{ marginTop: "20px" }}>
                              {/* Tab 1 Content */}
                              {activeTabS === 1 && (
                                <div className="row mt-3 align-items-center">
                                  {/* รูปภาพหกเหลี่ยม */}
                                  <div className="col-6 col-md-3">
                                    <div
                                      className="hexagon-button"
                                      onClick={this.handleModalShow}
                                      style={{
                                        backgroundImage: this.state.selectedOption
                                          ? `url(data:image/png;base64,${this.state.dataX.find(
                                            (character) => character.name === this.state.selectedOption
                                          )?.img})`
                                          : "none",
                                        backgroundColor: this.state.selectedOption ? "transparent" : "#ccc",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        width: "150px",
                                        height: "150px",
                                        clipPath:
                                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                                        position: "relative",
                                        border: "2px solid #fff",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                      }}
                                    >
                                      <span>{this.state.selectedOption ? "" : "เลือกตัวละคร"}</span>
                                    </div>
                                    {this.state.selectedOption && (
                                      <p
                                        style={{
                                          marginTop: "10px",
                                          fontSize: "16px",
                                          fontWeight: "bold",
                                          color: "black",
                                          textAlign: "left", // จัดตรงกลางใต้รูป
                                        }}
                                      >
                                        {this.state.selectedOption}
                                      </p>
                                    )}
                                  </div>

                                  {/* Textarea */}
                                  <div className="col-6 col-md-8">
                                    <p>เงื่อนไขการเล่น:</p>
                                    <textarea
                                      className="form-control"
                                      rows="4"
                                      placeholder="กรอกเงื่อนไขที่นี่..."
                                      style={{
                                        resize: "none", // ปิดการย่อขยาย
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        
                                      }}
                                      value={this.state.conditionText || ""}
                                      onChange={(e) => this.setState({ conditionText: e.target.value })}
                                    ></textarea>
                                  </div>
                                </div>

                              )}

                              {activeTabS === 2 && <p>เนื้อหาของ Tab 2 ใน S Tier</p>}
                              {activeTabS === 3 && <p>เนื้อหาของ Tab 3 ใน S Tier</p>}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* A Tier */}
            <div className="card mt-3" id="container">
              <div className="card-body">
                <div className="row col-12 m-auto">
                  <div className="col-12 col-xl-12 xl-100 box-col-12">
                    <div className="row">
                      <div className="col-12 m-auto m-t-15">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4>A Tier</h4>
                          <button
                            onClick={() =>
                              this.setState({ isContentVisibleA: !isContentVisibleA })
                            }
                            style={{
                              padding: "5px 10px",
                              backgroundColor: isContentVisibleA ? "#d9534f" : "#5cb85c",
                              color: "white",
                              borderRadius: "5px",
                              cursor: "pointer",
                              border: "none",
                            }}
                          >
                            {isContentVisibleA ? "ย่อเนื้อหา" : "ขยายเนื้อหา"}
                          </button>
                        </div>

                        {isContentVisibleA && (
                          <>
                            <div className="tabs" style={{ marginTop: "20px" }}>
                              {[...Array(9)].map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`tab ${activeTabA === idx + 1 ? "active" : ""}`}
                                  onClick={() => this.changeTabA(idx + 1)}
                                >
                                  Tab {idx + 1}
                                </div>
                              ))}
                            </div>

                            <div style={{ marginTop: "20px" }}>
                              {activeTabA === 1 && <p>เนื้อหาของ Tab 1 ใน A Tier</p>}
                              {activeTabA === 2 && <p>เนื้อหาของ Tab 2 ใน A Tier</p>}
                              {activeTabA === 3 && <p>เนื้อหาของ Tab 3 ใน A Tier</p>}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Modal show={this.state.showModal} onHide={this.handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.uploadedFile ? "อัปโหลดรูปภาพ" : "เลือกตัวละคร"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!this.state.uploadedFile ? (
              <>
                {/* ขั้นตอนเลือกตัวละครหรืออัปโหลด */}
                <p>กรุณาเลือกตัวละครที่ต้องการ หรืออัปโหลดรูปภาพใหม่:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-start" }}>
                  {/* แสดงข้อมูลตัวละคร */}
                  {this.state.dataX.map((character) => (
                    <div
                      key={character.id}
                      onClick={() => this.handleOptionSelect(character.name)}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "10px",
                        width: "100px",
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${character.img}`} // ใช้ Base64 รูปภาพ
                        alt={character.name}
                        style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                      />
                      <p style={{ marginTop: "5px", fontSize: "14px", fontWeight: "bold" }}>{character.name}</p>
                    </div>
                  ))}

                  {/* ช่อง "เพิ่มรูป" */}
                  <div
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                      border: "2px dashed #007bff",
                      borderRadius: "5px",
                      padding: "10px",
                      width: "100px",
                      height: "130px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      color: "#007bff",
                    }}
                    onClick={() => this.fileInputRef.current.click()} // เปิด input file เมื่อคลิก
                  >
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>เพิ่มรูป</p>
                    <span style={{ fontSize: "12px", color: "#555" }}>คลิกเพื่อเพิ่มรูป</span>
                  </div>
                  <input
                    type="file"
                    accept="image/png"
                    ref={this.fileInputRef}
                    style={{ display: "none" }}
                    onChange={this.handleFileUpload}
                  />
                </div>
              </>
            ) : (
              <>
                {/* ขั้นตอนแสดงรูปที่อัปโหลด */}
                <p>รูปภาพที่คุณอัปโหลด:</p>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img
                    src={URL.createObjectURL(this.state.uploadedFile)}
                    alt="Uploaded Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "10px" }}
                  />
                </div>
                {/* ฟอร์มกรอกชื่อตัวละคร */}
                <div>
                  <input
                    type="text"
                    placeholder="กรอกชื่อตัวละคร"
                    value={this.state.characterName}
                    onChange={(e) => this.setState({ characterName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  />
                  <Button
                    variant="success"
                    onClick={this.handleConfirmUpload}
                    style={{ width: "100%" }}
                  >
                    ยืนยัน
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalClose}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>



      </>
    );
  }
}
