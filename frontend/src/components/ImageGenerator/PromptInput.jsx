import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import Input from '../common/Input';

const Form = styled.form.attrs(props => ({
    'aria-label': 'Image generation form',
}))`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const PromptDisplay = styled.div`
  width: 100%;
  background-color: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px ${props => props.theme.shadow};
  margin: 0 auto 20px;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PromptText = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  span:first-child {
    font-weight: bold;
    color: ${props => props.theme.textSecondary};
  }

  span:last-child {
    color: ${props => props.theme.text};
  }
`;

const SuggestionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const SuggestionTag = styled.button`
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primary}20;
    border-color: ${props => props.theme.primary};
    transform: translateY(-1px);
  }
`;

// 예시 프롬프트 제안
const PROMPT_SUGGESTIONS = [
    "yellow T-shirt",
    "blue jeans",
    "red dress",
    "black leather jacket",
    "white sneakers",
    "floral pattern dress",
    "striped shirt",
    "denim jacket"
];

const PromptInput = ({
    prompt,
    onPromptChange,
    onSubmit,
    disabled,
    showPromptDisplay = true
}) => {
    const handleSuggestionClick = (suggestion) => {
        onPromptChange(suggestion);
    };

    return (
        <>
            {showPromptDisplay && prompt && (
                <PromptDisplay>
                    <PromptText>
                        <span>prompt:</span>
                        <span>{prompt}</span>
                    </PromptText>
                </PromptDisplay>
            )}

            <Form onSubmit={onSubmit}>
                <Input
                    type="text"
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder="텍스트 프롬프트를 입력하세요 (예: yellow T-shirt)"
                    disabled={disabled}
                    required
                    fullWidth
                    aria-label="Text prompt input"
                />
                <Button
                    type="submit"
                    disabled={disabled || !prompt}
                    aria-label="Generate image"
                >
                    생성
                </Button>
            </Form>

            {!prompt && (
                <SuggestionList>
                    {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                        <SuggestionTag
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            type="button"
                        >
                            {suggestion}
                        </SuggestionTag>
                    ))}
                </SuggestionList>
            )}
        </>
    );
};

export default React.memo(PromptInput); 