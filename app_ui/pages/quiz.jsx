// QuizUI에 props전달이 되지 않던 이슈 수정(25.05.29)

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizUI from '../components/QuizUI';
import styles from '../styles/quiz.module.css';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('id'); // URL에서 ?id=.. 가져오기
  const fileName = searchParams.get('file');

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
        const res = await fetch('http://3.148.139.172:8000/api/v2/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pid: fileId }),
        });

        if (!res.ok) throw new Error('퀴즈 데이터를 불러올 수 없습니다');
        const data = await res.json();
        console.log(data); // 응답 전체 구조 확인
        console.log(data.quiz); // quiz 데이터 구조 확인

        const quiz = data.quiz;

        const elapsed = Date.now() - startTime;
        const remaining = 5000 - elapsed; // 최소 5초 유지

        setTimeout(() => {
          setQuizData(quiz); // quiz 객체만 상태로 저장
          setShowLoading(false);
        }, remaining > 0 ? remaining : 0);
      } catch (err) {
        console.error(err);
        setShowLoading(false);
      }
    };

    // id가 "null"문자열인지 확인하고, API요청 방지
    if (fileId && fileId !== 'null') {
      fetchQuizData();
    }

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
        quizData ? (
          <QuizUI quizData={quizData} />
        ) : (
          <div>퀴즈를 불러오지 못했습니다.</div>
        )
      )}
    </div>
  );
}
