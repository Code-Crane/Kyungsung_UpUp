from app_server.utils.file_parser import extract_text as parse_text


def extract_text(file_path: str) -> str:
    """Extract text from various file formats using parsers."""
    return parse_text(file_path)

