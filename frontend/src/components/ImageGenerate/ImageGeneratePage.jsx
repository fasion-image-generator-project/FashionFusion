import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModelSelector from './components/ModelSelector';
import PromptInput from './components/PromptInput';
import History from './components/History';
import Presets from './components/Presets';
import ImagePreview from './components/ImagePreview';
import LoadingOverlay from './components/common/LoadingOverlay';
import { imageService } from '../../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: ${props => props.theme.backgroundLight};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const GeneratedImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${props => props.theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(231, 76, 60, 0.1);
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const ImageGeneratePage = () => {
    const [state, setState] = useState({
        prompt: '',
        promptError: null,
        selectedModel: 'Stable Diffusion 1.5',
        initialImage: null,
        finalImage: null,
        loading: false,
        error: null,
        history: [],
        previewImage: null,
        showPreview: false,
        isApiAvailable: true
    });

    useEffect(() => {
        checkApiHealth();
    }, []);

    const checkApiHealth = async () => {
        try {
            await imageService.checkHealth();
            setState(prev => ({ ...prev, isApiAvailable: true }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isApiAvailable: false,
                error: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
            }));
        }
    };

    const handlePromptChange = (e) => {
        const value = e.target.value;
        setState(prev => ({
            ...prev,
            prompt: value,
            promptError: value.length > 500 ? '프롬프트는 500자를 초과할 수 없습니다.' : null
        }));
    };

    const handleModelSelect = (model) => {
        setState(prev => ({ ...prev, selectedModel: model }));
    };

    const handleGenerateImage = async () => {
        if (!state.prompt.trim()) {
            setState(prev => ({ ...prev, promptError: '프롬프트를 입력해주세요.' }));
            return;
        }

        if (!state.isApiAvailable) {
            setState(prev => ({
                ...prev,
                error: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const data = await imageService.generateImage(state.prompt, state.selectedModel);

            setState(prev => ({
                ...prev,
                initialImage: data.image,
                loading: false,
                history: [{
                    prompt: state.prompt,
                    model: state.selectedModel,
                    image: data.image,
                    timestamp: new Date().toISOString()
                }, ...prev.history].slice(0, 10)
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    };

    const handleTransformImage = async () => {
        if (!state.initialImage) return;

        if (!state.isApiAvailable) {
            setState(prev => ({
                ...prev,
                error: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const data = await imageService.transformImage(state.initialImage, state.selectedModel);

            setState(prev => ({
                ...prev,
                finalImage: data.image,
                loading: false,
                history: [{
                    prompt: state.prompt,
                    model: state.selectedModel,
                    image: data.image,
                    timestamp: new Date().toISOString()
                }, ...prev.history].slice(0, 10)
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    };

    const handlePreviewImage = (image) => {
        setState(prev => ({
            ...prev,
            previewImage: image,
            showPreview: true
        }));
    };

    const handleClosePreview = () => {
        setState(prev => ({
            ...prev,
            showPreview: false
        }));
    };

    const handleClearHistory = () => {
        setState(prev => ({
            ...prev,
            history: []
        }));
    };

    return (
        <Container>
            <MainContent>
                <LeftColumn>
                    <ModelSelector
                        selectedModel={state.selectedModel}
                        onModelSelect={handleModelSelect}
                    />
                    <PromptInput
                        prompt={state.prompt}
                        error={state.promptError}
                        onChange={handlePromptChange}
                    />
                    <Presets
                        onSelect={(preset) => {
                            handleModelSelect(preset.model);
                            handlePromptChange({ target: { value: preset.prompt } });
                        }}
                    />
                </LeftColumn>
                <RightColumn>
                    <ImageContainer>
                        {state.loading ? (
                            <LoadingOverlay />
                        ) : state.initialImage ? (
                            <GeneratedImage
                                src={state.initialImage}
                                alt="Generated"
                                onClick={() => handlePreviewImage(state.initialImage)}
                            />
                        ) : (
                            <div>이미지를 생성해주세요</div>
                        )}
                    </ImageContainer>
                    <ButtonContainer>
                        <Button
                            onClick={handleGenerateImage}
                            disabled={state.loading || !state.prompt.trim() || !state.isApiAvailable}
                        >
                            이미지 생성
                        </Button>
                        <Button
                            onClick={handleTransformImage}
                            disabled={state.loading || !state.initialImage || !state.isApiAvailable}
                        >
                            이미지 변환
                        </Button>
                    </ButtonContainer>
                    {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
                </RightColumn>
            </MainContent>
            <History
                history={state.history}
                onClear={handleClearHistory}
                onImageClick={handlePreviewImage}
            />
            <ImagePreview
                image={state.previewImage}
                isOpen={state.showPreview}
                onClose={handleClosePreview}
            />
        </Container>
    );
};

export default ImageGeneratePage; 