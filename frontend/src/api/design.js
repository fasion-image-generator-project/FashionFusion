import axios from 'axios';

// 환경 변수에서 API 기본 URL 읽어오기 (Vite는 import.meta.env 사용)
const API_URL = import.meta.env.VITE_API_URL;

// 초기 디자인 생성 API 호출 함수
export const generateInitialDesignAPI = (inputData) => {
    return axios.post(`${API_URL}/predict/initial`, {
        text: inputData.text,
        model: inputData.model,
        seed: inputData.seed
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        // base64 이미지 데이터를 data URL로 변환
        return {
            ...response,
            data: {
                imageUrl: `data:image/jpeg;base64,${response.data.imageUrl}`
            }
        };
    });
};

// 최종 디자인 생성 API 호출 함수
export const generateFinalDesignAPI = (inputData) => {
    return axios.post(`${API_URL}/predict/final`, {
        image: inputData.image,
        model: inputData.model,
        seed: inputData.seed
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        // base64 이미지 데이터를 data URL로 변환
        return {
            ...response,
            data: {
                imageUrl: `data:image/jpeg;base64,${response.data.imageUrl}`
            }
        };
    });
};
