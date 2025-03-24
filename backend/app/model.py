import base64
import io
import logging
import os
from io import BytesIO

import httpx
from config import MODEL_IDS
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from PIL import Image, ImageOps

load_dotenv()
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
if not HF_API_TOKEN:
    raise ValueError("HF_API_TOKEN is not set in the environment environment variable.")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize InferenceClient
client = InferenceClient(token=HF_API_TOKEN)


async def run_initial_inference(prompt: str):
    """
    Generate an image from a text prompt using the Stable Diffusion 3.5 API,
    displays the image, and returns the image as a Base64-encoded string.

    Args:
        prompt (str): The text prompt for image generation.

    Returns:
        str: The Base64-encoded string of the generated image.
    """
    try:
        response = client.text_to_image(model=MODEL_IDS["text_to_image"], prompt=prompt)

        with BytesIO() as buffer:
            response.save(buffer, format="JPEG")
            image_bytes = buffer.getvalue()

        encoded_image = base64.b64encode(image_bytes).decode("utf-8")
        return encoded_image
    except Exception as e:
        logger.error(f"Stable Diffusion API error: {str(e)}")
        raise Exception(f"Stable Diffusion API error: {str(e)}")


async def download_image(input_str: str) -> Image.Image:
    """
    Downloads an image from a URL, loads from a local file, or decodes from a Base64 string.

    Args:
        input_str (str): URL, file path, or Base64-encoded string.

    Returns:
            Image.Image: PIL Image object.
    """
    if os.path.exists(input_str):
        img = Image.open(input_str)
    # URL인 경우
    elif input_str.startswith("http"):
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(input_str, stream=True)
            response.raise_for_status()
            img = Image.open(io.BytesIO(response.content))
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


async def run_final_inference(initial_image_url: str, selected_model: str) -> str:
    """
    Process the initial image using the selected model and return the result as a base64 string.

    Args:
        initial_image_url (str): URL or file path of the initial image.
        selected_model (str): The model to use for processing.

    Returns:
        str: Base64-encoded string of the processed image.
    """
    # 이미지 다운로드 및 전처리
    image = await download_image(initial_image_url)
    # image.show()

    # 이미지를 바이트 데이터로 변환 (예: PNG 형식)
    with BytesIO() as img_buffer:
        image.save(img_buffer, format="PNG")
        image_bytes = img_buffer.getvalue()

    # 이제 InferenceClient에 전달할 때, PIL.Image 객체 대신 바이트 데이터를 전달합니다.
    prompt = "Turn the object in the picture into a cyborg"
    try:
        # image_bytes를 전달 (바이트 데이터)
        response = client.image_to_image(
            image_bytes, prompt, model=MODEL_IDS["image_to_image"]
        )

        with BytesIO() as buffer:
            response.save(buffer, format="JPEG")
            result_bytes = buffer.getvalue()

        encoded_image = base64.b64encode(result_bytes).decode("utf-8")
        return encoded_image
    except Exception as e:
        logger.error(f"Stable Diffusion API error: {str(e)}")
        raise Exception(f"Stable Diffusion API error: {str(e)}")
