from unittest.mock import MagicMock, patch

import pytest
from app.model import run_final_inference, run_initial_inference


@pytest.fixture
def mock_response():
    mock = MagicMock()
    mock.status_code = 200
    mock.content = b"fake_image_data"
    return mock


def test_run_initial_inference_success(mock_response):
    with patch("requests.post", return_value=mock_response):
        result = run_initial_inference("test prompt")
        assert result is not None
        assert isinstance(result, str)


def test_run_initial_inference_failure():
    with patch("requests.post") as mock_post:
        mock_post.return_value.status_code = 500
        mock_post.return_value.text = "API Error"
        with pytest.raises(Exception) as exc_info:
            run_initial_inference("test prompt")
        assert "Stable Diffusion API error" in str(exc_info.value)


def test_run_final_inference_success(mock_response):
    with patch("requests.post", return_value=mock_response):
        result = run_final_inference("test_image_url", "test_model")
        assert result is not None
        assert isinstance(result, str)


def test_run_final_inference_failure():
    with patch("requests.post") as mock_post:
        mock_post.return_value.status_code = 500
        mock_post.return_value.text = "API Error"
        with pytest.raises(Exception) as exc_info:
            run_final_inference("test_image_url", "test_model")
        assert "Image processing API error" in str(exc_info.value)
