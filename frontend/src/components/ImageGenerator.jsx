// src/components/ImageGenerator.jsx
import React, { useState, useRef } from "react";
import { generateInitialImage, generateFinalImage } from "../api";

// 개발 모드 설정 (true: 더미 이미지 사용, false: 실제 API 호출)
const USE_DUMMY_DATA = true;

// 개발용 더미 이미지 데이터
const DUMMY_INITIAL_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAZABkAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==";

const DUMMY_FINAL_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAZABkAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+t6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//2Q==";

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
      if (USE_DUMMY_DATA) {
        // 개발 모드에서는 더미 이미지 사용
        await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
        setInitialImage(DUMMY_INITIAL_IMAGE.split(',')[1]); // base64 데이터 부분만 추출
      } else {
        // 프로덕션 모드에서는 실제 API 호출
        const imageData = await generateInitialImage(prompt);
        setInitialImage(imageData);
      }
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
      if (USE_DUMMY_DATA) {
        // 개발 모드에서는 더미 이미지 사용
        await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
        setFinalImage(DUMMY_FINAL_IMAGE.split(',')[1]); // base64 데이터 부분만 추출
      } else {
        // 프로덕션 모드에서는 실제 API 호출
        const imageData = await generateFinalImage(initialImage, selectedModel);
        setFinalImage(imageData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (finalImage) {
      // finalImage가 있으면 style transform을 다시 실행
      handleFinalGeneration();
    } else {
      // finalImage가 없으면 initial 이미지를 다시 생성
      handleInitialGeneration();
    }
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
          display: "flex",
          gap: "20px",
          width: "calc(100% + 38px)"
        }}>
          {/* 이미지 및 컨트롤 영역 */}
          <div style={{
            flex: 1,
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
            {initialImage && !finalImage && (
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

            {/* 변환된 이미지 */}
            {finalImage && (
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

            {/* 액션 버튼들 */}
            {initialImage && (
              <div style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "20px"
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
                {!finalImage ? (
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
                ) : (
                  <button
                    onClick={() => {
                      // Base64 데이터를 Blob으로 변환
                      const byteCharacters = atob(finalImage);
                      const byteNumbers = new Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      const blob = new Blob([byteArray], { type: 'image/png' });

                      // Blob URL 생성 및 다운로드
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'transformed_image.png';
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }}
                    style={{
                      padding: "8px 24px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    download
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 모델 선택 라디오 버튼 */}
          {initialImage && (
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              width: "160px",
              height: "fit-content"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <div style={{ fontWeight: "bold", color: "#666" }}>Model select</div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
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
      </div>
    </div>
  );
};

export default ImageGenerator;
