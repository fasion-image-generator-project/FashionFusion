import axios from "axios";

const API_BASE_URL = 'http://localhost:8000';  // 또는 실제 백엔드 URL
const USE_DUMMY_DATA = true;  // true: 더미 데이터 사용, false: 실제 API 호출

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

        // 이미지 데이터를 ArrayBuffer로 받기
        const arrayBuffer = await response.arrayBuffer();
        
        // ArrayBuffer를 base64로 변환
        const base64 = btoa(
            new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        return base64;
    } catch (error) {
        console.error('Error generating initial image:', error);
        throw error;
    }
};

export const generateVariations = async (initialImage) => {
    try {
        if (USE_DUMMY_DATA) {
            // 더미 데이터 사용 시 721개의 프레임 이미지 URL 생성
            return Array.from({ length: 721 }, (_, i) => 
                `/frames/frame${(i + 1).toString().padStart(4, '0')}.png`
            );
        } else {
            // 실제 API 호출
            const response = await API.post("/predict/variations", {
                image: initialImage
            });
            return response.data.images;
        }
    } catch (error) {
        console.error('Error generating variations:', error);
        throw error;
    }
};
