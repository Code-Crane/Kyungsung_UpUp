from pydantic import BaseModel
from datetime import datetime

class FileCreate(BaseModel):
    lecture_name: str
    filename: str
    extracted_text: str

class FileOut(FileCreate):
    id: int
    uploaded_at: datetime

    class Config:
        orm_mode = True
