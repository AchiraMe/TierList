import axios from "axios";

var config = { headers: { "Accept": "application/json" } };
const Url = "https://api.lemansturismo.com/api";

export default class Service {
    getuserinfo = async (token) => {
    const config = {
      headers: {
        Accept: "application/json", // รับข้อมูลแบบ JSON
        Authorization: token, // ใส่ token ใน header
      },
    };

    const formData = new FormData();
    formData.append("method", "getuserinfo"); // ส่งข้อมูล method ไปกับคำขอ

    try {
      const response = await axios.post(Url, formData, config);
      return response.data; // ส่งคืนข้อมูล response
    } catch (error) {
      console.error("Error in getuserinfo:", error); // จัดการข้อผิดพลาด
      throw error; // โยนข้อผิดพลาดเพื่อให้ฝั่งผู้เรียกใช้งานจัดการ
    }
  };
}
