# app_server/schemas/quiz.py

from pydantic import BaseModel
from typing import List

class QuizRequest(BaseModel):
    filename: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[int]

class QuizOption(BaseModel):
    text: str
    is_correct: bool

class QuizItem(BaseModel):
    question: str
    options: List[QuizOption]

class QuizOut(BaseModel):
    quiz: List[QuizItem]
    
class QuizWithFileOut(BaseModel):
    file_id: int
    filename: str
    text: str
    message: str
    quiz: List[QuizItem]
