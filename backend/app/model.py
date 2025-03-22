import requests
import logging

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

    # 실제 응답은 이미지 데이터(바이너리 혹은 base64)일 수 있음.
    # 테스트 목적으로는 반환된 데이터를 저장하거나, 단순히 성공 메시지를 확인할 수 있습니다.
    # 여기서는 테스트용으로 placeholder URL을 반환합니다.
    return "https://via.placeholder.com/300?text=StableDiffusion+Output"


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
