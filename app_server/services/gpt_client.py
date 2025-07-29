# app_server/services/gpt_client.py

import os
import json
import logging
from fastapi import HTTPException
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
logger = logging.getLogger(__name__)

def generate_quiz_from_text(text: str) -> dict:
    try:
        prompt = f"""
        아래 내용을 바탕으로 객관식 문제 3개를 만들어주세요.
        각 문제는 보기 4개와, 각 보기에 'text'와 'is_correct'(True/False)를 포함해야 합니다.

        다음 JSON 형식으로 반환해 주세요:

        {{
          "questions": [
            {{
              "question": "문제 내용",
              "options": [
                {{ "text": "보기1", "is_correct": false }},
                {{ "text": "보기2", "is_correct": true }},
                ...
              ]
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
                {"role": "system", "content": "당신은 대학 강의 보조용 문제 출제 도우미입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1024,
        )

        content = response.choices[0].message.content.strip()
        quiz_json = json.loads(content)
        return quiz_json

    except Exception as e:
        logger.exception("Error in generate_quiz_from_text: %s", e)
        raise HTTPException(status_code=500, detail="문제 생성에 실패했습니다.")
