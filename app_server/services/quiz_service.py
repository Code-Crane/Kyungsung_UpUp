# app_server/services/quiz_service.py

from app_server.services.gpt_client import generate_quiz_from_text
from app_server.models.file import UploadedFile


def generate_quiz(filename: str, db):
    """Generate quiz from text stored for the given filename."""
    db_file = db.query(UploadedFile).filter(UploadedFile.filename == filename).first()
    if not db_file:
        return {"error": "파일을 찾을 수 없습니다."}

    text = db_file.extracted_text
    if not text:
        return {"error": "추출된 텍스트가 없습니다."}

    # GPT로 퀴즈 생성
    quiz_data = generate_quiz_from_text(text)

    # GPT 응답에서 "questions" 키만 추출해서 프론트 구조로 맞춤
    questions = quiz_data.get("questions", [])
    if not questions:
        return {"error": "GPT가 유효한 퀴즈를 생성하지 못했습니다."}

    return questions , db_file


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

