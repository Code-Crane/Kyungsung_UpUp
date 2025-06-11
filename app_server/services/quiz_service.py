# app_server/services/quiz_service.py

from app_server.services.gpt_client import generate_quiz_from_text
from app_server.models.file import UploadedFile


def generate_quiz(pid: str, db):
    """Generate quiz for the text saved with the given pid."""
    record = db.query(UploadedFile).filter(UploadedFile.id == int(pid)).first()
    if not record:
        return {"error": "파일을 찾을 수 없습니다."}

    text = record.extracted_text

    # GPT로 퀴즈 생성
    quiz_data = generate_quiz_from_text(text)

    # FastAPI가 일관된 형태의 JSON을 반환하도록 보정
    if isinstance(quiz_data, dict) and "questions" in quiz_data:
        return {"questions": quiz_data["questions"]}

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

