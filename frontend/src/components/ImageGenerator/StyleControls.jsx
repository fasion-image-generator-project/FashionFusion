import React from 'react';
import styled from 'styled-components';
import { DEFAULT_STYLE_GAN_PARAMS } from '../../constants/styleGan';

const StyleControlsContainer = styled.div`
  background-color: ${props => props.theme.surface};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
`;

const ControlGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ControlLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: ${props => props.theme.border};
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: ${props => props.theme.primary};
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${props => props.theme.primary};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const ValueDisplay = styled.div`
  min-width: 40px;
  text-align: right;
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
`;

const PresetSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.border};
`;

const PresetTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 16px;
  color: ${props => props.theme.text};
  font-weight: 600;
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const PresetButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${props => props.isActive ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  background: ${props => props.isActive ? `${props.theme.primary}10` : props.theme.surface};
  color: ${props => props.isActive ? props.theme.primary : props.theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
`;

const SavePresetButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px dashed ${props => props.theme.border};
  border-radius: 8px;
  background: transparent;
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;

  &:hover {
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};
  }
`;

const StyleControls = ({
    params,
    onParamChange,
    customPresets,
    activePreset,
    onPresetClick,
    onSavePreset
}) => {
    return (
        <StyleControlsContainer>
            <Title>스타일 조정</Title>

            <ControlGroup>
                <ControlLabel>스타일 강도</ControlLabel>
                <SliderContainer>
                    <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.styleStrength}
                        onChange={(e) => onParamChange('styleStrength', parseFloat(e.target.value))}
                    />
                    <ValueDisplay>{(params.styleStrength * 100).toFixed(0)}%</ValueDisplay>
                </SliderContainer>
            </ControlGroup>

            <ControlGroup>
                <ControlLabel>색상 보존</ControlLabel>
                <SliderContainer>
                    <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.colorPreservation}
                        onChange={(e) => onParamChange('colorPreservation', parseFloat(e.target.value))}
                    />
                    <ValueDisplay>{(params.colorPreservation * 100).toFixed(0)}%</ValueDisplay>
                </SliderContainer>
            </ControlGroup>

            <ControlGroup>
                <ControlLabel>구조 보존</ControlLabel>
                <SliderContainer>
                    <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.structurePreservation}
                        onChange={(e) => onParamChange('structurePreservation', parseFloat(e.target.value))}
                    />
                    <ValueDisplay>{(params.structurePreservation * 100).toFixed(0)}%</ValueDisplay>
                </SliderContainer>
            </ControlGroup>

            <PresetSection>
                <PresetTitle>프리셋</PresetTitle>
                <PresetGrid>
                    {Object.entries(DEFAULT_STYLE_GAN_PARAMS).map(([name, preset]) => (
                        <PresetButton
                            key={name}
                            isActive={activePreset === name}
                            onClick={() => onPresetClick(name)}
                        >
                            {name}
                        </PresetButton>
                    ))}
                    {Object.entries(customPresets).map(([name, preset]) => (
                        <PresetButton
                            key={name}
                            isActive={activePreset === name}
                            onClick={() => onPresetClick(name)}
                        >
                            {name}
                        </PresetButton>
                    ))}
                </PresetGrid>
                <SavePresetButton onClick={onSavePreset}>
                    현재 설정 저장
                </SavePresetButton>
            </PresetSection>
        </StyleControlsContainer>
    );
};

export default StyleControls; 