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
      activeTabMiddle: 5,
      isContentVisibleS: true,
      isContentVisibleA: true,
      showModal: false,
      characterName: "",
      gridhead: [Array(1).fill(null)], // เริ่มต้นด้วย 1 แถว
      gridTab5: Array(4).fill(null).map(() => Array(7).fill(null)), // Grid สำหรับ Tab 5
      gridTab6: Array(4).fill(null).map(() => Array(7).fill(null)), // Grid สำหรับ Tab 6
      draggedImage: null,
      isDragging: false,
      isDraggingFromGrid: false,
      starRatings: {},
      showTooltip: null,
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
  changeTabMiddle = (tabNumber) => {
    this.setState({ activeTabMiddle: tabNumber });
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
  handleDragStart = (imgSrc, row, col, tabNumber) => {
    this.setState({
      draggedImage: imgSrc,
      draggedFrom: row !== null && col !== null ? { row, col, tabNumber } : null, // แค่บันทึกตำแหน่งถ้าลากจาก Grid
      isDragging: true,
      isDraggingFromGrid: row !== null && col !== null,
    });
  };




  handleDragEnd = () => {
    const { draggedFrom } = this.state;

    if (!draggedFrom) {
      this.setState({ isDragging: false });
      return;
    }

    let gridKey = draggedFrom.isHead ? "gridhead" : "gridTab5";
    if (!draggedFrom.isHead && this.state.activeTabMiddle === 6) {
      gridKey = "gridTab6";
    }

    this.setState((prevState) => {
      const newGrid = prevState[gridKey].map((r) => [...r]);
      newGrid[draggedFrom.row][draggedFrom.col] = null; // ลบรูปออก

      return {
        [gridKey]: newGrid,
        draggedImage: null,
        draggedFrom: null,
        isDragging: false,
      };
    });
  };


  handleDrop = (row, col, tabNumber) => {
    const { draggedImage, draggedFrom } = this.state;
    if (!draggedImage) return;

    const gridKey = tabNumber === 5 ? "gridTab5" : "gridTab6";

    this.setState((prevState) => {
      if (!prevState[gridKey] || !Array.isArray(prevState[gridKey])) {
        console.error(`Error: Grid '${gridKey}' is not initialized properly.`);
        return {};
      }

      let newGrid = prevState[gridKey].map((r) => [...r]);

      // ถ้าลากมาจากตำแหน่งอื่นใน Grid เดียวกัน ให้ลบตำแหน่งเก่า
      if (draggedFrom) {
        const prevGridKey = draggedFrom.tabNumber === 5 ? "gridTab5" : "gridTab6";

        if (prevState[prevGridKey] && Array.isArray(prevState[prevGridKey])) {
          let prevGrid = prevState[prevGridKey].map((r) => [...r]);

          if (prevGrid[draggedFrom.row] && prevGrid[draggedFrom.row][draggedFrom.col] !== undefined) {
            prevGrid[draggedFrom.row][draggedFrom.col] = null;
          }

          newGrid = prevGrid;
        }
      }

      // **เก็บค่าของรูปที่มีอยู่เดิม (ถ้ามี)**
      const existingImage = newGrid[row][col] ? newGrid[row][col].img : null;

      // วางรูปที่ตำแหน่งใหม่ (ถ้ายังไม่มีรูป)
      if (!existingImage) {
        newGrid[row][col] = { img: draggedImage, stars: 0 };
      }

      return {
        [gridKey]: newGrid,
        draggedImage: null,
        draggedFrom: null,
        isDragging: false,
      };
    });
  };




  handleDragOver = (e) => {
    e.preventDefault(); // อนุญาตการวางรูปในพื้นที่นี้
  };
  handleRightClick = (event, row, col, tabNumber) => {
    event.preventDefault(); // ป้องกัน Context Menu ของเบราว์เซอร์

    this.setState({
      showTooltip: {
        row,
        col,
        tabNumber,
        x: event.clientX,
        y: event.clientY
      }
    });
  };


  handleSelectStar = (row, col, tabNumber, stars) => {
    const gridKey = tabNumber === 5 ? "gridTab5" : "gridTab6";

    this.setState((prevState) => {
      const newGrid = prevState[gridKey].map((r) => [...r]);

      if (newGrid[row][col]) {
        newGrid[row][col].stars = stars;
      }

      return {
        [gridKey]: newGrid,
        showTooltip: null, // ปิด Tooltip หลังจากเลือก
      };
    });
  };
  handleRemoveCharacter = (row, col, tabNumber) => {
    let gridKey = tabNumber === 5 ? "gridTab5" : "gridTab6";

    this.setState((prevState) => {
      const newGrid = prevState[gridKey].map((r) => [...r]);
      newGrid[row][col] = null; // ลบทั้งรูปและดาว

      return {
        [gridKey]: newGrid,
        showTooltip: null, // ปิด Tooltip หลังจากลบ
      };
    });
  };


  handleRemoveStar = (row, col, tabNumber) => {
    const gridKey = tabNumber === 5 ? "gridTab5" : "gridTab6";

    this.setState((prevState) => {
      const newGrid = prevState[gridKey].map((r) => [...r]);

      if (newGrid[row][col]) {
        newGrid[row][col].stars = 0; // ลบดาว
      }

      return {
        [gridKey]: newGrid,
        showTooltip: null, // ปิด Tooltip
      };
    });
  };

  handleDeleteDrop = () => {
    const { draggedFrom } = this.state;

    if (!draggedFrom) return;

    let gridKey = draggedFrom.isHead ? "gridhead" : "gridTab5";
    if (!draggedFrom.isHead && this.state.activeTabMiddle === 6) {
      gridKey = "gridTab6";
    }

    this.setState((prevState) => {
      const newGrid = prevState[gridKey].map((r) => [...r]);
      newGrid[draggedFrom.row][draggedFrom.col] = null; // ลบรูปและดาว

      return {
        [gridKey]: newGrid,
        draggedImage: null,
        draggedFrom: null,
        isDragging: false,
      };
    });
  };

  collectTierlistData = () => {
    const { activeTabS, activeTabA, gridhead, gridTab5, gridTab6 } = this.state;

    const extractData = (grid, gridType) => {
      return grid.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? {
            img: cell.img,
            stars: cell.stars,
            grid_type: gridType,
            row_position: rowIndex,
            col_position: colIndex
          } : null
        ).filter(Boolean)
      );
    };

    return {
      tierS: {
        activeTab: activeTabS,
        gridhead: extractData(gridhead, "gridhead"),
        gridTab5: extractData(gridTab5, "gridTab5"),
        gridTab6: extractData(gridTab6, "gridTab6"),
      },
      tierA: {
        activeTab: activeTabA,
      }
    };
  };




  SubmitTierlist = async () => {

    const { token } = this.state;
    const tierlistData = this.collectTierlistData(); // ✅ เรียกจากภายใน Component

    console.log("📤 กำลังส่งข้อมูลไป API...", JSON.stringify(tierlistData, null, 2));

    try {
      const response = await new Service().SubmitTierlist(token, tierlistData);

      console.log("✅ API Response:", response);
      alert("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("❌ Submit Error:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล!");
    }
  };



  render() {
    const { token, activeTabS, activeTabA, isContentVisibleS, isContentVisibleA, grid, activeTabMiddle } = this.state;

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
        .hex-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px; /* ระยะห่างระหว่างแถว */
        }

        .hex-row {
          display: flex;
          justify-content: center;
          gap: 10px; /* ระยะห่างระหว่างแต่ละหกเหลี่ยม */
        }

        .hex-row:nth-child(odd) {
          margin-left: 75px; /* ขยับแถวเพื่อให้ซ้อนกัน */
        }

        .hex-cell {
          width: 100px;
          height: 100px;
          background-color: #ccc; /* สีพื้นฐานของช่อง */
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed #aaa;
          transition: background 0.3s ease;
          position: relative;
        }

        .hex-cell:hover {
          border-color: #6d28d9;
          cursor: pointer;
        }

        .hex-cell span {
          pointer-events: none; /* ป้องกันการเลือกข้อความ */
          color: #555;
          font-size: 14px;
          font-weight: bold;
        }
        ///
.trash-card {
  width: 100%;
  max-width: 400px; /* จำกัดขนาด Card */
  margin: 20px auto; /* จัดให้อยู่ตรงกลาง */
  border: 2px solid #a94442; /* ขอบสีแดง */
  background-color: #2b0d0d; /* สีพื้นหลังของ Card */
  border-radius: 12px; /* ทำให้มุมโค้งมน */
}

.trash-zone {
  width: 100%;
  min-height: 120px;
  background-color: #2b0d0d; /* สีแดงเข้ม */
  color: #a94442;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 4px dashed rgba(169, 68, 66, 0.8); /* เส้นประ */
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
}

.trash-zone:hover {
  background-color: #4d1414;
  transform: scale(1.05);
}

.trash-icon {
  font-size: 30px;
  color: #a94442;
}

.trash-text {
  margin-top: 5px;
  font-size: 14px;
  color: #fff;
}
.tooltip-container {
    position: fixed; /* ทำให้ Tooltip ไม่ถูกจำกัดใน Grid */
    background: rgba(0, 0, 0, 0.9);
    border-radius: 8px;
    padding: 10px;
    color: white;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    z-index: 99999; /* ทำให้ Tooltip อยู่ด้านบนสุด */
    white-space: nowrap;
    pointer-events: auto; /* ป้องกันการถูกบัง */
}

.tooltip-container p {
    cursor: pointer;
    padding: 5px 10px;
    margin: 0;
    text-align: left;
}

.tooltip-container p:hover {
    background: rgba(255, 255, 255, 0.2);
}

.remove-option {
    color: red;
}


.star-overlay {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%); /* จัดให้อยู่ตรงกลาง */
    font-size: 18px;
    color: gold;
    font-weight: bold;
    white-space: nowrap; /* ป้องกันข้อความขึ้นบรรทัดใหม่ */
}








        `}</style>

        <div className="layout-wrapper">
          {/* Sidebar */}
          <AdminNavbar />

          {/* Main Content */}
          <div className="main-content mt-5">
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
                                  <div className="col-12 col-md-1">
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
                                          textAlign: "left",
                                        }}
                                      >
                                        {this.state.selectedOption}
                                      </p>
                                    )}
                                  </div>

                                  {/* Textarea */}
                                  <div className="col-6 col-md-4">
                                    <p>เงื่อนไขการเล่น:</p>
                                    <textarea
                                      className="form-control"
                                      rows="2"
                                      placeholder="กรอกเงื่อนไขที่นี่..."
                                      style={{
                                        resize: "none",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                      }}
                                      value={this.state.conditionText || ""}
                                      onChange={(e) => this.setState({ conditionText: e.target.value })}
                                    ></textarea>
                                  </div>
                                  <div className="row mt-3">
                                    <div className="col-12">
                                      <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                          <div className="hex-grid p-3">
                                            {this.state.gridhead.map((row, rowIndex) => (
                                              <div key={rowIndex} className="hex-row">
                                                {row.map((cell, colIndex) => (
                                                  <div
                                                    key={`${rowIndex}-${colIndex}`}
                                                    className="hex-cell"
                                                    onDragOver={this.handleDragOver}
                                                    onDrop={() => this.handleDrop(rowIndex, colIndex, null, true)}
                                                    draggable={!!cell}
                                                    onDragStart={() => cell && this.handleDragStart(cell.img, rowIndex, colIndex, true, true)}
                                                    style={{
                                                      background: cell ? `url(${cell.img}) center/cover` : "#f9f9f9",
                                                    }}
                                                  >
                                                    {!cell && <span>Drop Here</span>}
                                                  </div>
                                                ))}
                                              </div>
                                            ))}
                                          </div>



                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row mt-3">
                                    {/* Card 1 (ซ้าย) */}
                                    <div className="col-3">
                                      <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                          {/* รูปภาพสำหรับลาก */}
                                          <div style={{ marginTop: "20px", padding: "10px", width: "100%" }}>
                                            <h5>Character</h5>
                                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                              {this.state.dataX.map((character, index) => (
                                                <img
                                                  key={index}
                                                  src={character.img.startsWith("data:image/png;base64,") ? character.img : `data:image/png;base64,${character.img}`}
                                                  alt={character.name}
                                                  draggable
                                                  onDragStart={() => this.handleDragStart(
                                                    character.img.startsWith("data:image/png;base64,")
                                                      ? character.img
                                                      : `data:image/png;base64,${character.img}`,
                                                    null,
                                                    null,
                                                    false
                                                  )}
                                                  style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    cursor: "grab",
                                                  }}
                                                />
                                              ))}

                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Card 2 (กลาง) */}
                                    <div className="col-6">
                                      <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                          <div className="tabs" style={{ marginBottom: "20px" }}>
                                            {[5, 6, 7, 8, 9].map((tab) => (
                                              <div
                                                key={tab}
                                                className={`tab ${activeTabMiddle === tab ? "active" : ""}`}
                                                onClick={() => this.changeTabMiddle(tab)}
                                              >
                                                Tab {tab}
                                              </div>
                                            ))}
                                          </div>
                                          <div className="hex-grid p-3">
                                            {activeTabMiddle === 5 &&
                                              this.state.gridTab5.map((row, rowIndex) => (
                                                <div key={rowIndex} className="hex-row">
                                                  {row.map((cell, colIndex) => {
                                                    const key = `5-${rowIndex}-${colIndex}`;
                                                    return (
                                                      <div
                                                        key={key}
                                                        className="hex-cell"
                                                        onDragOver={this.handleDragOver}
                                                        onDrop={() => this.handleDrop(rowIndex, colIndex, 5)}
                                                        draggable={!!cell}
                                                        onContextMenu={(e) => this.handleRightClick(e, rowIndex, colIndex, 5)}
                                                        onDragStart={() => cell && this.handleDragStart(cell.img, rowIndex, colIndex, 5)}
                                                        style={{
                                                          background: cell ? `url(${cell.img}) center/cover` : "#f9f9f9",
                                                          position: "relative",
                                                        }}
                                                      >
                                                        {/* แสดงดาว */}
                                                        {cell && cell.stars > 0 && (
                                                          <div className="star-overlay">
                                                            {"★".repeat(cell.stars)}
                                                          </div>
                                                        )}
                                                        {!cell && <span>Drop Here</span>}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              ))
                                            }



                                            {activeTabMiddle === 6 &&
                                              this.state.gridTab6.map((row, rowIndex) => (
                                                <div key={rowIndex} className="hex-row">
                                                  {row.map((cell, colIndex) => (
                                                    <div
                                                      key={`${rowIndex}-${colIndex}`}
                                                      className={`hex-cell ${this.state.isDragging}`}
                                                      onDragOver={this.handleDragOver}
                                                      onDrop={() => this.handleDrop(rowIndex, colIndex, 6)}
                                                      onDragEnd={() => this.setState({ isDragging: false, isDraggingFromGrid: false })}
                                                      onContextMenu={(e) => this.handleRightClick(e, rowIndex, colIndex)}
                                                      draggable={!!cell}
                                                      onDragStart={() => cell && this.handleDragStart(cell, rowIndex, colIndex, true)}
                                                      style={{
                                                        background: cell ? `url(${cell}) center/cover` : "#f9f9f9",
                                                      }}
                                                    >
                                                      {!cell && <span>Drop Here</span>}
                                                    </div>
                                                  ))}
                                                </div>
                                              ))
                                            }

                                            {activeTabMiddle === 7 && <p>เนื้อหาของ Tab 7</p>}
                                            {activeTabMiddle === 8 && <p>เนื้อหาของ Tab 8</p>}
                                            {activeTabMiddle === 9 && <p>เนื้อหาของ Tab 9</p>}

                                          </div>




                                        </div>
                                      </div>
                                    </div>


                                    {/* Card 3 (ขวา) */}
                                    <div className="col-3">
                                      <div className="card shadow-sm text-center">
                                        <div className="card-body">
                                          <h5 className="card-title">Card 3</h5>
                                          <p className="card-text">รายละเอียดของการ์ดที่ 3</p>
                                          <button className="btn btn-primary">เพิ่มเติม</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>



                                  <button className="btn btn-primary mt-3" onClick={this.SubmitTierlist}>
                                    ส่งข้อมูล Tierlist
                                  </button>

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
        {/* แสดง Tooltip */}
        {this.state.showTooltip && (
          <div
            className="tooltip-container"
            style={{
              position: "fixed",
              top: `${this.state.showTooltip.y}px`,
              left: `${this.state.showTooltip.x}px`,
              transform: "translate(-50%, 10px)",
              background: "rgba(0, 0, 0, 0.9)",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
              color: "white",
            }}
          >
            <p onClick={() => this.handleSelectStar(this.state.showTooltip.row, this.state.showTooltip.col, this.state.showTooltip.tabNumber, 1)}>⭐ 1-Star</p>
            <p onClick={() => this.handleSelectStar(this.state.showTooltip.row, this.state.showTooltip.col, this.state.showTooltip.tabNumber, 2)}>⭐⭐ 2-Star</p>
            <p onClick={() => this.handleSelectStar(this.state.showTooltip.row, this.state.showTooltip.col, this.state.showTooltip.tabNumber, 3)}>⭐⭐⭐ 3-Star</p>
            <p
              className="remove-option"
              onClick={() => this.handleRemoveCharacter(this.state.showTooltip.row, this.state.showTooltip.col, this.state.showTooltip.tabNumber)}
            >
              ✖ Remove
            </p>
          </div>
        )}
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
