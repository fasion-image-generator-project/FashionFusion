import axios from "axios";

const API_BASE_URL = 'http://localhost:8000';  // 또는 실제 백엔드 URL

// Stable Diffusion 모델별 엔드포인트 매핑
const STABLE_DIFFUSION_ENDPOINTS = {
    "Stable Diffusion 1.5": "https://cysjxaqpfnhrehzk.tunnel-pt.elice.io/proxy/8000/stablediffusion1-5",
    "Stable Diffusion 3.5": "https://wrztjrpgzttncatd.tunnel-pt.elice.io/proxy/8000/stablediffusion3-5"
};

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const generateInitialImage = async (prompt, model, seed) => {
    try {
        if (!STABLE_DIFFUSION_ENDPOINTS[model]) {
            throw new Error(`Invalid model selection: ${model}`);
        }

        const endpoint = STABLE_DIFFUSION_ENDPOINTS[model];
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                seed
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 이미지 데이터를 Blob으로 받기
        const blob = await response.blob();
        
        // Blob을 base64로 변환
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // base64 문자열에서 data URL prefix 제거
                const base64data = reader.result.split(',')[1];
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error generating initial image:', error);
        throw error;
    }
};

export const generateFinalImage = async (initialImage, selectedModel, seed) => {
    try {
        const response = await API.post("/predict/final", {
            image: initialImage,
            model: selectedModel,
            seed: seed
        });
        // base64 이미지 데이터를 data URL로 변환
        return `data:image/jpeg;base64,${response.data.imageUrl}`;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.message);
    }
};
