from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app_server.api.v2.endpoints import file, quiz
from app_server.core.database import Base, engine
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

# FastAPI 인스턴스 생성 + Swagger 정보 설정
app = FastAPI(
    title="경성 업업 API",
    description="전공 강의 자료 기반 자동 퀴즈 생성 및 풀이 시스템",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://3.148.139.172:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(file.router, prefix="/api/v2", tags=["File"])
app.include_router(quiz.router, prefix="/api/v2", tags=["Quiz"])
