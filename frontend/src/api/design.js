import axios from 'axios';

// 환경 변수에서 API 기본 URL 읽어오기 (Vite는 import.meta.env 사용)
const API_URL = import.meta.env.VITE_API_URL;

// 초기 디자인 생성 API 호출 함수
export const generateInitialDesignAPI = (inputData) => {
    return axios.post(`$(API_URL)/predict/initial`, inputData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// 최종 디자인 생성 API 호출 함수
export const generateFinalDesignAPI = (inputData) => {
    return axios.post(`${API_URL}/predict/final`, inputData, {
        headers: {
            'Content-Type': 'application/json',
        },
    }); 
};
