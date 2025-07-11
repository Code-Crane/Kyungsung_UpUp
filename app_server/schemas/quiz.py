from pydantic import BaseModel
from typing import List

class QuizRequest(BaseModel):
    pid: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[int]
