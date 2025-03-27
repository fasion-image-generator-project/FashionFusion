import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const SliderContainer = styled.div`
  width: 100%;
  padding: 0 20px;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  background: #ddd;
  border-radius: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const FrameInfo = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #666;
`;

const ImageSlider = ({
    totalFrames = 721,
    framePrefix = 'frame',
    frameDirectory = '/frames',
    onFrameChange,
    showControls = true,
    autoPlay = false,
    fps = 30
}) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const updateImageUrl = (frame) => {
            setImageUrl(`${frameDirectory}/${framePrefix}${frame.toString().padStart(4, '0')}.png`);
        };

        updateImageUrl(currentFrame);
    }, [currentFrame, framePrefix, frameDirectory]);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentFrame((prev) => {
                    if (prev >= totalFrames - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000 / fps);
        }
        return () => clearInterval(interval);
    }, [isPlaying, totalFrames, fps]);

    useEffect(() => {
        if (onFrameChange) {
            onFrameChange(currentFrame);
        }
    }, [currentFrame, onFrameChange]);

    const handleSliderChange = (e) => {
        const newFrame = parseInt(e.target.value);
        setCurrentFrame(newFrame);
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setCurrentFrame(0);
        setIsPlaying(false);
    };

    return (
        <Container>
            <ImageContainer>
                <Image src={imageUrl} alt={`Frame ${currentFrame}`} />
            </ImageContainer>
            <SliderContainer>
                <Slider
                    type="range"
                    min="0"
                    max={totalFrames - 1}
                    value={currentFrame}
                    onChange={handleSliderChange}
                />
                <FrameInfo>
                    프레임: {currentFrame} / {totalFrames - 1}
                </FrameInfo>
            </SliderContainer>
            {showControls && (
                <Controls>
                    <Button onClick={handlePlayPause}>
                        {isPlaying ? '일시정지' : '재생'}
                    </Button>
                    <Button onClick={handleReset}>처음으로</Button>
                </Controls>
            )}
        </Container>
    );
};

export default ImageSlider; 