from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일에서 API 키 로드

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_quiz_from_text(text: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "당신은 대학 강의 보조용 문제 출제 도우미입니다. 사용자가 제공한 학습 내용을 기반으로 객관식 문제를 만들어야 합니다."
                },
                {
                    "role": "user",
                    "content": f"{text} 이 텍스트를 기반으로 객관식 문제 3개를 출제해 주세요. 각 문제는 보기와 정답을 포함해야 합니다."
                }
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        return response.choices[0].message.content

    except Exception as e:
        print("❌ GPT 호출 오류:", e)
        return "문제 생성에 실패했습니다."


