/**
 * ImageGenerator Component
 * 
 * 텍스트 프롬프트를 기반으로 이미지를 생성하고 변환하는 메인 컴포넌트입니다.
 * 주요 기능:
 * - 텍스트 프롬프트 기반 초기 이미지 생성
 * - 생성된 이미지의 스타일 변환
 * - 이미지 확대/축소 기능
 * - 히스토리 관리 (저장, 불러오기, 내보내기)
 */

// src/components/ImageGenerator.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import styled, { createGlobalStyle, keyframes, ThemeProvider } from "styled-components";
import { generateInitialImage, generateFinalImage } from "../api";

// 개발 및 테스트를 위한 상수 정의
const USE_DUMMY_DATA = true; // true: 더미 데이터 사용, false: 실제 API 호출

// 더미 이미지 데이터 - 개발 및 테스트용
const DUMMY_IMAGES = {
  INITIAL: "data:image/svg+xml;base64," + btoa(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2196F3"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">Initial Image</text>
    </svg>
  `),
  FINAL: "data:image/svg+xml;base64," + btoa(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#4CAF50"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">Transformed Image</text>
    </svg>
  `)
};

// 사용 가능한 모델 옵션 정의
const MODEL_OPTIONS = [
  { id: "cycle-gan-turbo", name: "Cycle GAN-turbo", label: "Cycle GAN-turbo" },
  { id: "cycle-gan", name: "Cycle GAN", label: "Cycle GAN" },
  { id: "style-gan", name: "Style GAN", label: "Style GAN" }
];

// 테마 정의
const lightTheme = {
  primary: '#007bff',
  success: '#28a745',
  danger: '#dc3545',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  border: '#dddddd',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  spinnerBorder: '#f3f3f3',
  spinnerActive: '#3498db'
};

const darkTheme = {
  primary: '#0d6efd',
  success: '#198754',
  danger: '#dc3545',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#333333',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  spinnerBorder: '#333333',
  spinnerActive: '#0d6efd'
};

/**
 * 로딩 스피너 컴포넌트
 * 이미지 생성/변환 중 로딩 상태를 표시
 */
const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${props => props.theme.spinnerBorder};
  border-top: 5px solid ${props => props.theme.spinnerActive};
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

/**
 * 이미지 확대 컴포넌트
 * 마우스 오버 시 이미지의 특정 부분을 확대하여 보여줌
 */
const ImageMagnifier = ({ imageUrl, alt }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef(null);

  const magnifierWidth = 200;
  const magnifierHeight = 200;
  const zoomLevel = 2.5;

  const handleMouseMove = (e) => {
    const elem = imgRef.current;
    if (!elem) return;

    const { top, left, width, height } = elem.getBoundingClientRect();
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
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt={alt}
        style={{
          maxWidth: "100%",
          height: "400px",
          objectFit: "contain",
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
            backgroundColor: "white",
            zIndex: 100,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
          }}
        >
          <img
            src={imageUrl}
            alt={alt}
            style={{
              position: "absolute",
              left: `${-position.x * (zoomLevel - 1) - (magnifierWidth / 2)}px`,
              top: `${-position.y * (zoomLevel - 1) - (magnifierHeight / 2)}px`,
              maxWidth: "none",
              height: `${400 * zoomLevel}px`,
              objectFit: "contain"
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * 전역 스타일 정의
 * 애니메이션 키프레임과 전역적으로 적용될 스타일 설정
 */
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }

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
  background-color: ${props => props.theme.background};
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  color: ${props => props.theme.text};
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
  background-color: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px ${props => props.theme.shadow};
`;

const ContentArea = styled.div`
  display: flex;
  gap: 20px;
  width: calc(100% + 38px);
`;

const ImageControlArea = styled.div`
  flex: 1;
  background-color: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px ${props => props.theme.shadow};
`;

const Form = styled.form.attrs(props => ({
  'aria-label': 'Image generation form',
}))`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input.attrs(props => ({
  'aria-label': 'Text prompt input',
  'aria-disabled': props.disabled,
  'aria-required': props.required,
}))`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.border};
  font-size: 1rem;
  background-color: ${props => props.theme.surface};
  color: ${props => props.theme.text};

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const Button = styled.button.attrs(props => ({
  'aria-disabled': props.disabled,
  role: 'button',
}))`
  padding: 12px 24px;
  background-color: ${props => {
    if (props.variant === 'success') return props.theme.success;
    if (props.variant === 'danger') return props.theme.danger;
    return props.theme.primary;
  }};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  font-size: 1rem;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
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
  background-color: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px ${props => props.theme.shadow};
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
  background-color: ${props => props.theme.danger}15;
  border-radius: 6px;
  color: ${props => props.theme.danger};
  border: 1px solid ${props => props.theme.danger}30;
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
  background-color: ${props => props.theme.surface};
  height: 100vh;
  box-shadow: -2px 0 5px ${props => props.theme.shadow};
  transform: ${props => props.show ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease-in-out;
  z-index: 999;
  padding: 20px;
  overflow-y: auto;
  color: ${props => props.theme.text};
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
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.surface};
  box-shadow: 0 1px 3px ${props => props.theme.shadow};
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
  color: ${props => props.theme.textSecondary};
  display: flex;
  justify-content: space-between;
`;

/**
 * 메모이제이션된 컴포넌트들
 * 불필요한 리렌더링을 방지하기 위해 React.memo 사용
 */
const MemoizedImageMagnifier = React.memo(ImageMagnifier);
const MemoizedLoadingSpinner = React.memo(LoadingSpinner);

/**
 * 히스토리 아이템 컴포넌트
 * 개별 히스토리 항목을 표시하는 메모이제이션된 컴포넌트
 */
const HistoryItemComponent = React.memo(({ item, onRestore, onDelete }) => (
  <HistoryItem
    role="listitem"
    aria-label={`History item: ${item.prompt}`}
  >
    <HistoryItemHeader>
      <div style={{ fontWeight: "bold" }}>
        {item.prompt}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          variant="success"
          onClick={() => onRestore(item)}
          aria-label={`Restore generation: ${item.prompt}`}
        >
          Restore
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(item.id)}
          aria-label={`Delete history item: ${item.prompt}`}
        >
          Delete
        </Button>
      </div>
    </HistoryItemHeader>
    <HistoryImages>
      <HistoryImage src={item.initialImage} alt="Initial" />
      <HistoryImage src={item.finalImage} alt="Final" />
    </HistoryImages>
    <HistoryFooter>
      <span>{item.model}</span>
      <span>{item.timestamp}</span>
    </HistoryFooter>
  </HistoryItem>
));

/**
 * 모델 선택 컴포넌트
 * 스타일 변환에 사용할 모델을 선택하는 메모이제이션된 컴포넌트
 */
const ModelSelectComponent = React.memo(({ selectedModel, onModelChange }) => (
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
              onChange={(e) => onModelChange(e.target.value)}
              style={{ cursor: "pointer" }}
            />
            {option.label}
          </label>
        ))}
      </div>
    </ModelOptions>
  </ModelSelect>
));

const ThemeToggle = styled.button`
  position: fixed;
  left: 20px;
  top: 20px;
  padding: 10px;
  border-radius: 50%;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  cursor: pointer;
  z-index: 1000;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px ${props => props.theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.theme.background};
  }
`;

/**
 * 메인 ImageGenerator 컴포넌트
 * 전체 애플리케이션의 상태와 로직을 관리
 */
const ImageGenerator = () => {
  // 상태 관리
  const [state, setState] = useState({
    prompt: "",              // 텍스트 프롬프트
    initialImage: "",        // 초기 생성된 이미지
    finalImage: "",          // 변환된 이미지
    loading: false,          // 로딩 상태
    error: "",              // 에러 메시지
    selectedModel: "cycle-gan-turbo"  // 선택된 모델
  });

  // 히스토리 상태 - localStorage와 동기화
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('imageGenerationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // 사이드바 표시 상태
  const [showSidebar, setShowSidebar] = useState(false);

  // Refs
  const imageSectionRef = useRef(null);
  const sidebarTimeoutRef = useRef(null);

  // 메모이제이션된 값들
  const isGenerateDisabled = useMemo(() =>
    state.loading || !state.prompt,
    [state.loading, state.prompt]
  );

  const canShowModelSelect = useMemo(() =>
    Boolean(state.initialImage),
    [state.initialImage]
  );

  // 다크모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 다크모드 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // 효과
  useEffect(() => {
    // 히스토리 변경 시 localStorage에 저장
    localStorage.setItem('imageGenerationHistory', JSON.stringify(history));
  }, [history]);

  // 콜백 함수들
  /**
   * 히스토리 항목 삭제 처리
   */
  const handleDeleteHistory = useCallback((id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  /**
   * 히스토리 전체 삭제 처리
   */
  const handleClearHistory = useCallback(() => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      setHistory([]);
    }
  }, []);

  /**
   * 히스토리 항목 복원 처리
   */
  const handleRestoreHistory = useCallback((item) => {
    setState(prev => ({
      ...prev,
      prompt: item.prompt,
      initialImage: item.initialImage,
      finalImage: item.finalImage,
      selectedModel: item.model
    }));
  }, []);

  /**
   * 히스토리 내보내기 처리
   */
  const handleExportHistory = useCallback(() => {
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
  }, [history]);

  /**
   * 히스토리 가져오기 처리
   */
  const handleImportHistory = useCallback((event) => {
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
    event.target.value = '';
  }, []);

  /**
   * 초기 이미지 생성 처리
   */
  const handleInitialGeneration = useCallback(async () => {
    if (!state.prompt) return;

    setState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      if (USE_DUMMY_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setState(prev => ({
          ...prev,
          initialImage: DUMMY_IMAGES.INITIAL,
          finalImage: ""
        }));
      } else {
        const imageData = await generateInitialImage(state.prompt);
        setState(prev => ({
          ...prev,
          initialImage: `data:image/png;base64,${imageData}`,
          finalImage: ""
        }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.prompt]);

  /**
   * 최종 이미지 변환 처리
   */
  const handleFinalGeneration = useCallback(async () => {
    if (!state.initialImage) return;

    setState(prev => ({ ...prev, loading: true, error: "" }));

    try {
      if (USE_DUMMY_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const finalImageData = DUMMY_IMAGES.FINAL;
        setState(prev => ({ ...prev, finalImage: finalImageData }));

        const newHistoryItem = {
          id: Date.now(),
          prompt: state.prompt,
          initialImage: state.initialImage,
          finalImage: finalImageData,
          model: state.selectedModel,
          timestamp: new Date().toLocaleString()
        };
        setHistory(prev => [newHistoryItem, ...prev]);
      } else {
        const imageData = await generateFinalImage(state.initialImage, state.selectedModel);
        const finalImageData = `data:image/png;base64,${imageData}`;
        setState(prev => ({ ...prev, finalImage: finalImageData }));

        const newHistoryItem = {
          id: Date.now(),
          prompt: state.prompt,
          initialImage: state.initialImage,
          finalImage: finalImageData,
          model: state.selectedModel,
          timestamp: new Date().toLocaleString()
        };
        setHistory(prev => [newHistoryItem, ...prev]);
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.initialImage, state.selectedModel, state.prompt]);

  /**
   * 이미지 재생성 처리
   */
  const handleRegenerate = useCallback(() => {
    if (state.finalImage) {
      handleFinalGeneration();
    } else {
      handleInitialGeneration();
    }
  }, [state.finalImage, handleFinalGeneration, handleInitialGeneration]);

  /**
   * 모든 입력 초기화 처리
   */
  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      prompt: "",
      initialImage: "",
      finalImage: "",
      error: ""
    }));
  }, []);

  /**
   * 모델 변경 처리
   */
  const handleModelChange = useCallback((model) => {
    setState(prev => ({ ...prev, selectedModel: model }));
  }, []);

  // 렌더링 메서드들
  /**
   * 프롬프트 표시 영역 렌더링
   */
  const renderPromptDisplay = useMemo(() => (
    state.prompt && (
      <PromptDisplay>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "bold" }}>prompt:</span>
          <span>{state.prompt}</span>
        </div>
      </PromptDisplay>
    )
  ), [state.prompt]);

  /**
   * 히스토리 항목들 렌더링
   */
  const renderHistoryItems = useMemo(() => (
    history.map(item => (
      <HistoryItemComponent
        key={item.id}
        item={item}
        onRestore={handleRestoreHistory}
        onDelete={handleDeleteHistory}
      />
    ))
  ), [history, handleRestoreHistory, handleDeleteHistory]);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Container>
        <ThemeToggle
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? '🌞' : '🌙'}
        </ThemeToggle>
        <MainContent>
          {renderPromptDisplay}
          <ContentArea>
            <ImageControlArea>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInitialGeneration();
                }}
                aria-label="Image generation form"
              >
                <Input
                  type="text"
                  value={state.prompt}
                  onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="텍스트 프롬프트를 입력하세요 (예: yellow T-shirt)"
                  disabled={state.loading}
                  aria-required="true"
                />
                <Button
                  type="submit"
                  disabled={isGenerateDisabled}
                  aria-label="Generate initial image"
                >
                  생성
                </Button>
              </Form>

              {/* Image display logic */}
              {state.initialImage && !state.finalImage && (
                <ImageContainer>
                  {state.loading && (
                    <LoadingOverlay>
                      <MemoizedLoadingSpinner />
                    </LoadingOverlay>
                  )}
                  <MemoizedImageMagnifier
                    imageUrl={state.initialImage}
                    alt="Initial"
                  />
                </ImageContainer>
              )}

              {state.loading && !state.initialImage && (
                <ImageContainer>
                  <MemoizedLoadingSpinner />
                </ImageContainer>
              )}

              {state.finalImage && (
                <ImageContainer>
                  {state.loading && (
                    <LoadingOverlay>
                      <MemoizedLoadingSpinner />
                    </LoadingOverlay>
                  )}
                  <MemoizedImageMagnifier
                    imageUrl={state.finalImage}
                    alt="Transformed"
                  />
                </ImageContainer>
              )}

              {/* Button controls */}
              {state.initialImage && (
                <ButtonGroup role="group" aria-label="Image control buttons">
                  <Button
                    onClick={handleRegenerate}
                    disabled={state.loading}
                    aria-label="Regenerate image"
                  >
                    regenerate
                  </Button>
                  <Button
                    onClick={handleReset}
                    disabled={state.loading}
                    aria-label="Reset all inputs"
                  >
                    reset
                  </Button>
                  {!state.finalImage ? (
                    <Button
                      onClick={handleFinalGeneration}
                      disabled={state.loading}
                      aria-label="Transform image style"
                    >
                      style transform
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => {
                        const byteCharacters = atob(state.finalImage.split(',')[1]);
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
                      aria-label="Download transformed image"
                    >
                      download
                    </Button>
                  )}
                </ButtonGroup>
              )}
            </ImageControlArea>

            {canShowModelSelect && (
              <ModelSelectComponent
                selectedModel={state.selectedModel}
                onModelChange={handleModelChange}
              />
            )}
          </ContentArea>

          {state.error && (
            <ErrorMessage>
              <p>{state.error}</p>
            </ErrorMessage>
          )}
        </MainContent>

        <HistoryButton showSidebar={showSidebar}>
          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            aria-expanded={showSidebar}
            aria-controls="history-sidebar"
            aria-label={showSidebar ? "Hide history sidebar" : "Show history sidebar"}
          >
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
          role="complementary"
          aria-label="Generation history"
          id="history-sidebar"
        >
          <SidebarHeader>
            <h3 style={{ margin: 0 }}>Generation History</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {history.length > 0 && (
                <>
                  <Button
                    variant="success"
                    onClick={handleExportHistory}
                    aria-label="Export history"
                  >
                    Export
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleClearHistory}
                    aria-label="Clear all history"
                  >
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
                aria-label="Import history from file"
              />
              <Button
                onClick={() => document.getElementById('history-import').click()}
                aria-label="Import history"
              >
                Import
              </Button>
            </div>
          </SidebarHeader>

          <HistoryList role="list" aria-label="History items">
            {renderHistoryItems}
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
    </ThemeProvider>
  );
};

export default ImageGenerator;
