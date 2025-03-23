import requests
import logging
import base64
import datetime
from PIL import Image
import io

HF_API_TOKEN = "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"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_initial_inference(model_input):
    API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": model_input}  # model_input은 텍스트 프롬프트입니다.

    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        logger.error(f"Stable Diffusion API error: {response.text}")
        raise Exception(f"Stable Diffusion API error: {response.text}")

    # Get the generated image data
    image_data = response.content

    image = Image.open(io.BytesIO(image_data))
    image.show()

    # Convert the image data to base64 for easy transmission
    base64_image = base64.b64encode(image_data).decode("utf-8")

    # Return just the base64 image string
    return base64_image


def run_final_inference(initial_image_url, selected_model):
    # 여기에 사용하려는 Cycle GAN 모델의 Hugging Face endpoint URL을 입력
    API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-refiner-1.0"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

    payload = {
        "inputs": {
            "image": initial_image_url,
            "model": selected_model,
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        logger.error(f"Cycle GAN API error: {response.text}")
        raise Exception(f"Cycle GAN API error: {response.text}")

    return "https://via.placeholder.com/300?text=CycleGAN+Design"
