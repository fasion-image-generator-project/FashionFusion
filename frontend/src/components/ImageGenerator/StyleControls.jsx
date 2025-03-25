import React from 'react';
import styled from 'styled-components';
import { STYLE_GAN_PRESETS, PARAMETER_DESCRIPTIONS } from '../../constants/presets';
import Tooltip from '../common/Tooltip';

const ControlsContainer = styled.div`
  margin-top: 15px;
  padding: 20px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
`;

const PresetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const PresetButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background-color: ${props => props.active ? `${props.theme.primary}20` : props.theme.surface};
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.theme.primary}20;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px ${props => props.theme.shadow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SavePresetButton = styled(PresetButton)`
  background-color: ${props => props.theme.success};
  color: white;
  border-color: ${props => props.theme.success};
  font-weight: bold;

  &:hover {
    background-color: ${props => props.theme.success};
    filter: brightness(1.1);
  }
`;

const SliderContainer = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SliderLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
`;

const SliderValue = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  font-weight: bold;
`;

const StyledSlider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.border};
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  -webkit-appearance: none;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const StyleControls = ({
    params,
    onParamChange,
    customPresets = {},
    activePreset,
    onPresetClick,
    onSavePreset
}) => {
    return (
        <ControlsContainer>
            <PresetContainer>
                {Object.entries(STYLE_GAN_PRESETS).map(([name, values]) => (
                    <PresetButton
                        key={name}
                        active={activePreset === name}
                        onClick={() => onPresetClick(name, values)}
                        title={values.description}
                    >
                        {name}
                    </PresetButton>
                ))}
                {Object.entries(customPresets).map(([name, values]) => (
                    <PresetButton
                        key={name}
                        active={activePreset === name}
                        onClick={() => onPresetClick(name, values)}
                    >
                        {name}
                    </PresetButton>
                ))}
                <SavePresetButton onClick={onSavePreset}>
                    Save Current
                </SavePresetButton>
            </PresetContainer>

            <SliderContainer>
                <SliderHeader>
                    <SliderLabel>
                        Truncation (Style Variation)
                        <Tooltip text={PARAMETER_DESCRIPTIONS.truncation} />
                    </SliderLabel>
                    <SliderValue>{params.truncation.toFixed(2)}</SliderValue>
                </SliderHeader>
                <StyledSlider
                    min="0.1"
                    max="1.0"
                    step="0.01"
                    value={params.truncation}
                    onChange={(e) => onParamChange('truncation', parseFloat(e.target.value))}
                    aria-label="Style variation control"
                />
            </SliderContainer>

            <SliderContainer>
                <SliderHeader>
                    <SliderLabel>
                        Noise (Detail Level)
                        <Tooltip text={PARAMETER_DESCRIPTIONS.noise} />
                    </SliderLabel>
                    <SliderValue>{params.noise.toFixed(2)}</SliderValue>
                </SliderHeader>
                <StyledSlider
                    min="0.0"
                    max="1.0"
                    step="0.01"
                    value={params.noise}
                    onChange={(e) => onParamChange('noise', parseFloat(e.target.value))}
                    aria-label="Noise level control"
                />
            </SliderContainer>

            <SliderContainer>
                <SliderHeader>
                    <SliderLabel>
                        Strength (Transform Intensity)
                        <Tooltip text={PARAMETER_DESCRIPTIONS.strength} />
                    </SliderLabel>
                    <SliderValue>{params.strength.toFixed(2)}</SliderValue>
                </SliderHeader>
                <StyledSlider
                    min="0.1"
                    max="1.0"
                    step="0.01"
                    value={params.strength}
                    onChange={(e) => onParamChange('strength', parseFloat(e.target.value))}
                    aria-label="Transform strength control"
                />
            </SliderContainer>
        </ControlsContainer>
    );
};

export default React.memo(StyleControls); 