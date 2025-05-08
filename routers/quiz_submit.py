# routers/quiz_submit.py 

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..gpt_generator import generate_quiz_from_text  # 방금 만든 함수

router = APIRouter()

class QuizRequest(BaseModel):
    content: str
    num_questions: int = 3  # 지금은 안 쓰지만 확장용으로 포함

@router.post("/api/generate-quiz")
def generate_quiz(request: QuizRequest):
    result = generate_quiz_from_text(request.content)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return result  # 👉 프론트엔드로 JSON 반환
