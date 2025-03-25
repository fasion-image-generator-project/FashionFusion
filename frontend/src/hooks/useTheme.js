import { useState, useEffect, useCallback } from 'react';

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // 테마 변경 시 body 클래스 업데이트
    document.body.classList.toggle('dark-theme', isDarkMode);
    document.body.classList.toggle('light-theme', !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const setTheme = useCallback((isDark) => {
    setIsDarkMode(isDark);
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  };
};

export default useTheme; 