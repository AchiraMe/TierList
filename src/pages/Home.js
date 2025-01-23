import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap"; // ใช้ React Bootstrap
import Service from "../api/server"; // นำเข้า Service

const itemsDatabase = [
    { id: 1, name: "Item 1", image: "/Avatar/1.png" },
    { id: 2, name: "Item 2", image: "/Avatar/2.png" },
    { id: 3, name: "Item 3", image: "/Avatar/3.png" },
];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: {},
            showModal: false,
            currentTier: null,
            currentIdx: null,
            patch: "",
        };
    }

      componentDidMount() {
        this.GetPatch();
      }

      GetPatch = async () => {
        try {
            const response = await new Service().GetPatch(); // เรียก API ด้วย GET
    
            if (response.success) {
                const patches = response.patches;
    
                const latestPatch = patches[patches.length - 1] || "Unknown Patch"; // เลือก patch ล่าสุด
                this.setState({ patch: latestPatch }); // อัปเดต state
            } else {
                console.error("Failed to fetch patch data:", response.message);
            }
        } catch (error) {
            console.error("Error fetching patch data:", error);
        }
    };
    
    
    
    handleSelectItem = (item) => {
        const { currentTier, currentIdx } = this.state;
        if (currentTier !== null && currentIdx !== null) {
            this.setState((prevState) => ({
                selectedItems: {
                    ...prevState.selectedItems,
                    [`${currentTier}-${currentIdx}`]: item,
                },
            }));
        }
        this.handleCloseModal(); // ปิด Modal หลังจากเลือก
    };

    handleOpenModal = (tier, idx) => {
        this.setState({
            showModal: true,
            currentTier: tier,
            currentIdx: idx,
        });
    };

    // ปิด Modal
    handleCloseModal = () => {
        this.setState({
            showModal: false,
            currentTier: null,
            currentIdx: null,
        });
    };

    render() {
        const { selectedItems, showModal, patch,  } = this.state;

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column", // จัด Layout ด้วย Flexbox
                    minHeight: "100vh", // ความสูงขั้นต่ำครอบคลุมหน้าจอ
                    backgroundImage: "url('/BG.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                }}
            >
                {/* Header */}
                <header
                    style={{
                        width: "100%",
                        height: "500px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                    className="responsive-header"
                >
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                            color: "#fff",
                            fontSize: "36px",
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                        }}
                    >
                        <div className="container">
                            <h1 style={{ fontSize: "100px", fontWeight: "bold", margin: "0" }}>
                                TIERLIST
                            </h1>
                            <h2
                                style={{
                                    fontSize: "32px",
                                    margin: "20px 0",
                                    color: "#FFD700",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    padding: "18px 20px",
                                    border: "2px solid #FFD700",
                                    borderRadius: "10px",
                                    display: "inline-block",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                <span style={{ fontSize: "40px", marginRight: "5px" }}>»</span>
                                PATCH {this.state.patch} {/* แสดงค่าของ patch */}
                                <span style={{ fontSize: "40px", marginLeft: "5px" }}>«</span>
                            </h2>

                            <p style={{ fontSize: "20px", margin: "10px 0" }}>
                                โพยคอมพ์เทพโดยแรงก์ <span style={{ color: "#FFD700" }}>1</span>{" "}
                                ของเซิร์ฟเวอร์
                            </p>
                            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                                <button
                                    style={{
                                        backgroundColor: "#fff",
                                        color: "#000",
                                        padding: "10px 20px",
                                        borderRadius: "30px",
                                        border: "none",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    ลุงชา
                                </button>
                                <button
                                    style={{
                                        backgroundColor: "#fff",
                                        color: "#000",
                                        padding: "10px 20px",
                                        borderRadius: "30px",
                                        border: "none",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cursedxzz
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div
                    style={{
                        flex: "1",
                        padding: "20px",
                        backgroundColor: "#2B1139",
                        color: "#fff",
                    }}
                >
                    <div className="container">
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                            Select Comp Style
                        </h2>

                        {/* ตาราง Tier */}
                        <div>
                            {["S", "A", "B", "C"].map((tier, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "15px",
                                        gap: "20px",
                                    }}
                                >
                                    {/* Tier Label */}
                                    <div
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            backgroundColor:
                                                tier === "S"
                                                    ? "#651FFF"
                                                    : tier === "A"
                                                        ? "#FFC400"
                                                        : tier === "B"
                                                            ? "#2979FF"
                                                            : "#FF6D00",
                                            color: "#fff",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        {tier}
                                    </div>

                                    {/* Champion List */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {[...Array(8)].map((_, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => this.handleOpenModal(tier, idx)} // เมื่อคลิกจะเปิด Modal
                                                style={{
                                                    width: "80px",
                                                    height: "100px",
                                                    backgroundColor: "#4CAF50",
                                                    borderRadius: "10px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    position: "relative",
                                                }}
                                            >
                                                {/* Champion */}
                                                <div
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        backgroundColor: "#8BC34A",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginBottom: "5px",
                                                    }}
                                                >
                                                    {selectedItems[`${tier}-${idx}`]?.name || `${tier}${idx + 1}`}
                                                </div>

                                                {/* Item Icon */}
                                                {selectedItems[`${tier}-${idx}`]?.image && (
                                                    <img
                                                        src={selectedItems[`${tier}-${idx}`]?.image}
                                                        alt="Item"
                                                        style={{
                                                            width: "100px",
                                                            height: "100px",
                                                            position: "absolute",
                                                            bottom: "10px",
                                                            borderRadius: "4px",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <Modal show={showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select an Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {itemsDatabase.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => this.handleSelectItem(item)} // เลือก Item
                                    style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "8px",
                                            marginBottom: "5px",
                                        }}
                                    />
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                </Modal>
                {/* Main Footer */}
                <footer
                    style={{
                        backgroundColor: "#240C31",
                        color: "#fff",
                        padding: "20px 0",
                        textAlign: "center",
                    }}
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div style={{ marginBottom: "10px" }}>
                                    <a
                                        href="https://www.youtube.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: "0 10px", color: "#fff", fontSize: "24px" }}
                                    >
                                        YouTube
                                    </a>
                                    <a
                                        href="https://www.tiktok.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: "0 10px", color: "#fff", fontSize: "24px" }}
                                    >
                                        TikTok
                                    </a>
                                </div>
                                <p style={{ color: "#6E5C80" }}>
                                    Lorem Ipsum is simply dummy text of the printing and
                                    typesetting industry.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Bottom Footer */}
                <footer
                    style={{
                        backgroundColor: "#2B1139",
                        color: "#6E5C80",
                        padding: "10px 0",
                        fontSize: "14px",
                        fontWeight: "bold",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    © Copy right 2025
                </footer>
            </div>
        );
    }
}

export default Home;
