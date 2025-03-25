import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Spinner = styled.div.attrs({
    'role': 'progressbar',
    'aria-label': 'Loading',
    'aria-busy': 'true'
})`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border: 5px solid ${props => props.theme.spinnerBorder};
  border-top: 5px solid ${props => props.theme.spinnerActive};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner = ({ size, fullscreen }) => {
    if (fullscreen) {
        return (
            <SpinnerWrapper>
                <Spinner size={size} />
            </SpinnerWrapper>
        );
    }

    return <Spinner size={size} />;
};

export default LoadingSpinner; 