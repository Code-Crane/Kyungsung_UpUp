# app_server/api/v1/endpoints/quiz.py

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
import os, uuid
import logging

from app_server.core.database import get_db
from app_server.models.file import UploadedFile
from app_server.services.file_service import extract_text

logger = logging.getLogger(__name__)

# Define the uploads directory inside ``app_server``.
APP_DIR = Path(__file__).resolve().parents[3]
UPLOAD_DIR = APP_DIR / "uploads"

router = APIRouter()

@router.post("/upload/")
async def upload_file(
    lecture_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        extracted = extract_text(file_path)
        if not extracted:
            raise HTTPException(status_code=400, detail="텍스트 추출 실패")

        db_file = UploadedFile(
            filename=unique_filename,
            lecture_name=lecture_name,
            extracted_text=extracted,
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)

        return {
            "file_id": db_file.id,
            "filename": unique_filename,
            "text": extracted,
            "message": "업로드 및 저장 완료",
        }
    except Exception as e:
        db.rollback()
        logger.exception("Error in upload_file: %s", e)
        raise HTTPException(status_code=500, detail="파일 업로드 중 오류가 발생했습니다.")

@router.get("/file/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="파일이 존재하지 않습니다")
    return FileResponse(file_path)

@router.post("/text/")
async def save_text(pid: str = Form(...), text: str = Form(...)):
    """Save raw text to a file associated with the given pid."""
    filename = f"{pid}.txt"
    file_path = UPLOAD_DIR / filename
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)
    return {"pid": pid, "message": "저장 완료"}


