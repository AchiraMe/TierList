import axios from "axios";

// กำหนด URL หลัก
const BASE_URL = "https://api.lemansturismo.com/api";

export default class Service {
  // Get Token JWT
  gettoken = async (username, password) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const formData = new URLSearchParams();
    formData.append("method", "login");
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(`${BASE_URL}/login`, formData, config);
      return response.data;
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };
  getcharacters = async (token) => {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // เพิ่ม Bearer Token
      },
    };

    try {
      const response = await axios.get(`${BASE_URL}/getcharacters`, config);
      return response.data; // Return ข้อมูลที่ได้จาก API
    } catch (error) {
      console.error("Error in characters:", error);
      throw error;
    }
  };

  getuserinfo = async (token) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new URLSearchParams();
    formData.append("method", "getuserinfo");

    try {
      const response = await axios.post(`${BASE_URL}/getuserinfo`, formData, config);
      return response.data;
    } catch (error) {
      console.error("Error in getuserinfo:", error);
      throw error;
    }
  };
  submitPatch = async (token, patch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    };
  
    const formData = new URLSearchParams();
    formData.append("patch", patch);
  
    try {
      const response = await axios.post(`${BASE_URL}/addPatch`, formData, config);
      return response.data;
    } catch (error) {
      console.error("Error in addPatch:", error);
      throw error;
    }
  };
  Addcharacters = async (token, base64Image, characterName) => {
    try {
      console.log("Starting Addcharacters function...");
      console.log("Token:", token);
      console.log("Base64 Image:", base64Image ? base64Image.substring(0, 50) + "..." : "No Image"); // แสดงแค่ส่วนต้นของ Base64
      console.log("Character Name:", characterName);
  
      const response = await new Service().Addcharacters(token, base64Image, characterName);
  
      console.log("API Response:", response);
  
      if (response.success) {
        alert("เพิ่มตัวละครสำเร็จ!");
        console.log("Character added successfully.");
        this.setState({ uploadedFile: null, base64Image: null, characterName: "" });
      } else {
        console.warn("Add character failed:", response.message || "Unknown error");
        alert("ไม่สามารถเพิ่มตัวละครได้");
      }
    } catch (error) {
      console.error("Error adding character:", error);
      alert("Failed to submit. Please try again.");
    }
  };
  
  
  GetPatch = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const formData = new URLSearchParams();
    formData.append("method", "GetPatch");

    try {
      const response = await axios.get(`${BASE_URL}/GetPatch`, formData, config);
      return response.data;
    } catch (error) {
      console.error("Error in GetPatch:", error);
      throw error;
    }
  };




}
