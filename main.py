from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, UploadedFile
from extract_text import extract_text
from gpt_generator import generate_quiz_from_text
from routers import quiz_submit

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://3.148.139.172:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 라우터 등록
app.include_router(quiz_submit.router)

# ✅ 테이블 자동 생성
if engine:
    Base.metadata.create_all(bind=engine)

# ✅ 파일 저장 경로
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ DB 세션 의존성 주입
def get_db():
    if SessionLocal is None:
        yield None
    else:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

# ✅ 파일 업로드 엔드포인트
@app.post("/upload/")
async def upload_file(
    lecture_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. 파일 저장
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # 2. 텍스트 추출
    extracted = extract_text(file_path)
    if not extracted:
        raise HTTPException(status_code=400, detail="텍스트 추출에 실패했습니다.")

    # 3. DB 저장
    file_id = 1  # 기본값 (테스트용)
    if db:
        try:
            db_file = UploadedFile(
                filename=unique_filename,
                lecture_name=lecture_name,
                extracted_text=extracted
            )
            db.add(db_file)
            db.commit()
            db.refresh(db_file)
            file_id = db_file.id
        except Exception as e:
            print("💡 DB 저장은 생략했습니다 (테스트 모드):", e)
    else:
        print("💡 테스트 모드: DB 없이 진행")

    return {
        "file_id": file_id,
        "filename": unique_filename,
        "text": extracted,
        "message": "파일 업로드 및 텍스트 저장 완료 (테스트 모드)" if not db else "파일 업로드 및 텍스트 저장 완료!"
    }

# ✅ 퀴즈 생성 엔드포인트
@app.get("/generate-quiz/{file_id}")
def generate_quiz(file_id: int, db: Session = Depends(get_db)):
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")

    if not file.extracted_text:
        raise HTTPException(status_code=400, detail="텍스트가 없습니다.")

    quiz = generate_quiz_from_text(file.extracted_text)
    return {"quiz": quiz}

# ✅ 업로드된 파일 열기 (프론트에서 사용자가 클릭 시 다운로드/뷰용)
@app.get("/file/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
