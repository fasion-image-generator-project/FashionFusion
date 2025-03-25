// src/components/ImageGenerator.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { generateInitialImage, generateFinalImage } from "../api";

// 개발 모드 설정 (true: 더미 이미지 사용, false: 실제 API 호출)
const USE_DUMMY_DATA = true;

// 개발용 더미 이미지 데이터 - 파란색 이미지
const DUMMY_INITIAL_IMAGE = "data:image/svg+xml;base64," + btoa(`
  <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#2196F3"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">Initial Image</text>
  </svg>
`);

// 개발용 더미 이미지 데이터 - 초록색 이미지
const DUMMY_FINAL_IMAGE = "data:image/svg+xml;base64," + btoa(`
  <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#4CAF50"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">Transformed Image</text>
  </svg>
`);

const MODEL_OPTIONS = [
  { id: "cycle-gan-turbo", name: "Cycle GAN-turbo", label: "Cycle GAN-turbo" },
  { id: "cycle-gan", name: "Cycle GAN", label: "Cycle GAN" },
  { id: "style-gan", name: "Style GAN", label: "Style GAN" }
];

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

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

const GlobalStyle = createGlobalStyle`
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
`;

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 20px;
  margin: 20px;
`;

const PromptDisplay = styled.div`
  width: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContentArea = styled.div`
  display: flex;
  gap: 20px;
  width: calc(100% + 38px);
`;

const ImageControlArea = styled.div`
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: ${props => {
    if (props.variant === 'success') return '#28a745';
    if (props.variant === 'danger') return '#dc3545';
    return '#007bff';
  }};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  font-size: 1rem;
  white-space: nowrap;
`;

const ImageContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: contain;
  aspect-ratio: 1;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const ModelSelect = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 160px;
  height: fit-content;
`;

const ModelOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #ffebee;
  border-radius: 6px;
  color: #d32f2f;
`;

const HistoryButton = styled.div`
  position: fixed;
  right: ${props => props.showSidebar ? "320px" : "20px"};
  top: 20px;
  z-index: 1000;
  transition: right 0.3s ease-in-out;
`;

const SidebarTrigger = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 20px;
  height: 100vh;
  z-index: 998;
`;

const Sidebar = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  background-color: white;
  height: 100vh;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  transform: ${props => props.show ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease-in-out;
  z-index: 999;
  padding: 20px;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HistoryItem = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const HistoryItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HistoryImages = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const HistoryImage = styled.img`
  width: 50%;
  height: auto;
  border-radius: 4px;
`;

const HistoryFooter = styled.div`
  font-size: 0.9em;
  color: #666;
  display: flex;
  justify-content: space-between;
`;

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
        setInitialImage(DUMMY_INITIAL_IMAGE);
      } else {
        const imageData = await generateInitialImage(prompt);
        setInitialImage(`data:image/png;base64,${imageData}`);
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
        const finalImageData = DUMMY_FINAL_IMAGE;
        setFinalImage(finalImageData);

        // 히스토리에 추가
        const newHistoryItem = {
          id: Date.now(),
          prompt,
          initialImage: DUMMY_INITIAL_IMAGE,
          finalImage: finalImageData,
          model: selectedModel,
          timestamp: new Date().toLocaleString()
        };
        setHistory(prev => [newHistoryItem, ...prev]);
      } else {
        const imageData = await generateFinalImage(initialImage, selectedModel);
        const finalImageData = `data:image/png;base64,${imageData}`;
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
    <>
      <GlobalStyle />
      <Container>
        <MainContent>
          {prompt && (
            <PromptDisplay>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "bold" }}>prompt:</span>
                <span>{prompt}</span>
              </div>
            </PromptDisplay>
          )}

          <ContentArea>
            <ImageControlArea>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleInitialGeneration();
              }}>
                <Input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="텍스트 프롬프트를 입력하세요 (예: yellow T-shirt)"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !prompt}>
                  생성
                </Button>
              </Form>

              {initialImage && !finalImage && (
                <ImageContainer>
                  {loading && (
                    <LoadingOverlay>
                      <LoadingSpinner />
                    </LoadingOverlay>
                  )}
                  <StyledImage
                    src={initialImage}
                    alt="Initial"
                  />
                </ImageContainer>
              )}

              {loading && !initialImage && (
                <ImageContainer>
                  <LoadingSpinner />
                </ImageContainer>
              )}

              {finalImage && (
                <ImageContainer>
                  {loading && (
                    <LoadingOverlay>
                      <LoadingSpinner />
                    </LoadingOverlay>
                  )}
                  <StyledImage
                    src={finalImage}
                    alt="Transformed"
                  />
                </ImageContainer>
              )}

              {initialImage && (
                <ButtonGroup>
                  <Button onClick={handleRegenerate} disabled={loading}>
                    regenerate
                  </Button>
                  <Button onClick={handleReset} disabled={loading}>
                    reset
                  </Button>
                  {!finalImage ? (
                    <Button onClick={handleFinalGeneration} disabled={loading}>
                      style transform
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => {
                        const byteCharacters = atob(finalImage.split(',')[1]);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                          byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: 'image/png' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'transformed_image.png';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      }}
                    >
                      download
                    </Button>
                  )}
                </ButtonGroup>
              )}
            </ImageControlArea>

            {initialImage && (
              <ModelSelect>
                <ModelOptions>
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
                </ModelOptions>
              </ModelSelect>
            )}
          </ContentArea>

          {error && (
            <ErrorMessage>
              <p>{error}</p>
            </ErrorMessage>
          )}
        </MainContent>

        <HistoryButton showSidebar={showSidebar}>
          <Button onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? "Hide History" : "Show History"}
          </Button>
        </HistoryButton>

        <SidebarTrigger
          onMouseEnter={() => {
            if (sidebarTimeoutRef.current) {
              clearTimeout(sidebarTimeoutRef.current);
            }
            setShowSidebar(true);
          }}
        />

        <Sidebar
          show={showSidebar}
          onMouseLeave={() => {
            sidebarTimeoutRef.current = setTimeout(() => {
              setShowSidebar(false);
            }, 300);
          }}
        >
          <SidebarHeader>
            <h3 style={{ margin: 0 }}>Generation History</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {history.length > 0 && (
                <>
                  <Button variant="success" onClick={handleExportHistory}>
                    Export
                  </Button>
                  <Button variant="danger" onClick={handleClearHistory}>
                    Clear All
                  </Button>
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleImportHistory}
                style={{ display: "none" }}
                id="history-import"
              />
              <Button onClick={() => document.getElementById('history-import').click()}>
                Import
              </Button>
            </div>
          </SidebarHeader>

          <HistoryList>
            {history.map(item => (
              <HistoryItem key={item.id}>
                <HistoryItemHeader>
                  <div style={{ fontWeight: "bold" }}>
                    {item.prompt}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      variant="success"
                      onClick={() => handleRestoreHistory(item)}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteHistory(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </HistoryItemHeader>
                <HistoryImages>
                  <HistoryImage
                    src={item.initialImage}
                    alt="Initial"
                  />
                  <HistoryImage
                    src={item.finalImage}
                    alt="Final"
                  />
                </HistoryImages>
                <HistoryFooter>
                  <span>{item.model}</span>
                  <span>{item.timestamp}</span>
                </HistoryFooter>
              </HistoryItem>
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
          </HistoryList>
        </Sidebar>
      </Container>
    </>
  );
};

export default ImageGenerator;
