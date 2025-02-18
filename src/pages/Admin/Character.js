import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminNavbar from "../../components/AdminNavbar";
import Service from "../../api/server";
import { Modal, Button, Form } from "react-bootstrap";

export default class Character extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get("token"),
            dataX: [],
            characterName: "",
        };
        this.fileInputRef = React.createRef();

    }

    componentDidMount() {
        const { token } = this.state;

        if (token) {
            this.getcharacters();
            this.loadFrames(); // โหลดกรอบจาก /frame
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
    Addcharacters = async () => {
        const { token, characterName, distance, price, trait1Img, trait2Img, trait3Img, trait4Img } = this.state;

        try {
            // 🔄 รวมภาพตัวละครและกรอบก่อน
            const finalImage = await this.combineImageWithFrame(); // ✅ ใช้ภาพที่รวมแล้ว

            if (!finalImage) {
                alert("เกิดข้อผิดพลาด: ไม่สามารถสร้างรูปตัวละครได้");
                return;
            }

            // ✅ สร้าง Array ของ Traits [{name, image}]
            const traits = [
                trait1Img ? { name: "Trait1", image: trait1Img } : null,
                trait2Img ? { name: "Trait2", image: trait2Img } : null,
                trait3Img ? { name: "Trait3", image: trait3Img } : null,
                trait4Img ? { name: "Trait4", image: trait4Img } : null,
            ].filter(Boolean);

            console.log("📤 ส่งข้อมูลไปยัง Addcharacters API:", {
                token,
                characterName,
                base64Image: finalImage, // ✅ ใช้รูปจาก combineImageWithFrame
                distance,
                price,
                traits,
            });

            // ✅ ส่งข้อมูลไป API
            const response = await new Service().Addcharacters(
                token,
                characterName,
                finalImage,
                distance,
                price,
                traits
            );

            console.log("📩 API Response:", response);

            if (response.success) {
                alert("เพิ่มตัวละครสำเร็จ!");
                this.setState({
                    uploadedFile: null,
                    base64Image: null,
                    characterName: "",
                    distance: "",
                    price: "",
                    selectedFrame: null,
                    trait1Img: null,
                    trait2Img: null,
                    trait3Img: null,
                    trait4Img: null
                });
                this.getcharacters();
            } else {
                console.warn("⚠️ Add character failed:", response.message || "Unknown error");
                alert("ไม่สามารถเพิ่มตัวละครได้");
            }
        } catch (error) {
            console.error("❌ Error adding character:", error);
            alert("Failed to submit. Please try again.");
        }
    };









    loadFrames = () => {
        const frameList = [
            "/frame/Subtract_0.png",
            "/frame/Subtract_1.png",
            "/frame/Subtract_2.png",
            "/frame/Subtract_3.png",
            "/frame/Subtract_4.png",
            "/frame/Subtract_5.png"
        ];

        const framePrices = frameList.map((frame, index) => ({ frame, price: index + 1 }));
        this.setState({
            frames: framePrices,
            price: framePrices[0].price // ตั้งค่า price เริ่มต้น
        });
    };
    loaditem = () => {
        const context = require.context("../public/Item", false, /\.(png|jpg|jpeg|gif)$/);
        const itemList = context.keys().map(context);
        this.setState({ itemList });
    };


    handleSubmit = (event) => {
        event.preventDefault(); // ป้องกันการรีเฟรชหน้า
        this.Addcharacters();
    };
    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ base64Image: reader.result }); // อัปเดตรูปแบบ Base64
            };
            reader.readAsDataURL(file);
        }
    };
    handleTraitImageChange = async (event, traitKey) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await this.convertImageToBase64(file);
            this.setState({ [traitKey]: base64 });
        }
    };
    onSelectTrait = async (traitKey, imgName) => {
        const imageUrl = `/Trait/${imgName}`;
        const base64 = await this.convertImageUrlToBase64(imageUrl);

        this.setState({
            [traitKey]: { name: imgName.replace(".png", ""), image: base64 }, // เก็บชื่อ + Base64
            showTrait1Options: false,
            showTrait2Options: false,
            showTrait3Options: false,
            showTrait4Options: false,
        });
    };




    convertImageUrlToBase64 = async (imageUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageUrl;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = (error) => reject(error);
        });
    };


    combineImageWithFrame = () => {
        return new Promise((resolve) => {
            const { base64Image, selectedFrame } = this.state;

            if (!selectedFrame) {
                console.warn("⚠️ ไม่มีกรอบให้ใช้งาน!");
                resolve(null);
                return;
            }

            // สร้าง Canvas และกำหนด Context
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // กำหนดขนาดของ Canvas ให้ใหญ่ขึ้นเล็กน้อย
            const size = 110; // ให้กรอบเป็นหลัก
            canvas.width = size;
            canvas.height = size;

            if (base64Image) {
                // โหลดรูปตัวละคร
                const characterImg = new Image();
                characterImg.src = base64Image;
                characterImg.crossOrigin = "anonymous";

                characterImg.onload = () => {
                    // ตัดรูปให้เป็นหกเหลี่ยม
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(size * 0.5, 0);
                    ctx.lineTo(size, size * 0.25);
                    ctx.lineTo(size, size * 0.75);
                    ctx.lineTo(size * 0.5, size);
                    ctx.lineTo(0, size * 0.75);
                    ctx.lineTo(0, size * 0.25);
                    ctx.closePath();
                    ctx.clip();

                    // ปรับขนาดของตัวละครให้อยู่ภายในกรอบพอดี
                    ctx.drawImage(characterImg, 5, 5, size - 10, size - 10);
                    ctx.restore();

                    // โหลดและวาดกรอบให้เป็นเลเยอร์สุดท้าย
                    const frameImg = new Image();
                    frameImg.src = selectedFrame;
                    frameImg.crossOrigin = "anonymous";

                    frameImg.onload = () => {
                        ctx.drawImage(frameImg, 0, 0, size, size); // วาดกรอบบนสุด

                        const finalBase64 = canvas.toDataURL("image/png");
                        resolve(finalBase64);
                    };
                };
            } else {
                resolve(null);
            }
        });
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
                    .image-container {
                    position: relative;
                    width: 100px; /* ปรับขนาดตามต้องการ */
                    height: 100px;
                    }

                    .uploaded-image {
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    }

                    .frame-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100px;
                    height: 100px;
                    pointer-events: none; /* ให้สามารถคลิกที่รูปได้โดยไม่ติดกรอบ */
                    }
                    .trait-card {
                        background-color: #f8f9fa; /* สีพื้นหลัง */
                        border: 2px solid #ddd;
                        padding: 10px;
                        border-radius: 8px;
                    }
                    .trait-card img {
                        background-color: #e3e3e3;
                        padding: 5px;
                        border-radius: 8px;
                    }


                    `}</style>

                <div className="layout-wrapper">
                    <AdminNavbar />

                    <div className="main-content mt-5 p-4">
                        <div className="card" id="container">
                            <div className="card-body">
                                <h4>เพิ่มตัวละคร</h4>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>อัปโหลดรูปภาพ</Form.Label>
                                        <Form.Control type="file" accept="image/*" onChange={this.handleFileChange} />

                                        {/* แสดงรูปที่อัปโหลดพร้อมกรอบ */}
                                        {this.state.base64Image && (
                                            <div className="image-container mt-3" style={{ position: "relative", display: "inline-block" }}>
                                                {/* รูปที่ถูกตัดเป็นหกเหลี่ยม */}
                                                <div style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    overflow: "hidden",
                                                    position: "relative",
                                                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                                                }}>
                                                    <img
                                                        src={this.state.base64Image}
                                                        alt="Preview"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>

                                                {/* กรอบที่ขยายใหญ่ขึ้น */}
                                                {this.state.selectedFrame && (
                                                    <img
                                                        src={this.state.selectedFrame}
                                                        alt="Frame"
                                                        className="frame-overlay"
                                                        style={{
                                                            position: "absolute",
                                                            top: "-5px",   // เลื่อนขึ้นให้ขยายออกจากรูป
                                                            left: "-5px",  // เลื่อนออกข้าง
                                                            width: "110px", // ขยายขนาดให้ใหญ่ขึ้นจาก 100px
                                                            height: "110px",
                                                            pointerEvents: "none",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* ตัวเลือกกรอบ */}
                                        {this.state.base64Image && (
                                            <div className="mt-3">
                                                <Form.Label>เลือกกรอบรูป</Form.Label>
                                                <div className="d-flex flex-wrap">
                                                    {this.state.frames.map((frame, index) => (
                                                        <div
                                                            key={index}
                                                            className="border rounded m-2"
                                                            style={{
                                                                cursor: "pointer",
                                                                width: "80px",
                                                                height: "80px",
                                                                backgroundImage: `url(${frame.frame})`,
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center"
                                                            }}
                                                            onClick={() => this.setState({
                                                                selectedFrame: frame.frame,
                                                                price: frame.price
                                                            })}
                                                        />

                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* ชื่อตัวละคร */}
                                    <Form.Group>
                                        <Form.Label>ชื่อตัวละคร</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.characterName}
                                            onChange={(e) => this.setState({ characterName: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>ระยะโจมตี</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.distance}
                                            onChange={(e) => this.setState({ distance: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>ราคา</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.price}
                                            onChange={(e) => this.setState({ price: e.target.value })}
                                            disabled
                                        />
                                    </Form.Group>
                                    {/* Trait 1 */}
                                    <Form.Group>
                                        <div className="row mt-3">

                                            <div className="col-3">
                                                <Form.Label>Trait 1</Form.Label>
                                                {!this.state.trait1Img && (
                                                    <div
                                                        className="border rounded d-flex align-items-center justify-content-center"
                                                        style={{ width: "80px", height: "80px", cursor: "pointer", backgroundColor: "#f8f9fa" }}
                                                        onClick={() => this.setState({ showTrait1Options: true })}
                                                    >
                                                        <span style={{ fontSize: "12px", color: "#6c757d" }}>เลือก Trait</span>
                                                    </div>
                                                )}
                                                {this.state.trait1Img && (
                                                    <div>
                                                        <img
                                                            src={this.state.trait1Img.image}
                                                            alt={this.state.trait1Img.name || "Trait 1"}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer", backgroundColor: "#e3e3e3" }}
                                                            onClick={() => this.setState({ showTrait1Options: true })}
                                                        />
                                                        <p className="mt-1"  >{this.state.trait1Img.name || "No Trait"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-3">
                                                <Form.Label>Trait 2</Form.Label>
                                                {!this.state.trait2Img && (
                                                    <div
                                                        className="border rounded d-flex align-items-center justify-content-center"
                                                        style={{ width: "80px", height: "80px", cursor: "pointer", backgroundColor: "#f8f9fa" }}
                                                        onClick={() => this.setState({ showTrait2Options: true })}
                                                    >
                                                        <span style={{ fontSize: "12px", color: "#6c757d" }}>เลือก Trait</span>
                                                    </div>
                                                )}
                                                {this.state.trait2Img && (
                                                    <div>
                                                        <img
                                                            src={this.state.trait2Img.image}
                                                            alt={this.state.trait2Img.name || "Trait 2"}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer", backgroundColor: "#e3e3e3" }}
                                                            onClick={() => this.setState({ showTrait2Options: true })}
                                                        />
                                                        <p className="mt-1">{this.state.trait2Img.name || "No Trait"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-3">
                                                <Form.Label>Trait 3</Form.Label>
                                                {!this.state.trait3Img && (
                                                    <div
                                                        className="border rounded d-flex align-items-center justify-content-center"
                                                        style={{ width: "80px", height: "80px", cursor: "pointer", backgroundColor: "#f8f9fa" }}
                                                        onClick={() => this.setState({ showTrait3Options: true })}
                                                    >
                                                        <span style={{ fontSize: "12px", color: "#6c757d" }}>เลือก Trait</span>
                                                    </div>
                                                )}
                                                {this.state.trait3Img && (
                                                    <div>
                                                        <img
                                                            src={this.state.trait3Img.image}
                                                            alt={this.state.trait3Img.name || "Trait 3"}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer", backgroundColor: "#e3e3e3" }}
                                                            onClick={() => this.setState({ showTrait3Options: true })}
                                                        />
                                                        <p className="mt-1">{this.state.trait3Img.name || "No Trait"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-3">
                                                <Form.Label>Trait 4</Form.Label>
                                                {!this.state.trait4Img && (
                                                    <div
                                                        className="border rounded d-flex align-items-center justify-content-center"
                                                        style={{ width: "80px", height: "80px", cursor: "pointer", backgroundColor: "#f8f9fa" }}
                                                        onClick={() => this.setState({ showTrait4Options: true })}
                                                    >
                                                        <span style={{ fontSize: "12px", color: "#6c757d" }}>เลือก Trait</span>
                                                    </div>
                                                )}
                                                {this.state.trait4Img && (
                                                    <div>
                                                        <img
                                                            src={this.state.trait4Img.image}
                                                            alt={this.state.trait4Img.name || "Trait 4"}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer", backgroundColor: "#e3e3e3" }}
                                                            onClick={() => this.setState({ showTrait4Options: true })}
                                                        />
                                                        <p className="mt-1">{this.state.trait4Img.name || "No Trait"}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>





                                        {/* Card ครอบรายการรูป */}
                                        {this.state.showTrait1Options && (
                                            <div className="card mt-3" style={{ backgroundColor: "#e3e3e3", border: "2px solid #ddd" }}>
                                                <div className="card-body">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="ค้นหา Trait..."
                                                        className="mb-2"
                                                        onChange={(e) => this.setState({ traitSearch: e.target.value.toLowerCase() })}
                                                    />

                                                    <div className="d-flex flex-wrap">
                                                        {[
                                                            "Academy.png",
                                                            "Ambusher.png",
                                                            "Artillerist.png",
                                                            "Autometa.png",
                                                            "Banished Mage.png",
                                                            "Black Rose.png",
                                                            "Blood Hunter.png",
                                                            "Bruiser.png",
                                                            "Chem-Baron.png",
                                                            "Conqueror.png",
                                                            "Dominator.png",
                                                            "Emissary.png",
                                                            "Enforcer.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "Form Swapper.png",
                                                            "High Roller.png",
                                                            "Junker King.png",
                                                            "Machine Herald.png",
                                                            "Pit Fighter.png",
                                                            "Quickstriker.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sentinel.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Visionary.png",
                                                            "Watcher.png"
                                                        ]

                                                            .filter((imgName) => imgName.toLowerCase().includes(this.state.traitSearch || ""))
                                                            .map((imgName, index) => (
                                                                <div key={index} className="text-center mx-2">
                                                                    <img
                                                                        src={`/Trait/${imgName}`}
                                                                        alt={imgName}
                                                                        width="80"
                                                                        height="80"
                                                                        className="border rounded"
                                                                        onClick={() => this.onSelectTrait("trait1Img", imgName)}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                    <p style={{ fontSize: "12px" }}>{imgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
                                                                </div>
                                                            ))}
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                        {/* ตัวเลือก Trait 2 */}
                                        {this.state.showTrait2Options && (
                                            <div className="card mt-3" style={{ backgroundColor: "#e3e3e3", border: "2px solid #ddd" }}>
                                                <div className="card-body">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="ค้นหา Trait..."
                                                        className="mb-2"
                                                        onChange={(e) => this.setState({ trait2Search: e.target.value.toLowerCase() })}
                                                    />

                                                    <div className="d-flex flex-wrap">
                                                        {[
                                                            "Academy.png",
                                                            "Ambusher.png",
                                                            "Artillerist.png",
                                                            "Autometa.png",
                                                            "Banished Mage.png",
                                                            "Black Rose.png",
                                                            "Blood Hunter.png",
                                                            "Bruiser.png",
                                                            "Chem-Baron.png",
                                                            "Conqueror.png",
                                                            "Dominator.png",
                                                            "Emissary.png",
                                                            "Enforcer.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "Form Swapper.png",
                                                            "High Roller.png",
                                                            "Junker King.png",
                                                            "Machine Herald.png",
                                                            "Pit Fighter.png",
                                                            "Quickstriker.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sentinel.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Visionary.png",
                                                            "Watcher.png"
                                                        ]
                                                            .filter((imgName) => imgName.toLowerCase().includes(this.state.trait2Search || ""))
                                                            .map((imgName, index) => (
                                                                <div key={index} className="text-center mx-2">
                                                                    <img
                                                                        src={`/Trait/${imgName}`}
                                                                        alt={imgName}
                                                                        width="80"
                                                                        height="80"
                                                                        className="border rounded"
                                                                        onClick={() => this.onSelectTrait("trait2Img", imgName)}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                    <p style={{ fontSize: "12px" }}>{imgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* ตัวเลือก Trait 3 */}
                                        {this.state.showTrait3Options && (
                                            <div className="card mt-3" style={{ backgroundColor: "#e3e3e3", border: "2px solid #ddd" }}>
                                                <div className="card-body">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="ค้นหา Trait..."
                                                        className="mb-2"
                                                        onChange={(e) => this.setState({ trait3Search: e.target.value.toLowerCase() })}
                                                    />

                                                    <div className="d-flex flex-wrap">
                                                        {[
                                                            "Academy.png",
                                                            "Ambusher.png",
                                                            "Artillerist.png",
                                                            "Autometa.png",
                                                            "Banished Mage.png",
                                                            "Black Rose.png",
                                                            "Blood Hunter.png",
                                                            "Bruiser.png",
                                                            "Chem-Baron.png",
                                                            "Conqueror.png",
                                                            "Dominator.png",
                                                            "Emissary.png",
                                                            "Enforcer.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "Form Swapper.png",
                                                            "High Roller.png",
                                                            "Junker King.png",
                                                            "Machine Herald.png",
                                                            "Pit Fighter.png",
                                                            "Quickstriker.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sentinel.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Visionary.png",
                                                            "Watcher.png"
                                                        ]
                                                            .filter((imgName) => imgName.toLowerCase().includes(this.state.trait3Search || ""))
                                                            .map((imgName, index) => (
                                                                <div key={index} className="text-center mx-2">
                                                                    <img
                                                                        src={`/Trait/${imgName}`}
                                                                        alt={imgName}
                                                                        width="80"
                                                                        height="80"
                                                                        className="border rounded"
                                                                        onClick={() => this.onSelectTrait("trait3Img", imgName)}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                    <p style={{ fontSize: "12px" }}>{imgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* ตัวเลือก Trait 4 */}
                                        {this.state.showTrait4Options && (
                                            <div className="card mt-3" style={{ backgroundColor: "#e3e3e3", border: "2px solid #ddd" }}>
                                                <div className="card-body">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="ค้นหา Trait..."
                                                        className="mb-2"
                                                        onChange={(e) => this.setState({ trait4Search: e.target.value.toLowerCase() })}
                                                    />

                                                    <div className="d-flex flex-wrap">
                                                        {[
                                                            "Academy.png",
                                                            "Ambusher.png",
                                                            "Artillerist.png",
                                                            "Autometa.png",
                                                            "Banished Mage.png",
                                                            "Black Rose.png",
                                                            "Blood Hunter.png",
                                                            "Bruiser.png",
                                                            "Chem-Baron.png",
                                                            "Conqueror.png",
                                                            "Dominator.png",
                                                            "Emissary.png",
                                                            "Enforcer.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "Form Swapper.png",
                                                            "High Roller.png",
                                                            "Junker King.png",
                                                            "Machine Herald.png",
                                                            "Pit Fighter.png",
                                                            "Quickstriker.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sentinel.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Visionary.png",
                                                            "Watcher.png"
                                                        ]
                                                            .filter((imgName) => imgName.toLowerCase().includes(this.state.trait4Search || ""))
                                                            .map((imgName, index) => (
                                                                <div key={index} className="text-center mx-2">
                                                                    <img
                                                                        src={`/Trait/${imgName}`}
                                                                        alt={imgName}
                                                                        width="80"
                                                                        height="80"
                                                                        className="border rounded"
                                                                        onClick={() => this.onSelectTrait("trait4Img", imgName)}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                    <p style={{ fontSize: "12px" }}>{imgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="mt-3">
                                        เพิ่มตัวละคร
                                    </Button>
                                </Form>

                            </div>
                        </div>
                        <div className="card mt-3">
                            <div className="card-body">
                                <h5>รายชื่อตัวละคร</h5>
                                <table className="table table-dark table-bordered ">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Champion</th>
                                            <th className="text-center">Cost</th>
                                            <th className="text-center">Traits</th>
                                            <th className="text-center">Attack Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.dataX.length > 0 ? (
                                            this.state.dataX.map((character, index) => (
                                                <tr key={index}>
                                                    <td className="align-items-center">
                                                        <img
                                                            src={character.img.startsWith("data:image/png;base64,") ? character.img : `data:image/png;base64,${character.img}`}
                                                            alt={character.name}
                                                            width="60"
                                                            height="60"
                                                            className="me-2"
                                                        />
                                                        <span className="align-items-center">{character.name}</span>
                                                    </td>

                                                    <td className="text-center">💰 {character.Price}</td>

                                                    <td>
                                                        <div className="d-flex flex-column align-items-start">
                                                            {character.Trait_1_img && (
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={character.Trait_1_img.startsWith("data:image/png;base64,") ? character.Trait_1_img : `data:image/png;base64,${character.Trait_1_img}`}
                                                                        width="16"
                                                                        height="16"
                                                                        className="me-1"
                                                                        alt="Trait 1"
                                                                    />
                                                                    <span>{character.Trait_1_name}</span>
                                                                </div>
                                                            )}
                                                            {character.Trait_2_img && (
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={character.Trait_2_img.startsWith("data:image/png;base64,") ? character.Trait_2_img : `data:image/png;base64,${character.Trait_2_img}`}
                                                                        width="16"
                                                                        height="16"
                                                                        className="me-1"
                                                                        alt="Trait 2"
                                                                    />
                                                                    <span>{character.Trait_2_name}</span>
                                                                </div>
                                                            )}
                                                            {character.Trait_3_img && (
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={character.Trait_3_img.startsWith("data:image/png;base64,") ? character.Trait_3_img : `data:image/png;base64,${character.Trait_3_img}`}
                                                                        width="16"
                                                                        height="16"
                                                                        className="me-1"
                                                                        alt="Trait 3"
                                                                    />
                                                                    <span>{character.Trait_3_name}</span>
                                                                </div>
                                                            )}
                                                            {character.Trait_4_img && (
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={character.Trait_4_img.startsWith("data:image/png;base64,") ? character.Trait_4_img : `data:image/png;base64,${character.Trait_4_img}`}
                                                                        width="16"
                                                                        height="16"
                                                                        className="me-1"
                                                                        alt="Trait 4"
                                                                    />
                                                                    <span>{character.Trait_4_name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} style={{ color: i < character.Distance ? (character.Distance <= 2 ? "orange" : "red") : "gray" }}>
                                                                ▮
                                                            </span>
                                                        ))}
                                                    </td>


                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="text-center">
                                                    ไม่มีข้อมูลตัวละคร
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div>
                        </div>

                    </div>
                </div>




            </>
        );
    }
}
