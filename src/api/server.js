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
  Addcharacters = async (token, characterName, base64Image, distance, price, traits) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new URLSearchParams();
    formData.append("characterName", characterName);
    formData.append("base64Image", base64Image);
    formData.append("distance", distance);
    formData.append("price", price);
    formData.append("traits", JSON.stringify(traits));
    try {
      const response = await axios.post(`${BASE_URL}/Addcharacters`, formData, config);
      return response.data;
    } catch (error) {
      console.error("❌ Error in Addcharacters:", error);
      throw error;
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

  loaditem = async () => {
    try {
      const response = await fetch("https://api.lemansturismo.com/api/getitems"); // ดึงไฟล์จาก API
      const files = await response.json(); // ตัวอย่าง response: ["item1.png", "item2.png"]

      const itemList = files.map(file => `/Item/${file}`); // สร้างพาธของรูปทั้งหมด
      this.setState({ itemList }); // บันทึกลง state
    } catch (error) {
      console.error("Error loading item images:", error);
    }
  };



}
