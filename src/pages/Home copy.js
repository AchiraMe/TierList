import React, { Component } from "react";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
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
                <header
                    style={{
                        width: "100%",
                        height: "500px",
                        backgroundImage: "url('/headlogo.png')", // ใส่รูปพื้นหลังที่เหมาะสม
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                            paddingLeft: "50px", // ระยะห่างจากซ้าย
                            color: "#fff",
                        }}
                    >
                        <div className="container">
                            <h1 style={{ fontSize: "100px", fontWeight: "bold", margin: "0" }}>
                                TIERLIST
                            </h1>
                            <h2 style={{ fontSize: "32px", margin: "10px 0",color: "#FFD700" }}>PATCH 14.4B</h2>
                            <p style={{ fontSize: "20px", margin: "10px 0" }}>
                                โพยคอมพ์เทพโดยแรงก์ <span style={{ color: "#FFD700" }}>1</span>{" "}
                                ของเซิร์ฟเวอร์ <span style={{ color: "#FFD700" }}>ลุงชา</span> และ{" "}
                                <span style={{ color: "#FFD700" }}>Cursedxzz</span>
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
                        flex: "1", // ดัน Footer ลงล่าง
                        padding: "20px",
                    }}
                >
                    <div className="container">
                    </div>
                </div>

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
