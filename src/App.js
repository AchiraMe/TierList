import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="App"
        style={{
          backgroundImage: "url('/BG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh", // ให้ครอบคลุมทั้งความสูงของ viewport
        }}
      >
        <nav
          className="navbar navbar-expand-lg"
          style={{
            position: "fixed",
            top: "0",
            width: "100%",
            zIndex: "1000",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <div className="container">
            <a className="navbar-brand" href="#">
              <img
                src="/logo.png"
                alt="NVA Logo"
                style={{ height: "27px", width: "auto" }}
              />
            </a>

            <a
              className="btn d-lg-none"
              href="#about-us"
              style={{
                backgroundColor: "transparent", // ไม่มีพื้นหลัง
                border: "1px solid #fff", // เส้นขอบสีขาว
                color: "#fff", // สีข้อความสีขาว
                borderRadius: "100px", // ทำให้ปุ่มเป็นวงรี
                padding: "5px 20px", // ขนาดปุ่ม
                fontWeight: "bold", // ทำให้ข้อความเด่นขึ้น
                textDecoration: "none", // ลบเส้นใต้
              }}
            >
              About Us
            </a>


            {/* เมนูแบบเต็มสำหรับหน้าจอใหญ่ */}
            <div className="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#about-us"
                    style={{
                      backgroundColor: "transparent", // ไม่มีพื้นหลัง
                      border: "1px solid #fff", // เส้นขอบสีขาว
                      color: "#fff", // สีข้อความสีขาว
                      borderRadius: "100px", // ทำให้ปุ่มเป็นวงรี
                      padding: "5px 20px", // ขนาดปุ่ม
                      fontWeight: "bold", // ทำให้ข้อความเด่นขึ้น
                      textDecoration: "none", // ลบเส้นใต้
                    }}
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>


        <header
          style={{
            width: "100%",
            height: "500px", // ปรับขนาดความสูงตามต้องการ
            // backgroundImage: "url('/headlogo.png')", // รูปเริ่มต้น
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="responsive-header" // เพิ่มคลาสเพื่อควบคุมด้วย CSS
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "36px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* เนื้อหาหรือข้อความใน Header */}
          </div>
        </header>




        <div className="container">
          {/* Main content */}
        </div>

        {/* Footer */}
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
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                  <a
                    href="https://www.tiktok.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ margin: "0 10px", color: "#fff", fontSize: "24px" }}
                  >
                    <FontAwesomeIcon icon={faTiktok} />
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Golden Recipe Logo"
                    style={{ height: "40px", width: "auto" }}
                  />
                </div>
                <p style={{ color: "#6E5C80" }}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                  when an unknown printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
            </div>
          </div>
        </footer>
        <footer
          style={{
            backgroundColor: "#2B1139",
            color: "#6E5C80",
            padding: "10px 0",
            fontSize: "14px",
            fontWeight: "bold",
            bottom: "0",
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

export default App;
