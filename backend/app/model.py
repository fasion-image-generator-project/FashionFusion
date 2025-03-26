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

# Stable Diffusion model IDs and endpoints
STABLE_DIFFUSION_MODELS = {
    "Stable Diffusion 1.5": {
        "model_id": "runwayml/stable-diffusion-v1-5",
        "endpoint": "https://cysjxaqpfnhrehzk.tunnel-pt.elice.io/proxy/8000/stablediffusion-1-5",
    },
    "Stable Diffusion 3.5": {
        "model_id": "stabilityai/stable-diffusion-3.5-large",
        "endpoint": "https://wrztjrpgzttncatd.tunnel-pt.elice.io/proxy/8000/stablediffusion-3-5",
    },
}

# Initialize InferenceClient dictionary for each model
clients = {
    model_name: InferenceClient(model_info["model_id"], token=HF_API_TOKEN)
    for model_name, model_info in STABLE_DIFFUSION_MODELS.items()
}


async def run_initial_inference(prompt: str, model: str, seed: int = None):
    """
    Generate an image from a text prompt using the selected Stable Diffusion model.

    Args:
        prompt (str): The text prompt for image generation.
        model (str): The selected model name ("Stable Diffusion 1.5" or "Stable Diffusion 3.5")
        seed (int, optional): Random seed for image generation

    Returns:
        str: The Base64-encoded string of the generated image.
    """
    try:
        if model not in STABLE_DIFFUSION_MODELS:
            raise ValueError(f"Invalid model selection: {model}")

        endpoint = STABLE_DIFFUSION_MODELS[model]["endpoint"]

        async with httpx.AsyncClient() as client:
            request_data = {"prompt": prompt}
            if seed is not None:
                request_data["seed"] = seed

            response = await client.post(endpoint, json=request_data, timeout=30.0)
            response.raise_for_status()
            result = response.json()

            # Assuming the API returns the image in base64 format
            if "image" in result:
                return result["image"]
            else:
                raise ValueError("No image data in response")

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


async def run_final_inference(
    initial_image_url: str, selected_model: str, seed: int = None
) -> str:
    """
    Process the initial image using the selected model and return the result as a base64 string.

    Args:
        initial_image_url (str): URL or file path of the initial image.
        selected_model (str): The model to use for processing.
        seed (int, optional): Random seed for image generation

    Returns:
        str: Base64-encoded string of the processed image.
    """
    try:
        if selected_model not in STABLE_DIFFUSION_MODELS:
            raise ValueError(f"Invalid model selection: {selected_model}")

        # 이미지 다운로드 및 전처리
        image = await download_image(initial_image_url)

        # 이미지를 base64로 인코딩
        image_base64 = encode_image_to_base64(image)

        endpoint = STABLE_DIFFUSION_MODELS[selected_model]["endpoint"]

        async with httpx.AsyncClient() as client:
            request_data = {
                "prompt": "Turn the object in the picture into a cyborg",
                "image": image_base64,
            }
            if seed is not None:
                request_data["seed"] = seed

            response = await client.post(
                endpoint,
                json=request_data,
                timeout=30.0,
            )
            response.raise_for_status()
            result = response.json()

            # Assuming the API returns the image in base64 format
            if "image" in result:
                return result["image"]
            else:
                raise ValueError("No image data in response")

    except Exception as e:
        logger.error(f"Stable Diffusion API error: {str(e)}")
        raise Exception(f"Stable Diffusion API error: {str(e)}")
