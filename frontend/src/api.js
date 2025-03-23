import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";  // 백엔드 서버 URL

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const generateInitialImage = async (prompt) => {
    try {
        const response = await API.post("/predict/initial", { text: prompt });
        return response.data.imageUrl;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.message);
    }
};

export const generateFinalImage = async (initialImage, selectedModel) => {
    try {
        const response = await API.post("/predict/final", {
            image: initialImage,
            model: selectedModel,
        });
        return response.data.imageUrl;  
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.message);
    }
};
