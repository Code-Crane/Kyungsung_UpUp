import os
from .extractors.pdf_extractor import extract_pdf
from .extractors.docx_extractor import extract_docx
from .extractors.txt_extractor import extract_txt
from .extractors.ppt_extractor import extract_ppt
from .extractors.hwp_extractor import extract_hwp

def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == ".pdf":
        return extract_pdf(file_path)
    elif ext == ".docx":
        return extract_docx(file_path)
    elif ext == ".txt":
        return extract_txt(file_path)
    elif ext in [".ppt", ".pptx"]:
        return extract_ppt(file_path)
    elif ext == ".hwp":
        return extract_hwp(file_path)
    else:
        return "[지원하지 않는 파일 형식입니다]"

