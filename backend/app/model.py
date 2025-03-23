import requests
import logging
import base64
import datetime
import PIL
from PIL import Image, ImageOps
import io
import os

HF_API_TOKEN = "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"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_initial_inference(model_input: str):
    """
    Generate an image from a text prompt using the Stable Diffusion 3.5 API,
    displays the image, and returns the image as a Base64-encoded string.

    Args:
        model_input (str): The text prompt for image generation.

    Returns:
        str: The Base64-encoded string of the generated image.
    """
    API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": model_input}

    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        logger.error(f"Stable Diffusion API error: {response.text}")
        raise Exception(f"Stable Diffusion API error: {response.text}")

    image_data = response.content

    with Image.open(io.BytesIO(image_data)) as image:
        image.show()

    base64_image = base64.b64encode(image_data).decode("utf-8")
    return base64_image


def run_final_inference(initial_image_url: str, selected_model: str) -> str:
    """
    Process the initial image using the selected model and return the result as a base64 string.

    Args:
        initial_image_url (str): URL or file path of the initial image.
        selected_model (str): The model to use for processing.

    Returns:
        str: Base64-encoded string of the processed image.
    """
    API_URL = "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

    def download_image(input_str: str) -> Image.Image:
        """
        입력이 URL, 로컬 파일 경로 또는 Base64 인코딩 문자열인 경우 모두 처리합니다.
        """
        # 로컬 파일 경로가 존재하면 해당 파일을 연다.
        if os.path.exists(input_str):
            img = Image.open(input_str)
        # http로 시작하면 URL로 간주하여 다운로드
        elif input_str.startswith("http"):
            response = requests.get(input_str, stream=True)
            response.raise_for_status()
            img = Image.open(response.raw)
        else:
            # 입력 문자열이 Base64 인코딩된 이미지인지 확인 (간단한 체크)
            # "data:image/..." 접두사가 있으면 제거
            if input_str.startswith("data:image"):
                input_str = input_str.split(",", 1)[1]
            try:
                image_bytes = base64.b64decode(input_str)
                img = Image.open(io.BytesIO(image_bytes))
            except Exception as e:
                logger.error(f"Failed to decode base64 image: {str(e)}")
                raise Exception(
                    "Invalid image data provided; not a valid URL, file path, or Base64 string."
                )
        return ImageOps.exif_transpose(img).convert("RGB")

    def encode_image_to_base64(img: Image.Image) -> str:
        """
        Encodes a PIL image to a Base64 string in PNG format.
        """
        with io.BytesIO() as buffer:
            img.save(buffer, format="PNG", optimize=True)
            return base64.b64encode(buffer.getvalue()).decode("utf-8")

    # 이미지 다운로드 및 전처리
    image = download_image(initial_image_url)
    image.show()
    image_base64 = encode_image_to_base64(image)

    payload = {
        "inputs": image_base64,  # 필요 시 "data:image/png;base64," 접두사를 추가할 수 있음.
        "parameters": {
            "prompt": "turn him into cyborg",
            "num_inference_steps": 10,
            "image_guidance_scale": 1,
        },
    }
    logger.info(f"Payload size: {len(str(payload))} bytes")

    # API 호출
    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        logger.error(f"Image processing API error: {response.text}")
        raise Exception(f"Image processing API error: {response.text}")

    # 결과 이미지 처리 및 표시
    result_image_data = response.content
    base64_result = base64.b64encode(result_image_data).decode("utf-8")
    with Image.open(io.BytesIO(result_image_data)) as result_img:
        result_img.show()

    print("Base64 result:", base64_result)
    return base64_result
