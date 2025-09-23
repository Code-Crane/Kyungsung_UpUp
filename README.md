# [팀 어푸어푸]-러닝메이트 프로젝트
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/leadimage.png" width="600px" height="500" alt="썸네일이미지"/>

> <b>다양한 학습 자료를 업로드하고 퀴즈 풀이를 통해 성장하세요!</b><br>
> <b>여러분의 든든한 '러닝메이트'가 되어드립니다!</b><br>


## 프로젝트 개요
- 학생들의 학습도우미 웹앱을 개발합니다.
- 사전에 정의된 프롬프트를 통해 업로드된 자료를 바탕으로 퀴즈를 생성합니다.
- 추가적인 학습이 필요한 내용을 선택적으로 학습하고 관리합니다.


## 프로젝트 기간

- **시작일** : 2025년 4월 8일 (화)
- **종료일** : 2025년 8월 21일 (목)
- **총 기간** : 약 5개월


## 팀원 소개

|                                프론트엔드(PM)                              |                                  백엔드(서버&API)                         |                              백엔드(DB)                              |                              
| :-------------------------------------------------------------------: | :----------------------------------------------------------------------: | :-------------------------------------------------------------------:| 
| <img src="https://github.com/WSIDFY.png" width="100px" alt="김민재"/> | <img src="https://github.com/Code-Crane.png" width="100px" alt="김민성"/> | <img src="https://github.com/Haleluya777.png" width="100px" alt="장민재"/> |
|                  [김민재](https://github.com/WSIDFY)                  |                  [김민성](https://github.com/Code-Crane)                  |                  [장민재](https://github.com/Haleluya777)                  |        


## 주요 기능

### 파일 업로드 & 폴더 생성

- 사용자가 파일을 업로드 함과 동시에 폴더를 생성
- 파일 형식은 PDF, HWP 등 대부분의 파일형식 가능
- 폴더명, 폴더 설명 내용 기입 가능

### 퀴즈 생성 & 파일 미리보기

- 생성된 폴더 클릭 후 해당 폴더 내의 파일을 확인 가능
- 각 파일별로 '퀴즈 생성', '미리보기'옵션 제공

### 파일분석 및 로딩화면 송출

- '퀴즈 생성'버튼 클릭 후 퀴즈가 생성되는 동안 학교의 아이콘인 '경성이'가 송출

### 퀴즈 풀이 및 퀴즈 채점

- 파일의 내용을 바탕으로 생성된 문제 제공
- 항목별 정/오답 구분 및 채점기능 제공


## 사용 스택

Frontend : React, Tailwind CSS  
Backend : Python, GPT API, Swagger  
Database : MySQL  
Deploy : Vercel VO(프론트) 
기타 : Git, GitHub, Figma, Discord, Slack


## 트러블 슈팅 상세 보기

<details markdown="1">
<summary>CORS권한 문제</summary>

## 문제상황

대기

## 원인 분석

대기

## 해결 과정

대기

</details>


## 📌 향후 계획

- 로그인 및 회원가입 기능 추가(회원별 관리)
- 오답노트 기능 추가
- 여러개의 서로 다른 문제 생성 및 종합 관리 기능 추가
- 전체적인 코드의 리팩토링


## 기능 구현
#### [메인화면]
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/main.png" width="600px" height="500" alt="메인"/>

#### [푸터]
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/footer.png" width="600px" height="500" alt="푸터"/>

#### [폴더생성]
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/createfolder1.png" width="600px" height="500" alt="폴더생성1"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/createfolder2.png" width="600px" height="500" alt="폴더생성2"/>

#### [폴더내부 파일확인]
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/checkfolder.png" width="600px" height="500" alt="폴더내용확인"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/filelist.png" width="600px" height="500" alt="파일리스트"/>

#### [로딩화면]
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/loading.png" width="600px" height="500" alt="로딩화면송출"/>

#### [퀴즈생성 및 퀴즈풀이]
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/createquiz.png" width="600px" height="500" alt="퀴즈생성"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/quizhover.png" width="600px" height="500" alt="문항호버링"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/createchoice.png" width="600px" height="500" alt="문항선택"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/quizyes.png" width="600px" height="500" alt="정답선택"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/quizno.png" width="600px" height="500" alt="오답선택"/>

#### [예외(에러) 처리]
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/addfileerr.png" width="600px" height="500" alt="파일업로드에러"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/fordernameerr.png" width="600px" height="500" alt="폴더명에러"/>
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/quizcallerr.png" width="600px" height="500" alt="퀴즈불러오기실패"/>


## 폴더 구성

```
project-root/
├── app_ui/
│   ├── public/            
│   ├── src/               
│   │   ├── assets/        
│   │   ├── components/   
│   │   ├── pages/         
│   │   ├── services/      
│   │   ├── context/      
│   │   ├── App.jsx        
│   │   ├── main.jsx       
│   │   └── index.css     
│   ├── index.html         
│   ├── vite.config.js     
│   ├── package.json
│   └── README.md
├── app_server/
│   ├── main.py                  
│   ├── api/
│   │   ├── v1/
│   │   │   └── endpoints/
│   │   │       ├── file.py      
│   │   │       └── quiz.py      
│   │   └── v2/
│   │       └── endpoints/
│   │           ├── file.py      
│   │           └── quiz.py      
│   ├── uploads/                 
│   ├── core/
│   │   └── database.py              
│   ├── models/
│   │   └── file.py                  
│   ├── schemas/
│   │   ├── file.py                  
│   │   └── quiz.py                  
│   ├── services/
│   │   ├── file_service.py          
│   │   ├── quiz_service.py          
│   │   └── gpt_client.py            
│   ├── utils/
│   │   ├── file_parser.py           
│   │   └── extractors/
│   │   │   ├── pdf_extractor.py
│   │   │   ├── docx_extractor.py
│   │   │   ├── ppt_extractor.py
│   │   │   ├── txt_extractor.py
│   │   │   └── hwp_extractor.py
│   ├── .env
│   ├── requirements.txt 
│   └── README.md                                    
└── README.md
```


## 어푸어푸 - 팀 대표이미지
<img src="https://github.com/Code-Crane/Kyungsung_UpUp/blob/main/img/UPUP.jpg" width="400px" height="400" alt="UPUP"/>
