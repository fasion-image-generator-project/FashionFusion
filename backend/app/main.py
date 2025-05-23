from app.api import endpoints
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="FashionFusion API",
    description="초기 및 최종 디자인 생성을 위한 API endpoint를 제공합니다.",
    version="1.0.0",
)

# CORS 미들웨어 추가:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# endpoint router
app.include_router(endpoints.router)

# 정적 파일 경로 설정
app.mount("/static", StaticFiles(directory="static"), name="static")
