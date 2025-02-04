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

                                    {/* Trait 1 */}
                                    <Form.Group>
                                        <Form.Label>Trait 1</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.trait1Name}
                                            onChange={(e) => this.setState({ trait1Name: e.target.value })}
                                        />
                                        <Form.Control type="file" accept="image/*" onChange={(e) => this.handleTraitImageChange(e, "trait1Img")} />
                                        {this.state.trait1Img && <img src={this.state.trait1Img} alt="Trait 1" width="100" className="mt-2" />}
                                    </Form.Group>

                                    {/* Trait 2 */}
                                    <Form.Group>
                                        <Form.Label>Trait 2</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.trait2Name}
                                            onChange={(e) => this.setState({ trait2Name: e.target.value })}
                                        />
                                        <Form.Control type="file" accept="image/*" onChange={(e) => this.handleTraitImageChange(e, "trait2Img")} />
                                        {this.state.trait2Img && <img src={this.state.trait2Img} alt="Trait 2" width="100" className="mt-2" />}
                                    </Form.Group>

                                    {/* Trait 3 */}
                                    <Form.Group>
                                        <Form.Label>Trait 3</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.trait3Name}
                                            onChange={(e) => this.setState({ trait3Name: e.target.value })}
                                        />
                                        <Form.Control type="file" accept="image/*" onChange={(e) => this.handleTraitImageChange(e, "trait3Img")} />
                                        {this.state.trait3Img && <img src={this.state.trait3Img} alt="Trait 3" width="100" className="mt-2" />}
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
