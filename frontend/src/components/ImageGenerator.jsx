// src/components/ImageGenerator.jsx
import React, { useState, useRef, useEffect } from "react";
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

// 이미지 확대 컴포넌트
const ImageMagnifier = ({ imageUrl, alt }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef(null);

  const magnifierWidth = 200; // 돋보기 너비
  const magnifierHeight = 150; // 돋보기 높이
  const zoomLevel = 2.5; // 확대 배율

  const handleMouseMove = (e) => {
    const elem = imgRef.current;
    const { top, left, width, height } = elem.getBoundingClientRect();

    // 마우스 위치 계산 (이미지 내부 좌표)
    const x = e.clientX - left;
    const y = e.clientY - top;

    setPosition({
      x: Math.max(0, Math.min(x, width)),
      y: Math.max(0, Math.min(y, height))
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "auto"
      }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "4px"
        }}
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
      />
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            left: `${position.x - magnifierWidth / 2}px`,
            top: `${position.y - magnifierHeight / 2}px`,
            width: `${magnifierWidth}px`,
            height: `${magnifierHeight}px`,
            border: "2px solid #007bff",
            borderRadius: "4px",
            pointerEvents: "none",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}
        >
          <img
            src={imageUrl}
            alt={alt}
            style={{
              position: "absolute",
              left: `${-position.x * (zoomLevel - 1) - (magnifierWidth / 2)}px`,
              top: `${-position.y * (zoomLevel - 1) - (magnifierHeight / 2)}px`,
              width: `${imgRef.current?.width * zoomLevel}px`,
              height: "auto"
            }}
          />
        </div>
      )}
    </div>
  );
};

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [initialImage, setInitialImage] = useState("");
  const [finalImage, setFinalImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("cycle-gan-turbo");
  const [history, setHistory] = useState(() => {
    // localStorage에서 히스토리 불러오기
    const savedHistory = localStorage.getItem('imageGenerationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const imageSectionRef = useRef(null);
  const sidebarTimeoutRef = useRef(null);

  // 히스토리가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('imageGenerationHistory', JSON.stringify(history));
  }, [history]);

  // 히스토리 삭제 함수
  const handleDeleteHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // 히스토리 전체 삭제 함수
  const handleClearHistory = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      setHistory([]);
    }
  };

  // 히스토리 항목 복원 함수
  const handleRestoreHistory = (item) => {
    setPrompt(item.prompt);
    setInitialImage(item.initialImage);
    setFinalImage(item.finalImage);
    setSelectedModel(item.model);
  };

  // 히스토리 내보내기 함수
  const handleExportHistory = () => {
    const historyData = JSON.stringify(history, null, 2);
    const blob = new Blob([historyData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fashion-fusion-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // 히스토리 가져오기 함수
  const handleImportHistory = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedHistory = JSON.parse(e.target.result);
          if (Array.isArray(importedHistory)) {
            if (window.confirm('기존 히스토리에 추가하시겠습니까? "취소"를 선택하면 기존 히스토리를 대체합니다.')) {
              setHistory(prev => [...prev, ...importedHistory]);
            } else {
              setHistory(importedHistory);
            }
          }
        } catch (err) {
          alert('잘못된 형식의 파일입니다.');
        }
      };
      reader.readAsText(file);
    }
    // 파일 입력값 초기화
    event.target.value = '';
  };

  const handleInitialGeneration = async () => {
    if (!prompt) return;
    setLoading(true);
    setError("");
    try {
      if (USE_DUMMY_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInitialImage(DUMMY_INITIAL_IMAGE.split(',')[1]);
      } else {
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        const finalImageData = DUMMY_FINAL_IMAGE.split(',')[1];
        setFinalImage(finalImageData);

        // 히스토리에 추가
        const newHistoryItem = {
          id: Date.now(),
          prompt,
          initialImage,
          finalImage: finalImageData,
          model: selectedModel,
          timestamp: new Date().toLocaleString()
        };
        setHistory(prev => [newHistoryItem, ...prev]);
      } else {
        const imageData = await generateFinalImage(initialImage, selectedModel);
        setFinalImage(imageData);

        // 히스토리에 추가
        const newHistoryItem = {
          id: Date.now(),
          prompt,
          initialImage,
          finalImage: imageData,
          model: selectedModel,
          timestamp: new Date().toLocaleString()
        };
        setHistory(prev => [newHistoryItem, ...prev]);
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
      padding: 0,
      position: "relative",
      overflow: "hidden"
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes slideOut {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
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
                <ImageMagnifier
                  imageUrl={`data:image/png;base64,${initialImage}`}
                  alt="Generated"
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
                <ImageMagnifier
                  imageUrl={`data:image/png;base64,${finalImage}`}
                  alt="Transformed"
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

      {/* 히스토리 버튼 */}
      <div
        style={{
          position: "fixed",
          right: showSidebar ? "320px" : "20px",
          top: "20px",
          zIndex: 1000,
          transition: "right 0.3s ease-in-out"
        }}
      >
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>{showSidebar ? "Hide History" : "Show History"}</span>
        </button>
      </div>

      {/* 히스토리 사이드바 트리거 영역 */}
      <div
        onMouseEnter={() => {
          if (sidebarTimeoutRef.current) {
            clearTimeout(sidebarTimeoutRef.current);
          }
          setShowSidebar(true);
        }}
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "20px",
          height: "100vh",
          zIndex: 998
        }}
      />

      {/* 히스토리 사이드바 */}
      <div
        onMouseLeave={() => {
          sidebarTimeoutRef.current = setTimeout(() => {
            setShowSidebar(false);
          }, 300);
        }}
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "300px",
          backgroundColor: "white",
          height: "100vh",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
          transform: showSidebar ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 999,
          padding: "20px",
          overflowY: "auto"
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h3 style={{ margin: 0 }}>Generation History</h3>
          <div style={{ display: "flex", gap: "8px" }}>
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportHistory}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                >
                  Export
                </button>
                <button
                  onClick={handleClearHistory}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                >
                  Clear All
                </button>
              </>
            )}
            <input
              type="file"
              accept=".json"
              onChange={handleImportHistory}
              style={{ display: "none" }}
              id="history-import"
            />
            <button
              onClick={() => document.getElementById('history-import').click()}
              style={{
                padding: "4px 8px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem"
              }}
            >
              Import
            </button>
          </div>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {history.map(item => (
            <div
              key={item.id}
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px"
              }}>
                <div style={{ fontWeight: "bold" }}>
                  {item.prompt}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleRestoreHistory(item)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px"
              }}>
                <img
                  src={`data:image/png;base64,${item.initialImage}`}
                  alt="Initial"
                  style={{
                    width: "50%",
                    height: "auto",
                    borderRadius: "4px"
                  }}
                />
                <img
                  src={`data:image/png;base64,${item.finalImage}`}
                  alt="Final"
                  style={{
                    width: "50%",
                    height: "auto",
                    borderRadius: "4px"
                  }}
                />
              </div>
              <div style={{
                fontSize: "0.9em",
                color: "#666",
                display: "flex",
                justifyContent: "space-between"
              }}>
                <span>{item.model}</span>
                <span>{item.timestamp}</span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div style={{
              textAlign: "center",
              color: "#666",
              padding: "20px"
            }}>
              No history yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
