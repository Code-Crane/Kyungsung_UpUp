# app_server/api/v2/endpoints/quiz.py

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends

from app_server.schemas import QuizRequest, QuizSubmission, QuizOut, QuizWithFileOut
from app_server.services.quiz_service import generate_quiz, grade_quiz
from app_server.services.gpt_client import generate_quiz_from_text
from app_server.core.database import get_db
from app_server.models.file import UploadedFile
from fastapi import Query


router = APIRouter()

@router.post("/generate", response_model=QuizWithFileOut)
async def create_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    try:
        quiz, file_info = generate_quiz(request.filename, db)

        return {
            "file_id": file_info.id,
            "filename": file_info.filename,
            "text": file_info.extracted_text,
            "message": "업로드 및 저장 완료",
            "quiz": quiz
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/submit")
async def submit_quiz(submission: QuizSubmission, db: Session = Depends(get_db)):
    try:
        result = grade_quiz(submission.quiz_id, submission.answers, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/quiz")
async def get_quiz_by_file_id(file_id: int = Query(...), db: Session = Depends(get_db)):
    try:
        # file_id 기반으로 DB에서 조회
        db_file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        if not db_file:
            raise HTTPException(status_code=404, detail="해당 파일이 없습니다.")

        text = db_file.extracted_text
        if not text:
            raise HTTPException(status_code=400, detail="텍스트가 없습니다.")

        quiz_data = generate_quiz_from_text(text)
        questions = quiz_data.get("questions", [])

        return {
            "file_id": db_file.id,
            "filename": db_file.filename,
            "text": db_file.extracted_text,
            "message": "퀴즈 생성 완료",
            "quiz": questions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
