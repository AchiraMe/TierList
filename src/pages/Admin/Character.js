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
    handleTraitImageChange = (event, traitKey) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ [traitKey]: reader.result });
            };
            reader.readAsDataURL(file);
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
                                            <div className="image-container mt-3">
                                                {/* รูปที่อัปโหลด */}
                                                <img
                                                    src={this.state.base64Image}
                                                    alt="Preview"
                                                    className="uploaded-image"
                                                />

                                                {/* กรอบรูปจาก public */}
                                                <img
                                                    src="frame/Subtract.png" // ต้องมีไฟล์ frame.png อยู่ใน public/
                                                    alt="Frame"
                                                    className="frame-overlay"
                                                />
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
                                                            src={this.state.trait1Img}
                                                            alt={this.state.trait1ImgName}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => this.setState({ showTrait1Options: true })}
                                                        />
                                                        <p className="mt-1">{this.state.trait1ImgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
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
                                                    <div >
                                                        <img
                                                            src={this.state.trait2Img}
                                                            alt={this.state.trait2ImgName}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => this.setState({ showTrait2Options: true })}
                                                        />
                                                        <p className="mt-1">{this.state.trait2ImgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
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
                                                    <div className="mt-2">
                                                        <img
                                                            src={this.state.trait3Img}
                                                            alt={this.state.trait3ImgName}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => this.setState({ showTrait3Options: true })}
                                                        />
                                                        <p className="mt-1">{this.state.trait3ImgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
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
                                                    <div className="mt-2">
                                                        <img
                                                            src={this.state.trait4Img}
                                                            alt={this.state.trait4ImgName}
                                                            width="80"
                                                            height="80"
                                                            className="border rounded"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => this.setState({ showTrait4Options: true })}
                                                        />
                                                        <p className="mt-1">{this.state.trait4ImgName.replace(".png", "")}</p> {/* ตัด .png ออก */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>





                                        {/* Card ครอบรายการรูป */}
                                        {this.state.showTrait1Options && (
                                            <div className="card mt-3">
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
                                                            "Ambassador.png",
                                                            "Ambusher.png",
                                                            "BloodHunter.png",
                                                            "Bruiser.png",
                                                            "Cabal.png",
                                                            "Challenger.png",
                                                            "Crime.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "FormSwapper.png",
                                                            "Hextech.png",
                                                            "HighRoller.png",
                                                            "Hoverboard.png",
                                                            "Infused.png",
                                                            "Invoker.png",
                                                            "JunkerKing.png",
                                                            "MachineHerald.png",
                                                            "Martialist.png",
                                                            "MissMageTrait.png",
                                                            "Pugilist.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Squad.png",
                                                            "Titan.png",
                                                            "Warband.png",
                                                            "Watcher.png",
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
                                                                        onClick={() =>
                                                                            this.setState({ trait1Img: `/Trait/${imgName}`, trait1ImgName: imgName.replace(".png", ""), showTrait1Options: false })
                                                                        }
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
                                            <div className="card mt-3">
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
                                                            "Ambassador.png",
                                                            "Ambusher.png",
                                                            "BloodHunter.png",
                                                            "Bruiser.png",
                                                            "Cabal.png",
                                                            "Challenger.png",
                                                            "Crime.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "FormSwapper.png",
                                                            "Hextech.png",
                                                            "HighRoller.png",
                                                            "Hoverboard.png",
                                                            "Infused.png",
                                                            "Invoker.png",
                                                            "JunkerKing.png",
                                                            "MachineHerald.png",
                                                            "Martialist.png",
                                                            "MissMageTrait.png",
                                                            "Pugilist.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Squad.png",
                                                            "Titan.png",
                                                            "Warband.png",
                                                            "Watcher.png",
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
                                                                        onClick={() =>
                                                                            this.setState({ trait2Img: `/Trait/${imgName}`, trait2ImgName: imgName.replace(".png", ""), showTrait2Options: false })
                                                                        }
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
                                            <div className="card mt-3">
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
                                                            "Ambassador.png",
                                                            "Ambusher.png",
                                                            "BloodHunter.png",
                                                            "Bruiser.png",
                                                            "Cabal.png",
                                                            "Challenger.png",
                                                            "Crime.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "FormSwapper.png",
                                                            "Hextech.png",
                                                            "HighRoller.png",
                                                            "Hoverboard.png",
                                                            "Infused.png",
                                                            "Invoker.png",
                                                            "JunkerKing.png",
                                                            "MachineHerald.png",
                                                            "Martialist.png",
                                                            "MissMageTrait.png",
                                                            "Pugilist.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Squad.png",
                                                            "Titan.png",
                                                            "Warband.png",
                                                            "Watcher.png",
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
                                                                        onClick={() =>
                                                                            this.setState({ trait3Img: `/Trait/${imgName}`, trait3ImgName: imgName.replace(".png", ""), showTrait3Options: false })
                                                                        }
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
                                            <div className="card mt-3">
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
                                                            "Ambassador.png",
                                                            "Ambusher.png",
                                                            "BloodHunter.png",
                                                            "Bruiser.png",
                                                            "Cabal.png",
                                                            "Challenger.png",
                                                            "Crime.png",
                                                            "Experiment.png",
                                                            "Family.png",
                                                            "FormSwapper.png",
                                                            "Hextech.png",
                                                            "HighRoller.png",
                                                            "Hoverboard.png",
                                                            "Infused.png",
                                                            "Invoker.png",
                                                            "JunkerKing.png",
                                                            "MachineHerald.png",
                                                            "Martialist.png",
                                                            "MissMageTrait.png",
                                                            "Pugilist.png",
                                                            "Rebel.png",
                                                            "Scrap.png",
                                                            "Sniper.png",
                                                            "Sorcerer.png",
                                                            "Squad.png",
                                                            "Titan.png",
                                                            "Warband.png",
                                                            "Watcher.png",
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
                                                                        onClick={() =>
                                                                            this.setState({ trait4Img: `/Trait/${imgName}`, trait4ImgName: imgName.replace(".png", ""), showTrait4Options: false })
                                                                        }
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
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>รูปภาพ</th>
                                            <th>ชื่อตัวละคร</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.dataX.length > 0 ? (
                                            this.state.dataX.map((character, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={`data:image/png;base64,${character.img}`}
                                                            alt={character.name}
                                                            width="50"
                                                            height="50"
                                                        />
                                                    </td>
                                                    <td>{character.name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center">
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
