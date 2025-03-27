import axios from "axios";
import JSZip from 'jszip';

const API_BASE_URL = 'http://localhost:8000';  // 또는 실제 백엔드 URL
const USE_DUMMY_DATA = false;  // true: 더미 데이터 사용, false: 실제 API 호출

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

/**
 * 이미지를 서버에 업로드
 * @param {string} imageData - base64로 인코딩된 이미지 데이터
 * @returns {Promise<{image_id: string, original_filename: string}>} - 업로드된 이미지 정보
 */
export const uploadImage = async (imageData) => {
  try {
    // base64 데이터를 Blob으로 변환
    const base64Response = await fetch(imageData);
    const blob = await base64Response.blob();
    
    // FormData 생성 및 이미지 추가
    const formData = new FormData();
    formData.append('image', blob, 'image.png');

    const response = await fetch('https://bczqcjwadrmfxrjs.tunnel-pt.elice.io/proxy/8000/upload-image/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * 랜덤 시드 기반 스타일 믹싱 실행
 * @param {string} imageId - 업로드된 이미지의 ID
 * @returns {Promise<{job_id: string, status: string, message: string, num_seeds: number}>} - 작업 정보
 */
export const seedStyleMixing = async (imageId) => {
  try {
    const response = await fetch('https://bczqcjwadrmfxrjs.tunnel-pt.elice.io/proxy/8000/seed-style-mixing/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uploaded_image_id: imageId,
        num_seeds: 100,
        layer_cutoff: 8,
        truncation: 0.7,
        seed_range: [0],
        base_seed: 0
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start style mixing');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error starting style mixing:', error);
    throw error;
  }
};

/**
 * 단순화된 시드 스타일 믹싱 결과 다운로드
 * @param {string} jobId - 작업 ID
 * @returns {Promise<Array<string>>} - 생성된 이미지 URL 배열
 */
export const getSimplifiedResults = async (jobId) => {
  try {
    const response = await fetch(`https://bczqcjwadrmfxrjs.tunnel-pt.elice.io/proxy/8000/simplified-seed-results/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get results');
    }

    // ZIP 파일을 Blob으로 받기
    const zipBlob = await response.blob();
    
    // JSZip으로 ZIP 파일 읽기
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBlob);
    
    // 이미지 파일들 추출 (001.png ~ 100.png)
    const imageFiles = Array.from({ length: 100 }, (_, i) => 
      `${(i + 1).toString().padStart(3, '0')}.png`
    ).map(filename => zipContent.files[filename]);
    
    // 이미지 파일들을 base64로 변환
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const content = await file.async('base64');
        return `data:image/png;base64,${content}`;
      })
    );

    return imageUrls;
  } catch (error) {
    console.error('Error getting results:', error);
    throw error;
  }
};
