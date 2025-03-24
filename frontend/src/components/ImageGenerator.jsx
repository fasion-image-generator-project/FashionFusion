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
    if (!prompt) return;
    setLoading(true);
    setError("");
    try {
      const imageData = await generateInitialImage(prompt);
      setInitialImage(imageData);
      setFinalImage(""); // 새로운 초기 이미지 생성 시 기존 최종 이미지 클리어
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 최종 이미지 생성 핸들러
  const handleFinalGeneration = async () => {
    if (!initialImage) return;
    setLoading(true);
    setError("");
    try {
      // 선택된 모델은 하드코딩("Cycle GAN") 또는 사용자가 선택하도록 확장할 수 있음
      const imageData = await generateFinalImage(initialImage, "Cycle GAN");
      setFinalImage(imageData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-generator-container" style={{ padding: "20px" }}>
      <h1>이미지 생성 및 변환</h1>
      {/* 프롬프트 입력 및 초기 이미지 생성 폼 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleInitialGeneration();
        }}
        style={{ marginBottom: "20px" }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="텍스트 프롬프트를 입력하세요 (예: yellow T-shirt)"
          disabled={loading}
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" disabled={loading || !prompt}>
          초기 이미지 생성
        </button>
      </form>

      {/* 로딩 상태 */}
      {loading && (
        <div className="loading-indicator">
          <p>로딩 중...</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="error-message">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}

      {/* 초기 이미지 표시 및 최종 이미지 생성 버튼 */}
      {initialImage && (
        <div className="initial-image-section" style={{ marginTop: "20px" }}>
          <h2>초기 이미지</h2>
          <img
            src={`data:image/png;base64,${initialImage}`}
            alt="Initial"
            style={{
              maxWidth: "300px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          />
          <div>
            <button onClick={handleFinalGeneration} disabled={loading}>
              최종 이미지 생성
            </button>
          </div>
        </div>
      )}

      {/* 최종 이미지 표시 */}
      {finalImage && (
        <div className="final-image-section" style={{ marginTop: "20px" }}>
          <h2>최종 이미지</h2>
          <img
            src={`data:image/png;base64,${finalImage}`}
            alt="Final"
            style={{
              maxWidth: "300px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
