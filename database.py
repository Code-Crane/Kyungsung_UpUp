import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

Base = declarative_base()

# .env 파일 불러오기
load_dotenv()

USE_FAKE_DB = False  # 실제 DB 사용 여부 (True: Fake DB, False: 실제 DB)
if not USE_FAKE_DB:
# .env에서 정보 가져오기
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_NAME = os.getenv("DB_NAME")
    DB_PORT = os.getenv("DB_PORT", "3306")

    DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    )

    engine = create_engine(DATABASE_URL, echo=True)
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    Base = declarative_base()
else:
    engine = None
    SessionLocal = None

# # DB 엔진 & 세션 설정
# engine = create_engine(DATABASE_URL, echo=True)
# SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# # 모델 선언용 베이스 클래스
# Base = declarative_base()
