# UPUP_Project
팀 어푸어푸의 "러닝메이트 학습 웹앱 만들기 프로젝트"의 프론트 코드 레포지토리 입니다.


### 프론트 파일 구성

# [📁 프로젝트 폴더 구조: app-ui]

```
Kyungsung_UpUp/
├── app_ui/
│   ├── .next/                   # Next.js 빌드 결과물 (자동 생성, 배포 시 필요)
│   ├── .vscode/                # VS Code 에디터 설정
│   ├── .node_modules/          # 설치된 Node.js 패키지들 (npm install 결과)
│
│   ├── components/             # 재사용 가능한 컴포넌트 저장소
│   │   ├── FileUploader.jsx    # 파일 업로드 및 폴더 생성 팝업
│   │   ├── Layout.jsx          # 공통 레이아웃 컴포넌트
│   │   └── QuizUI.jsx          # 퀴즈 UI 컴포넌트 (문제/보기/채점 포함)
│
│   ├── pages/                  # 각 URL 경로에 대응되는 페이지들 (Next.js 라우팅)
│   │   ├── _app.js             # 전체 페이지에 공통 적용 (스타일, 레이아웃 등)
│   │   ├── _document.js        # HTML 문서 커스터마이징 (폰트 삽입 등)
│   │   ├── FileList.jsx        # 업로드된 파일 목록 및 퀴즈 이동 버튼 포함
│   │   ├── index.jsx           # 메인 진입점 - main.jsx 불러옴
│   │   ├── main.jsx            # 초기 메인 페이지 (파일 업로드 UI 포함)
│   │   └── quiz.jsx            # 퀴즈 풀이 페이지
│
│   ├── public/                 # 정적 파일 (이미지, 파비콘 등)
│   │   ├── image/
│   │   │   ├── folder-icon.png       # 폴더 아이콘
│   │   │   ├── KsYEE_Glasses.png     # 사용자 프로필용 이미지
│   │   │   ├── KsYEE_NO.png          # 오답 표시 이미지
│   │   │   ├── KsYEE_YES.png         # 정답 표시 이미지
│   │   │   └── upup.png              # 메인 배경 이미지
│   │   └── ...                       # 기타 이미지 리소스
│
│   ├── styles/                 # CSS 모듈 및 전역 스타일
│   │   ├── Filelist.module.css       # FileList 페이지 전용 스타일
│   │   ├── FileUploader.module.css   # 파일 업로드 팝업 스타일
│   │   ├── globals.css               # 전체 앱에 적용되는 전역 스타일
│   │   ├── main.module.css           # 메인 페이지 전용 스타일
│   │   └── quiz.module.css           # 퀴즈 페이지 전용 스타일
│
│   └── utils/                  # 유틸리티 함수 모음
│       └── api.js              # 파일 업로드 등 백엔드 API 호출 함수
│
├── .env.local                  # 환경변수 설정 파일 (예: API 주소 등)
├── .gitignore                  # Git에서 추적하지 않을 파일/폴더 설정
├── eslint.config.mjs          # 코드 스타일 검사 설정
├── jsconfig.json              # 경로 alias 설정 (예: @/components)
├── next.config.mjs            # Next.js 관련 설정 파일
├── package-lock.json          # 정확한 의존성 버전 잠금
├── package.json               # 프로젝트 메타 정보 및 의존성 목록
├── postcss.config.mjs         # PostCSS 및 Tailwind 설정
└── README.md                  # 프로젝트 개요 및 실행 방법 안내
```

## 추가된 요소(25.05.11기준)

- QuizUI.jsx         # 퀴즈 렌더링 및 채점 컴포넌트
- quiz.jsx           # 퀴즈 풀이 화면
- quiz.module.css          # 퀴즈 페이지 스타일

## 추가된 기능(25.05.11기준)

- '뒤로가기' 버튼 클릭 시 직전 페이지로 이동
- '다시풀기' 버튼 클릭 시 해설 출력란이 사라지고 문항의 정/오답 표시 초기화

## 해결된 이슈(25.05.15기준)
- 보기 문항 중 오답을 선택하고 '채점하기'버튼을 눌렸을 때 정답이 같이 노출되는 현상 해결
- '채점하기'버튼 클릭 후 풀이가 출력된 이후에도 다른 보기 문항이 선택되는 현상 해결
- 문제 내용이 길어지면 자동 개행 실행
