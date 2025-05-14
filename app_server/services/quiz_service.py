# app_server/services/quiz_service.py

from app_server.services.gpt_client import generate_quiz_from_text

def format_quiz_for_frontend(raw_question_block: dict, filename: str = "파일명") -> dict:
    return {
        "filename": filename,
        "question": raw_question_block["question"],
        "options": [
            {
                "text": opt,
                "is_correct": (idx == raw_question_block["answer"] - 1)
            }
            for idx, opt in enumerate(raw_question_block["options"])
        ],
        "explanations": [
            f"{i+1}번 보기 해설 예시입니다." for i in range(len(raw_question_block["options"]))
        ]
    }


def generate_quiz(file_path: str, db):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        return {"error": "파일을 찾을 수 없습니다."}

    # GPT 호출 결과
    raw_quiz = generate_quiz_from_text(text)

    # 프론트 구조에 맞게 포맷팅
    formatted_quizzes = [
        format_quiz_for_frontend(q, filename=file_path.split("/")[-1])
        for q in raw_quiz.get("questions", [])
    ]

    return {"quiz": formatted_quizzes}


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
