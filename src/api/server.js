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


}
