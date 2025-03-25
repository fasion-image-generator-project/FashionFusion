export const INITIAL_MODEL_OPTIONS = [
  {
    id: "Stable Diffusion 1.5",
    name: "Stable Diffusion 1.5",
    label: "Stable Diffusion 1.5",
    description: "안정적이고 빠른 이미지 생성이 가능한 기본 모델",
    features: ["빠른 생성 속도", "안정적인 결과물", "다양한 스타일 지원"]
  },
  {
    id: "Stable Diffusion 3.5",
    name: "Stable Diffusion 3.5",
    label: "Stable Diffusion 3.5",
    description: "더 높은 품질의 이미지를 생성할 수 있는 고급 모델",
    features: ["고품질 이미지", "세밀한 디테일", "향상된 구도"]
  }
];

export const FINAL_MODEL_OPTIONS = [
  {
    id: "Disco GAN",
    name: "Disco GAN",
    label: "Disco GAN",
    description: "스타일 전이에 특화된 GAN 모델",
    features: ["빠른 스타일 전이", "다양한 스타일", "안정적인 결과물"]
  },
  {
    id: "Style GAN-ada",
    name: "Style GAN-ada",
    label: "Style GAN-ada",
    description: "세밀한 스타일 조정이 가능한 고급 GAN 모델",
    features: ["상세한 파라미터 조정", "고품질 변환", "적응형 스타일 전이"]
  }
];

export const MODEL_INFO = {
  "Stable Diffusion 1.5": {
    icon: "🎨",
    description: "안정적이고 빠른 이미지 생성이 가능한 기본 모델",
    features: ["빠른 생성 속도", "안정적인 결과물", "다양한 스타일 지원"],
    pros: ["빠른 처리 속도", "안정적인 결과", "적은 리소스 사용"],
    cons: ["제한된 이미지 품질", "기본적인 스타일만 지원"]
  },
  "Stable Diffusion 3.5": {
    icon: "🖼️",
    description: "더 높은 품질의 이미지를 생성할 수 있는 고급 모델",
    features: ["고품질 이미지", "세밀한 디테일", "향상된 구도"],
    pros: ["뛰어난 이미지 품질", "세밀한 디테일 표현", "다양한 스타일 지원"],
    cons: ["느린 처리 속도", "높은 리소스 사용"]
  },
  "Disco GAN": {
    icon: "💫",
    description: "스타일 전이에 특화된 GAN 모델",
    features: ["빠른 스타일 전이", "다양한 스타일", "안정적인 결과물"],
    pros: ["빠른 스타일 전이", "안정적인 결과", "다양한 스타일 지원"],
    cons: ["제한된 커스터마이징", "기본적인 스타일만 지원"]
  },
  "Style GAN-ada": {
    icon: "✨",
    description: "세밀한 스타일 조정이 가능한 고급 GAN 모델",
    features: ["상세한 파라미터 조정", "고품질 변환", "적응형 스타일 전이"],
    pros: ["세밀한 스타일 조정", "고품질 결과물", "다양한 커스터마이징"],
    cons: ["복잡한 파라미터 설정", "느린 처리 속도"]
  }
}; 