from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app_server.core.database import Base

class UploadedFile(Base):

    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    lecture_name = Column(String(255))
    extracted_text = Column(Text)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
