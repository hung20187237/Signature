import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    color: ${props => props.theme.colors.textPrimary};
    background-color: ${props => props.theme.colors.bgPrimary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray100};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray400};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.gray500};
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Remove default link styles */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Remove default button styles */
  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Hide scrollbar for horizontal scroll containers */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

export default GlobalStyles;
