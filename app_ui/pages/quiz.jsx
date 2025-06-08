// QuizUI에 props전달이 되지 않던 이슈 수정(25.05.29)

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizUI from '../components/QuizUI';
import styles from '../styles/quiz.module.css';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('id'); // URL에서 ?id=.. 가져오기

  const [quizData, setQuizData] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(1);
  const [showLoading, setShowLoading] = useState(true); // 🔹로딩 표시 제어

  //  로딩 이미지 순환 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev % 3) + 1); // 1 → 2 → 3 → 1...
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // 퀴즈 데이터 fetch + 최소 로딩 시간 유지(5초)
  useEffect(() => {
    const fetchQuizData = async () => {
      const startTime = Date.now();

      try {
        const res = await fetch(`http://3.148.139.172:8000/api/v1/generate/`);
        if (!res.ok) throw new Error('퀴즈 데이터를 불러올 수 없습니다');
        const data = await res.json();

        const elapsed = Date.now() - startTime;
        const remaining = 5000 - elapsed; // 최소 5초 유지

        setTimeout(() => {
          setQuizData(data);
          setShowLoading(false);
        }, remaining > 0 ? remaining : 0);
      } catch (err) {
        console.error(err);
        setShowLoading(false);
      }
    };

    if (fileId) {
      fetchQuizData();
    }

    return () => clearTimeout(showTimer);
  }, [fileId]);

  return (
    <div className={styles.quizPageWrapper}>
      {showLoading ? (
        <div className={styles.loadingContainer}>
          <img
            src={`/image/loading_${loadingIndex}.png`}
            alt="로딩 중..."
            className={styles.loadingImage}
          />
        </div>
      ) : (
        <QuizUI quizData={quizData} /> // props전달
      )}
    </div>
  );
}







// 퀴즈 생성 페이지의 테스트 코드입니다!
//'use client';

//import QuizUI from '../components/QuizUI';
//import styles from '../styles/quiz.module.css';

// 샘플 데이터를 정의합니다/
//const sampleData = {
//  filename: "정보검색론 중간고사",
//  question: "문제의 길이가 길어질 때 개행이 실행되는지 파악하기 위해 문제의 내용을 늘리고 있다고 할 때, 다음 중 정보처리 기사단의 팀원으로 올바르지 않은 사람은?",
//  options: [
//    { text: "김민성", is_correct: false },
//    { text: "장민재", is_correct: false },
//    { text: "박민재", is_correct: true },  // 정답 문항 3번
//    { text: "김민재", is_correct: false }
//  ],
//  explanations: [ // 채점시 해설 내용
//    "김민성은 정보처리기사단의 든든한 기사이기 때문에 오답입니다.",
//    "장민재는 정보처리 기사단의 날렵한 궁수이기 때문에 오답입니다.",
//    "박민재는 모르는 사람이기 때문에 오답입니다.",
//    "김민재는 정보처리 기사단의 기사 견습생이기 때문에 오답입니다."
//  ]
//};

//export default function QuizPage() {
//  return (
//    <div className={styles.quizPageWrapper}>
//      <QuizUI quizData={sampleData} />  {/*샘플 데이터를 적용하여 퀴즈 생성 페이지를 렌더링 합니다.*/}
//    </div>
//  );
//}git 