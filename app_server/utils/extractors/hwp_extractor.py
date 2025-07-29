def extract_hwp(file_path: str) -> str:
    try:
        import olefile
        from bs4 import BeautifulSoup
        with olefile.OleFileIO(file_path) as f:
            if not f.exists('PrvText'):
                return "[본문 텍스트가 없습니다]"
            encoded_text = f.openstream('PrvText').read()
            decoded = encoded_text.decode('utf-16')
            return decoded
    except Exception as e:
        return f"[HWP 추출 실패: {str(e)}]"
