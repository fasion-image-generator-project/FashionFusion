const API_BASE_URL = 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

const errorMessages = {
  400: '잘못된 요청입니다.',
  401: '인증이 필요합니다.',
  403: '접근이 거부되었습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다.',
  503: '서비스가 일시적으로 사용할 수 없습니다.',
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = errorMessages[response.status] || '알 수 없는 오류가 발생했습니다.';
    throw new ApiError(errorMessage, response.status);
  }
  return response.json();
};

const handleError = (error) => {
  if (error instanceof ApiError) {
    throw error;
  }
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    throw new ApiError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.', 0, 'NETWORK_ERROR');
  }
  throw new ApiError('알 수 없는 오류가 발생했습니다.', 500, 'UNKNOWN_ERROR');
};

export const imageService = {
  generateImage: async (prompt, model) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model }),
      });
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  transformImage: async (image, model) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, model }),
      });
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // API 상태 확인
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  }
}; 