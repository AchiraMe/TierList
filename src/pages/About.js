import React from "react";

const About = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column", // ใช้ Flexbox จัดการเลย์เอาต์ในแนวตั้ง
                minHeight: "100vh", // ความสูงเต็มหน้าจอ
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
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            // className="responsive-header"
            >
                
            </header>

            {/* Content */}
            <div
                style={{
                    // flex: "1", // ดัน Footer ลงล่าง
                    padding: "20px",
                    wordWrap: "break-word"
                }}
            >
                {/* คนที่1 */}
                <div className="container">
                    <div className="row d-flex align-items-center">
                        {/* รูปบุคคล */}
                        <div className="col-md-6 order-1 order-md-2 profile-section">
                            <img className="profile-img" src="/Char1.PNG" alt="profile" />
                        </div>

                        {/* ข้อมูลของรายละเอียด (ข้อความ) */}
                        <div className="col-md-6 order-2 order-md-1 text-section text-center text-md-start">
                            <h1>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h1>
                            <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

                            {/* ปุ่มกดโซเชียลมีเดีย */}
                            <div className="social-icons d-flex justify-content-center justify-content-md-start">
                                <button className="social-btn facebook">
                                    <img src="/facebook-icon.png" alt="Facebook" className="social-icon" />
                                    Facebook
                                </button>
                                <button className="social-btn instagram">
                                    <img src="/instagram-icon.png" alt="Instagram" className="social-icon" />
                                    Instagram
                                </button>
                                <button className="social-btn youtube">
                                    <img src="/youtube-icon.png" alt="Youtube" className="social-icon" />
                                    Youtube
                                </button>
                                <button className="social-btn tiktok">
                                    <img src="/tiktok-icon.png" alt="Tiktok" className="social-icon" />
                                    Tiktok
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


                {/* คนที่2 */}
                <div className="container">
                    <div className="row d-flex align-items-center">
                        {/* รูปบุคคล */}
                        <div className="col-md-6 order-1 order-md-1 profile-section">
                            <img className="profile-img" src="/Char2.PNG" alt="profile" />
                        </div>

                        {/* ข้อมูลของรายละเอียด (ข้อความ) */}
                        <div className="col-md-6 order-2 order-md-2 text-section text-center text-md-end">
                            <h1>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h1>
                            <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>

                            {/* ปุ่มกดโซเชียลมีเดีย */}
                            <div className="social-icons d-flex justify-content-center justify-content-md-end">
                                <button className="social-btn facebook">
                                    <img src="/facebook-icon.png" alt="Facebook" className="social-icon" />
                                    Facebook
                                </button>
                                <button className="social-btn instagram">
                                    <img src="/instagram-icon.png" alt="Instagram" className="social-icon" />
                                    Instagram
                                </button>
                                <button className="social-btn youtube">
                                    <img src="/youtube-icon.png" alt="Youtube" className="social-icon" />
                                    Youtube
                                </button>
                                <button className="social-btn tiktok">
                                    <img src="/tiktok-icon.png" alt="Tiktok" className="social-icon" />
                                    Tiktok
                                </button>
                            </div>
                        </div>
                    </div>
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
                <div className="container text-section .social-icon">
                    <div className="row">
                        <div className="col-md-8" style={{ textAlign: "left" }}>
                            <img
                                src="/logo.png"
                                alt="Golden Recipe Logo"
                                style={{ height: "40px", width: "auto", marginBottom: "10px" }}
                            />
                            <p style={{ color: "#6E5C80" }}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>

                            {/*ถุงชา*/}
                        <div className="col-md-2" style={{ textAlign: "left" }}>
                            <h3>ถุงชา</h3>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/facebook-icon.png" alt="Facebook" style={{ height: "24px", marginRight: "5px" }} />
                                    Facebook
                                </a>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/instagram-icon.png" alt="Instagram" style={{ height: "24px", marginRight: "5px" }} />
                                    Instagram
                                </a>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.youtube.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/youtube-icon.png" alt="YouTube" style={{ height: "24px", marginRight: "5px" }} />
                                    YouTube
                                </a>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.tiktok.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/tiktok-icon.png" alt="TikTok" style={{ height: "24px", marginRight: "5px" }} />
                                    TikTok
                                </a>
                            </div>
                        </div>

                                {/* Cursedzxz */}
                        <div className="col-md-2" style={{ textAlign: "left" }}>
                            <h3>Cursedzxz</h3>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/facebook-icon.png" alt="Facebook" style={{ height: "24px", marginRight: "5px" }} />
                                    Facebook
                                </a>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/instagram-icon.png" alt="Instagram" style={{ height: "24px", marginRight: "5px" }} />
                                    Instagram
                                </a>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.youtube.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/youtube-icon.png" alt="YouTube" style={{ height: "24px", marginRight: "5px" }} />
                                    YouTube
                                </a>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <a
                                    href="https://www.tiktok.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/tiktok-icon.png" alt="TikTok" style={{ height: "24px", marginRight: "5px" }} />
                                    TikTok
                                </a>
                            </div>
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
};

export default About;
