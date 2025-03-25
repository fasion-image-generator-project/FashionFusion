import styled from 'styled-components';

const StyledButton = styled.button.attrs(props => ({
    'aria-disabled': props.disabled,
    role: 'button',
}))`
  padding: 12px 24px;
  background-color: ${props => {
        if (props.variant === 'success') return props.theme.success;
        if (props.variant === 'danger') return props.theme.danger;
        return props.theme.primary;
    }};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  font-size: 1rem;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }
`;

const Button = ({ children, variant, disabled, onClick, type = 'button', ...props }) => {
    return (
        <StyledButton
            variant={variant}
            disabled={disabled}
            onClick={onClick}
            type={type}
            {...props}
        >
            {children}
        </StyledButton>
    );
};

export default Button; 