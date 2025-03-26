import React from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const TestPage = () => {
    return (
        <Container>
            <Content>
                <Title>이미지 슬라이더 테스트</Title>
                <ImageSlider
                    totalFrames={721}
                    framePrefix="frame"
                    frameDirectory="/frames"
                    showControls={true}
                    autoPlay={false}
                    fps={30}
                />
            </Content>
        </Container>
    );
};

export default TestPage; 