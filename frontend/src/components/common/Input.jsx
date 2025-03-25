import styled from 'styled-components';

const StyledInput = styled.input.attrs(props => ({
    'aria-label': props['aria-label'] || 'Text input',
    'aria-disabled': props.disabled,
    'aria-required': props.required,
}))`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.border};
  font-size: 1rem;
  background-color: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }

  &:disabled {
    background-color: ${props => props.theme.background};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Input = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled,
    required,
    fullWidth,
    ...props
}) => {
    return (
        <StyledInput
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            fullWidth={fullWidth}
            {...props}
        />
    );
};

export default Input; 