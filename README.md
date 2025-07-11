```
project-root/
├── app_ui/
│   ├── public/            # 정적 파일
│   ├── src/               # 소스 코드
│   │   ├── assets/        # 이미지, 폰트 등
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── services/      # API 호출 관련 서비스
│   │   ├── context/       # 상태 관리
│   │   ├── App.jsx        # .js 대신 .jsx 확장자가 기본
│   │   ├── main.jsx       # CRA의 index.js에 해당
│   │   └── index.css      # 기본 스타일
│   ├── index.html         # 진입점 HTML
│   ├── vite.config.js     # Vite 설정 파일
│   ├── package.json
│   └── README.md
├── app_server/
│   ├── main.py                  # FastAPI 진입점
│   ├── api/
│       └── v1/
│           └── endpoints/
│               ├── file.py      # 파일 업로드, 다운로드 API
│               └── quiz.py      # 퀴즈 생성, 채점 API
│   └── uploads/             # 업로드된 파일 저장 폴더
├── core/
│   └── database.py          # SQLAlchemy + get_db
├── models/
│   └── file.py              # UploadedFile 모델
├── schemas/
│   ├── file.py              # FileCreate, FileOut
│   └── quiz.py              # QuizRequest, QuizSubmission
├── services/
│   ├── file_service.py      # 텍스트 추출 로직
│   ├── quiz_service.py      # GPT 기반 퀴즈 생성/채점
│   └── gpt_client.py        # OpenAI 호출 클라이언트
├── utils/
│   ├── file_parser.py       # 확장자에 따른 파서 분기
│   └── extractors/
│       ├── pdf_extractor.py
│       ├── docx_extractor.py
│       ├── ppt_extractor.py
│       ├── txt_extractor.py
│       └── hwp_extractor.py
├── .env
├── requirements.txt
└── README.md
```
