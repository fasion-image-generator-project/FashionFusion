// src/components/ImageGenerator.jsx
import React, { useState } from "react";
import { generateInitialImage, generateFinalImage } from "../api";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [initialImage, setInitialImage] = useState("");
  const [finalImage, setFinalImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 초기 이미지 생성 핸들러
  const handleInitialGeneration = async () => {
    setLoading(true);
    setError("");
    try {
      const imageData = await generateInitialImage(prompt);
      setInitialImage(imageData);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // 최종 이미지 생성 핸들러
  const handleFinalGeneration = async () => {
    setLoading(true);
    setError("");
    try {
      // 여기서는 선택된 모델을 하드코딩("Cycle GAN")하거나 사용자가 선택한 값으로 처리합니다.
      const imageData = await generateFinalImage(initialImage, "Cycle GAN");
      setFinalImage(imageData);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>이미지 생성 및 변환</h1>
      <div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="텍스트 프롬프트를 입력하세요 (예: yellow T-shirt)"
        />
        <button onClick={handleInitialGeneration} disabled={loading}>
          초기 이미지 생성
        </button>
      </div>
      {initialImage && (
        <div>
          <h2>초기 이미지</h2>
          <img
            src={`data:image/png;base64,${initialImage}`}
            alt="Initial"
            style={{ maxWidth: "300px" }}
          />
          <button onClick={handleFinalGeneration} disabled={loading}>
            최종 이미지 생성
          </button>
        </div>
      )}
      {finalImage && (
        <div>
          <h2>최종 이미지</h2>
          <img
            src={`data:image/png;base64,${finalImage}`}
            alt="Final"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ImageGenerator;
