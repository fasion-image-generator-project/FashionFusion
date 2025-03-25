export const STYLE_GAN_PRESETS = {
  Natural: {
    truncation: 0.7,
    noise: 0.3,
    strength: 0.6,
    description: "자연스러운 스타일 변환을 위한 기본 설정"
  },
  Artistic: {
    truncation: 0.9,
    noise: 0.7,
    strength: 0.8,
    description: "예술적이고 창의적인 스타일 변환을 위한 설정"
  },
  Bold: {
    truncation: 1.0,
    noise: 0.8,
    strength: 1.0,
    description: "강렬하고 대담한 스타일 변환을 위한 설정"
  },
  Subtle: {
    truncation: 0.5,
    noise: 0.2,
    strength: 0.4,
    description: "미묘하고 섬세한 스타일 변환을 위한 설정"
  }
};

export const PARAMETER_DESCRIPTIONS = {
  truncation: "스타일의 다양성을 조절합니다. 높은 값(1.0)은 더 독특하고 창의적인 결과를, 낮은 값(0.1)은 더 안정적이고 일관된 결과를 생성합니다.",
  noise: "이미지의 세부 디테일 수준을 조절합니다. 높은 값은 더 많은 텍스처와 디테일을, 낮은 값은 더 부드럽고 깔끔한 결과를 만듭니다.",
  strength: "변환의 강도를 조절합니다. 높은 값은 원본 이미지를 크게 변형하고, 낮은 값은 미묘한 변화만을 적용합니다."
};

export const DEFAULT_STYLE_GAN_PARAMS = {
  truncation: 0.7,
  noise: 0.5,
  strength: 0.8
}; 