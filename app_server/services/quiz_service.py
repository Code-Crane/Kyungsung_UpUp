# app_server/services/quiz_service.py

from pathlib import Path

from app_server.services.gpt_client import generate_quiz_from_text
from app_server.services.file_service import extract_text

# uploads 폴더 경로
ROOT_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def generate_quiz(pid: str, db):
    """Generate quiz for the text saved with the given pid."""
    file_path = UPLOAD_DIR / f"{pid}.txt"
    if not file_path.exists():
        return {"error": "파일을 찾을 수 없습니다."}

    text = extract_text(str(file_path))

    # GPT로 퀴즈 생성
    quiz_data = generate_quiz_from_text(text)

    # TODO: 원하면 여기서 DB에 quiz_data 저장 가능
    return quiz_data


def grade_quiz(quiz_id: str, answers: list[int], db):
    # 현재는 고정된 정답 예시로 채점 (DB 연동 전 버전)
    correct_answers = [1, 2, 3]  # 나중에는 quiz_id 기반으로 DB에서 불러올 것

    if len(answers) != len(correct_answers):
        return {"error": "제출한 답안 수가 문제 수와 다릅니다."}

    score = sum([1 for user, correct in zip(answers, correct_answers) if user == correct])

    return {
        "score": score,
        "total": len(correct_answers),
        "correct": score,
        "wrong": len(correct_answers) - score
        }

