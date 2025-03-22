import React, { useState } from 'react';
import { generateFinalDesignAPI } from '../api/design';

function DesignGenerator() {
  // 상태 변수 정의
  const [inputText, setInputText] = useState("");
  const [initialImage, setInitialImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [selectedModel, setSelectedModel] = useState("Cycle GAN");
  const [currentStep, setCurrentStep] = useState("initial"); // "initial" 또는 "final"
  const [loading, setLoading] = useState(false);

  /*
  // 목 API 함수: 초기 디자인 생성
  const generateInitialDesign = async () => {
    setLoading(true);
    // 실제 API 호출 대신 목 데이터를 반환하는 예시 (네트워크 지연 모방)
    setTimeout(() => {
      setInitialImage("https://via.placeholder.com/300?text=Initial+Design");
      setLoading(false);
    }, 1500);
  };
  */

  // 기존 목 함수 대신 실제 API 호출
  const generateInitialDesign = async () => {
    setLoading(true);
    try {
        const response = await generateInitialDesignAPI({ text: inputText });
        setInitialImage(response.data.imageUrl); // 응답에 따른 이미지 URL 처리
    } catch (error) {
        console.error("API 호출 오류:", error);
        // 에러 메시지 등 사용자 피드백 로직 추가
    } finally {
        setLoading(false);
    }
  }
  /*
  // 목 API 함수: 최종 디자인 생성
  const generateFinalDesign = async () => {
    setLoading(true);
    setTimeout(() => {
      setFinalImage("https://via.placeholder.com/300?text=Final+Design");
      setLoading(false);
    }, 1500);
  };
  */

  // 최종 디자인 생성 함수: 실제 API 호출을 통해 결과를 받아옴
  const generateFinalDesign = async () => {
    // 초기 디자인 이미지가 존재하는지 확인
    if (!initialImage) {
        console.error("초기 디자인 이미지가 없습니다. 먼저 초기 디자인을 생성하세요.");
        return;
    }
    setLoading(true);
    try {
        // 초기 이미지와 선택된 모델 정보를 함께 전송
        const response = await generateFinalDesignAPI({
            image: initialImage, // 이미지 URL이나 필요한 이미지 데이터 형식
            model: selectedModel, // 예: "Cycle GAN - turbo", "Cycle GAN", "Style GAN"
        });
        // 응답에서 최종 디자인 이미지 URL을 추출하여 상태를 업데이트
        setFinalImage(response.data.imageUrl);
    } catch (error) {
        console.error("최종 디자인 생성 API 호출 오류:", error);
        // 추가적으로 사용자에게 에러 메시지를 표시하는 로직을 넣을 수 있음
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {currentStep === "initial" && (
        <div>
          <h2>초기 디자인 생성</h2>
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="예: yellow T-shirt"
            style={{ width: '300px', padding: '8px' }}
          />
          <button onClick={generateInitialDesign} style={{ marginLeft: '10px', padding: '8px 12px' }}>
            디자인 생성
          </button>
          {loading && <p>생성 중...</p>}
          {initialImage && (
            <div style={{ marginTop: '20px' }}>
              <img src={initialImage} alt="Initial Design" style={{ width: '300px' }} />
              <div style={{ marginTop: '10px' }}>
                <button onClick={generateInitialDesign} style={{ padding: '8px 12px', marginRight: '10px' }}>
                  재생성
                </button>
                <button onClick={() => setCurrentStep("final")} style={{ padding: '8px 12px' }}>
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === "final" && (
        <div>
          <h2>최종 디자인 생성</h2>
          <p>모델 선택:</p>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px' }}
          >
            <option value="Cycle GAN - turbo">Cycle GAN - turbo</option>
            <option value="Cycle GAN">Cycle GAN</option>
            <option value="Style GAN">Style GAN</option>
          </select>
          <br />
          <button onClick={generateFinalDesign} style={{ padding: '8px 12px' }}>
            최종 디자인 생성
          </button>
          {loading && <p>생성 중...</p>}
          {finalImage && (
            <div style={{ marginTop: '20px' }}>
              <img src={finalImage} alt="Final Design" style={{ width: '300px' }} />
              <div style={{ marginTop: '10px' }}>
                <button onClick={generateFinalDesign} style={{ padding: '8px 12px', marginRight: '10px' }}>
                  재생성
                </button>
                <a 
                  href={finalImage} 
                  download="final_design.png"
                  style={{ padding: '8px 12px', backgroundColor: '#ddd', textDecoration: 'none' }}
                >
                  다운로드
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DesignGenerator;
