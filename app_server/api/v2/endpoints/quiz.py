# app_server/api/v2/endpoints/quiz.py

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends

from app_server.schemas import QuizRequest, QuizSubmission, QuizOut, QuizWithFileOut
from app_server.services.quiz_service import generate_quiz, grade_quiz
from app_server.core.database import get_db


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
