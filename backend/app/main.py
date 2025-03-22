from fastapi import FastAPI
from app.api import endpoints

app = FastAPI(
    title="FashionFusion API",
    description="초기 및 최종 디자인 생성을 위한 API endpoint를 제공합니다.",
    version="1.0.0",
)

# endpoint router
app.include_router(endpoints.router)
