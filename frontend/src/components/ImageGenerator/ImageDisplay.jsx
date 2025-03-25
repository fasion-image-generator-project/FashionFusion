import React from 'react';
import styled from 'styled-components';
import ImageMagnifier from '../common/ImageMagnifier';

const ImageDisplayContainer = styled.div`
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

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const ImageCard = styled.div`
  position: relative;
  background: ${props => props.theme.background};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${props => props.theme.shadow};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: ${props => props.theme.background};
  overflow: hidden;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ImageInfo = styled.div`
  padding: 16px;
  background: ${props => props.theme.surface};
`;

const ImageTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: ${props => props.theme.text};
  font-weight: 600;
`;

const ImageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  backdrop-filter: blur(4px);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.border};
  border-top-color: ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.theme.border};
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 16px;
`;

const ImageDisplay = ({
    images,
    loading,
    selectedImage,
    onImageClick,
    onImageDelete
}) => {
    if (!images.length) {
        return (
            <ImageDisplayContainer>
                <Title>생성된 이미지</Title>
                <EmptyState>
                    <EmptyStateIcon>🎨</EmptyStateIcon>
                    <EmptyStateText>아직 생성된 이미지가 없습니다.</EmptyStateText>
                </EmptyState>
            </ImageDisplayContainer>
        );
    }

    return (
        <ImageDisplayContainer>
            <Title>생성된 이미지</Title>
            <ImageGrid>
                {images.map((image) => (
                    <ImageCard key={image.id}>
                        <ImageWrapper>
                            <StyledImage
                                src={image.url}
                                alt={image.prompt}
                                onClick={() => onImageClick(image)}
                            />
                            {loading && image.id === selectedImage?.id && (
                                <LoadingOverlay>
                                    <LoadingSpinner />
                                </LoadingOverlay>
                            )}
                        </ImageWrapper>
                        <ImageInfo>
                            <ImageTitle>{image.prompt}</ImageTitle>
                            <ImageMeta>
                                <MetaItem>
                                    <span>모델:</span>
                                    <span>{image.model}</span>
                                </MetaItem>
                                <MetaItem>
                                    <span>생성일:</span>
                                    <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                                </MetaItem>
                            </ImageMeta>
                        </ImageInfo>
                    </ImageCard>
                ))}
            </ImageGrid>
        </ImageDisplayContainer>
    );
};

export default ImageDisplay; 