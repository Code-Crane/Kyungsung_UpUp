# app_server/api/v2/endpoints/quiz.py

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends

from app_server.schemas import QuizRequest, QuizSubmission, QuizOut
from app_server.services.quiz_service import generate_quiz, grade_quiz
from app_server.core.database import get_db


router = APIRouter()

@router.post("/generate", response_model=QuizOut)
async def create_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    try:
        quiz = generate_quiz(request.filename, db)
        return {"quiz": quiz}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/submit")
async def submit_quiz(submission: QuizSubmission, db: Session = Depends(get_db)):
    try:
        result = grade_quiz(submission.quiz_id, submission.answers, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
