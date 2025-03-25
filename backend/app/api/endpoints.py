from app.model import run_final_inference, run_initial_inference
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


# 요청/응답 모델 정의
class InitialDesignRequest(BaseModel):
    text: str
    model: str  # 모델 선택 필드 추가


class InitialDesignResponse(BaseModel):
    imageUrl: str


class FinalDesignRequest(BaseModel):
    image: str  # 초기 디자인 이미지 URL 또는 이미지 데이터
    model: str


class FinalDesignResponse(BaseModel):
    imageUrl: str


# 초기 디자인 생성 엔드포인트 (목 데이터 반환)
@router.post("/predict/initial", response_model=InitialDesignResponse)
async def predict_initial_design(request: InitialDesignRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        image_url = await run_initial_inference(request.text, request.model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return InitialDesignResponse(imageUrl=image_url)


# 최종 디자인 생성 엔드포인트 (목 데이터 반환)
@router.post("/predict/final", response_model=FinalDesignResponse)
async def predict_final_design(request: FinalDesignRequest):
    if not request.image:
        raise HTTPException(status_code=400, detail="Image is required")
    try:
        image_url = await run_final_inference(request.image, request.model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return FinalDesignResponse(imageUrl=image_url)
