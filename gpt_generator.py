from openai import OpenAI
import os
from dotenv import load_dotenv
import  traceback
import json
load_dotenv()  # .env 파일에서 API 키 로드

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_quiz_from_text(text: str) -> dict:
    try:
        prompt = f"""
        아래 내용을 바탕으로 객관식 문제 3개를 만들어주세요.
        각 문제는 보기 4개와 정답 인덱스(1~4)를 포함해야 하며,
        다음 JSON 형식으로 반환해 주세요:

        {{
          "questions": [
            {{
              "question": "문제 내용",
              "options": ["보기1", "보기2", "보기3", "보기4"],
              "answer": 정답번호
            }},
            ...
          ]
        }}

        내용:
        {text}
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "당신은 대학 강의 보조용 문제 출제 도우미입니다."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1024,
        )
  # GPT 응답에서 content 추출
        content = response.choices[0].message.content.strip()

        # JSON으로 파싱 시도
        quiz_json = json.loads(content)
        return quiz_json

    except Exception as e:
        print("❌ GPT 호출 오류:", e)
        traceback.print_exc()
        return {"error": "문제 생성에 실패했습니다."}