import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import LoadingSpinner from '../common/LoadingSpinner';

const ImageContainer = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.surface};
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
  backdrop-filter: blur(4px);
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: 400px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
`;

const MagnifierLens = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid ${props => props.theme.primary};
  border-radius: 8px;
  pointer-events: none;
  overflow: hidden;
  background-color: white;
  z-index: 100;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const MagnifiedImage = styled.img`
  position: absolute;
  max-width: none;
  object-fit: contain;
`;

const ImageDisplay = ({ imageUrl, alt, loading }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!imgRef.current) return;

        const { top, left, width, height } = imgRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (x < 0 || x > width || y < 0 || y > height) {
            setShowMagnifier(false);
            return;
        }

        setMagnifierPosition({
            x: Math.max(0, Math.min(x, width)),
            y: Math.max(0, Math.min(y, height))
        });
    };

    const handleMouseEnter = () => setShowMagnifier(true);
    const handleMouseLeave = () => setShowMagnifier(false);

    if (!imageUrl && !loading) {
        return (
            <ImageContainer>
                <div style={{
                    color: props => props.theme.textSecondary,
                    textAlign: 'center'
                }}>
                    No image generated yet
                </div>
            </ImageContainer>
        );
    }

    return (
        <ImageContainer>
            {loading && (
                <LoadingOverlay>
                    <LoadingSpinner />
                </LoadingOverlay>
            )}
            {imageUrl && (
                <ImageWrapper
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <StyledImage
                        ref={imgRef}
                        src={imageUrl}
                        alt={alt}
                        loading="lazy"
                    />
                    <MagnifierLens
                        show={showMagnifier}
                        style={{
                            left: `${magnifierPosition.x - 100}px`,
                            top: `${magnifierPosition.y - 100}px`
                        }}
                    >
                        <MagnifiedImage
                            src={imageUrl}
                            alt={alt}
                            style={{
                                height: '1000px',
                                left: `${-magnifierPosition.x * 2.5 + 100}px`,
                                top: `${-magnifierPosition.y * 2.5 + 100}px`
                            }}
                        />
                    </MagnifierLens>
                </ImageWrapper>
            )}
        </ImageContainer>
    );
};

export default React.memo(ImageDisplay); 