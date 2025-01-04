import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      muted: true,
      delayedMute: true,
      selectedCard: "",
    };
  }




  render() {
    return (
      <div className="App">
        <div
          style={{
            backgroundColor: "#0C0C0C",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "900px",
          }}
        >
          <div className="container">
            <div className="card">
              <div className="card-body">LOGO</div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#0C0C0C",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="container">
            <h1 style={{ textAlign: "center" }}>ประวัติ</h1>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Card title 1</h5>
                  <p className="card-text">
                    เลอมัง คือ รายการแข่งขันรถยนต์ชื่อดังจากประเทศฝรั่งเศส
                    มีชื่อเต็มๆ ว่า 24 hours of le mans (เลอมังส์ 24 ชั่วโมง)
                    เป็นรายการแข่งรถสุดโหดที่ก่อตั้งขึ้นเมื่อปี ค.ศ. 1923
                    ในเมือง Le Mans โดยจุดประสงค์ของการแข่งขันเลอมัง คือ
                    เพื่อทดสอบสมรรถนะของรถยนต์และความแข็งแกร่งของผู้ขับขี่เพราะว่าในการแข่งขัน
                    24 hours of Le Mans
                  </p>
                </div>
                <img src="/Le-Mans.jpg" className="card-img-top" alt="..." />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#f5f5f5",
            minHeight: "200vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="container">
            <div className="card-body">

            </div>
          </div>
        </div>
        <footer
          style={{ backgroundColor: "#333", color: "#fff", padding: "20px 0" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>ส่วนที่ 1</h5>
                <p>ข้อความหรือข้อมูลสำหรับส่วนที่ 1 ของ footer ที่นี่</p>
              </div>
              <div className="col-md-4">
                <h5>ส่วนที่ 2</h5>
                <p>ข้อความหรือข้อมูลสำหรับส่วนที่ 2 ของ footer ที่นี่</p>
              </div>
              <div className="col-md-4">
                <h5>ติดต่อสอบถาม</h5>
                <p>ข้อความหรือข้อมูลสำหรับส่วนที่ 3 ของ footer ที่นี่</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
