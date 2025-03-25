import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 8px;
  cursor: help;

  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipIcon = styled.div.attrs({
    role: 'img',
    'aria-label': 'Help'
})`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.theme.textSecondary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
  }
`;

const TooltipText = styled.div.attrs(props => ({
    role: 'tooltip',
    'aria-hidden': 'false'
}))`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${props => props.theme.tooltipBackground || props.theme.backgroundSecondary};
  color: ${props => props.theme.text};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  width: 250px;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent ${props => props.theme.tooltipBackground || props.theme.backgroundSecondary} transparent transparent;
  }
`;

const Tooltip = ({ text, children }) => (
    <TooltipContainer>
        <TooltipIcon>?</TooltipIcon>
        <TooltipText>{text}</TooltipText>
        {children}
    </TooltipContainer>
);

export default Tooltip; 