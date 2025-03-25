import React from 'react';
import styled from 'styled-components';
import { MODEL_INFO } from '../../constants/models';

const ModelSelectContainer = styled.div`
  background-color: ${props => props.theme.surface};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 24px;
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

const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const ModelCard = styled.label`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 2px solid ${props => props.isSelected ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? `${props.theme.primary}10` : props.theme.surface};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.isSelected ? props.theme.primary : 'transparent'};
    transition: all 0.2s ease;
  }
`;

const ModelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ModelIcon = styled.div`
  font-size: 28px;
  color: ${props => props.theme.primary};
`;

const ModelTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const ModelDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ModelFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FeatureTag = styled.span`
  padding: 4px 12px;
  border-radius: 16px;
  background-color: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  font-size: 12px;
  font-weight: 500;
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const ModelSelect = ({
    options,
    selectedModel,
    onModelChange,
    title = "Select Model"
}) => {
    return (
        <ModelSelectContainer>
            <Title>{title}</Title>
            <ModelGrid role="radiogroup" aria-label={title}>
                {options.map((option) => {
                    const modelInfo = MODEL_INFO[option.id];
                    const isSelected = selectedModel === option.id;

                    return (
                        <ModelCard
                            key={option.id}
                            isSelected={isSelected}
                            htmlFor={`model-${option.id}`}
                        >
                            <RadioInput
                                type="radio"
                                id={`model-${option.id}`}
                                name="model"
                                value={option.id}
                                checked={isSelected}
                                onChange={(e) => onModelChange(e.target.value)}
                            />
                            <ModelHeader>
                                <ModelIcon>{modelInfo.icon}</ModelIcon>
                                <ModelTitle>{option.label}</ModelTitle>
                            </ModelHeader>
                            <ModelDescription>{modelInfo.description}</ModelDescription>
                            <ModelFeatures>
                                {modelInfo.features.map((feature, index) => (
                                    <FeatureTag key={index}>{feature}</FeatureTag>
                                ))}
                            </ModelFeatures>
                        </ModelCard>
                    );
                })}
            </ModelGrid>
        </ModelSelectContainer>
    );
};

export default React.memo(ModelSelect); 