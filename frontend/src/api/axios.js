import axios from "axios";
import { Navigate } from "react-router-dom";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api/"
});

const navigate = Navigate();

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
        }
        return Promise.reject(error);
    }
);

export default API;