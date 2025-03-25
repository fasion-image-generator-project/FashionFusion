import { useState, useCallback, useEffect } from 'react';

const useHistory = () => {
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('imageGenerationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('imageGenerationHistory', JSON.stringify(history));
  }, [history]);

  const addHistoryItem = useCallback((item) => {
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      ...item
    };
    setHistory(prev => [newItem, ...prev]);
  }, []);

  const deleteHistoryItem = useCallback((id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      setHistory([]);
    }
  }, []);

  const exportHistory = useCallback(() => {
    const historyData = JSON.stringify(history, null, 2);
    const blob = new Blob([historyData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fashion-fusion-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [history]);

  const importHistory = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedHistory = JSON.parse(e.target.result);
          if (Array.isArray(importedHistory)) {
            if (window.confirm('기존 히스토리에 추가하시겠습니까? "취소"를 선택하면 기존 히스토리를 대체합니다.')) {
              setHistory(prev => [...prev, ...importedHistory]);
            } else {
              setHistory(importedHistory);
            }
            resolve();
          } else {
            reject(new Error('Invalid history format'));
          }
        } catch (err) {
          reject(new Error('Failed to parse history file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read history file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    history,
    addHistoryItem,
    deleteHistoryItem,
    clearHistory,
    exportHistory,
    importHistory
  };
};

export default useHistory; 