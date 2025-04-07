import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? 'http://localhost:5001/api/' : `http://192.168.5.1:5001/api/`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
