export const lightTheme = {
  primary: '#007bff',
  success: '#28a745',
  danger: '#dc3545',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  border: '#dddddd',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  spinnerBorder: '#f3f3f3',
  spinnerActive: '#3498db',
  tooltipBackground: '#333333',
  backgroundSecondary: '#e9ecef'
};

export const darkTheme = {
  primary: '#0d6efd',
  success: '#198754',
  danger: '#dc3545',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#333333',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  spinnerBorder: '#333333',
  spinnerActive: '#0d6efd',
  tooltipBackground: '#2d2d2d',
  backgroundSecondary: '#2d2d2d'
};

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};

export const mediaQueries = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`
}; 