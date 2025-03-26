import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ImageGeneratepage from './components/ImageGeneratepage';
import TestPage from './components/TestPage';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
`;

const NavLink = styled(Link)`
  padding: 8px 16px;
  background-color: white;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-1px);
  }
`;

function App() {
  return (
    <Router>
      <Nav>
        <NavLink to="/">메인 페이지</NavLink>
        <NavLink to="/test">테스트 페이지</NavLink>
      </Nav>
      <Routes>
        <Route path="/" element={<ImageGeneratepage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App; 