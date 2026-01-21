import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.22:5000",
  timeout: 30000, // hashcat can take time
});

export default api;
