// src/components/ImageGenerator.jsx
import React, { useState, useRef } from "react";
import { generateInitialImage, generateFinalImage } from "../api";

const MODEL_OPTIONS = [
  { id: "cycle-gan-turbo", name: "Cycle GAN-turbo", label: "Cycle GAN-turbo" },
  { id: "cycle-gan", name: "Cycle GAN", label: "Cycle GAN" },
  { id: "style-gan", name: "Style GAN", label: "Style GAN" }
];

const LoadingSpinner = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  }}>
    <div style={{
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      "@keyframes spin": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" }
      }
    }} />
    <p style={{ color: "#666", fontSize: "1.1rem" }}>생성 중...</p>
  </div>
);

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [initialImage, setInitialImage] = useState("");
  const [finalImage, setFinalImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("cycle-gan-turbo");
  const imageSectionRef = useRef(null);

  const handleInitialGeneration = async () => {
    if (!prompt) return;
    setLoading(true);
    setError("");
    try {
      const imageData = await generateInitialImage(prompt);
      setInitialImage(imageData);
      setFinalImage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalGeneration = async () => {
    if (!initialImage) return;
    setLoading(true);
    setError("");
    try {
      const imageData = await generateFinalImage(initialImage, selectedModel);
      setFinalImage(imageData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleInitialGeneration();
  };

  const handleReset = () => {
    setPrompt("");
    setInitialImage("");
    setFinalImage("");
    setError("");
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      margin: 0,
      padding: 0
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        width: "100%",
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "40px 20px",
        margin: "20px"
      }}>
        {/* 프롬프트 표시 */}
        {prompt && (
          <div style={{
            width: "100%",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "bold" }}>prompt:</span>
              <span>{prompt}</span>
            </div>
          </div>
        )}

        {/* 메인 컨텐츠 영역 */}
        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* 이미지 및 컨트롤 영역 */}
          <div style={{
            width: "100%",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}>
            {/* 프롬프트 입력 폼 */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInitialGeneration();
              }}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px"
              }}
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="텍스트 프롬프트를 입력하세요 (예: yellow T-shirt)"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "1rem"
                }}
              />
              <button
                type="submit"
                disabled={loading || !prompt}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: loading || !prompt ? "not-allowed" : "pointer",
                  opacity: loading || !prompt ? 0.6 : 1,
                  fontSize: "1rem",
                  whiteSpace: "nowrap"
                }}
              >
                생성
              </button>
            </form>

            {/* 이미지 표시 영역 */}
            {initialImage && (
              <div style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                position: "relative"
              }}>
                {loading && (
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    zIndex: 1
                  }}>
                    <LoadingSpinner />
                  </div>
                )}
                <img
                  src={`data:image/png;base64,${initialImage}`}
                  alt="Generated"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "4px"
                  }}
                />
              </div>
            )}

            {/* 초기 로딩 상태 */}
            {loading && !initialImage && (
              <div style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: "white",
                minHeight: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <LoadingSpinner />
              </div>
            )}

            {/* 모델 선택 라디오 버튼 */}
            {initialImage && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px"
              }}>
                <div style={{ fontWeight: "bold", color: "#666" }}>Model select</div>
                <div style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center"
                }}>
                  {MODEL_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer"
                      }}
                    >
                      <input
                        type="radio"
                        name="model"
                        value={option.id}
                        checked={selectedModel === option.id}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        style={{ cursor: "pointer" }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 액션 버튼들 */}
            {initialImage && (
              <div style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center"
              }}>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  style={{
                    padding: "8px 24px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  regenerate
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  style={{
                    padding: "8px 24px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  reset
                </button>
                <button
                  onClick={handleFinalGeneration}
                  disabled={loading}
                  style={{
                    padding: "8px 24px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  style transform
                </button>
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              padding: "20px",
              backgroundColor: "#ffebee",
              borderRadius: "6px",
              color: "#d32f2f"
            }}>
              <p>{error}</p>
            </div>
          )}

          {/* 변환된 이미지 */}
          {finalImage && (
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              position: "relative"
            }}>
              {loading && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                  zIndex: 1
                }}>
                  <LoadingSpinner />
                </div>
              )}
              <img
                src={`data:image/png;base64,${finalImage}`}
                alt="Transformed"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "4px"
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
