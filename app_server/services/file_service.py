from app_server.utils.file_parser import extract_text as parse_text
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)


def extract_text(file_path: str) -> str:
    """Extract text from various file formats using parsers."""
    try:
        return parse_text(file_path)
    except Exception as e:
        logger.exception("Error in extract_text: %s", e)
        raise HTTPException(status_code=500, detail="텍스트 추출 중 오류가 발생했습니다.")

