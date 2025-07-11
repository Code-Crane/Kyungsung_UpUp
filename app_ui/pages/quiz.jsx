'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizUI from '../components/QuizUI';
import styles from '../styles/quiz.module.css';

export default function QuizPage() {
  const searchParams = useSearchParams();
  // 기존: const fileId = searchParams.get('id');
  // 변경: URL에서 ?file_id=.. 가져오기
  const fileId = searchParams.get('file_id');
  const fileName = searchParams.get('fileName');

  const [quizData, setQuizData] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(1);
  const [showLoading, setShowLoading] = useState(true); // 🔹로딩 표시 제어

  // 로딩 이미지 순환 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev % 3) + 1);
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
          // 기존: body: JSON.stringify({ pid: fileId }),
          // 변경: backend가 기대하는 key 이름으로
          body: JSON.stringify({ file_id: fileId }),
        });

        if (!res.ok) throw new Error('퀴즈 데이터를 불러올 수 없습니다');
        const data = await res.json();
        console.log(data.quiz);

        const quiz = data.quiz;
        const elapsed = Date.now() - startTime;
        const remaining = 5000 - elapsed;

        setTimeout(() => {
          setQuizData(quiz);
          setShowLoading(false);
        }, remaining > 0 ? remaining : 0);
      } catch (err) {
        console.error(err);
        setShowLoading(false);
      }
    };

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
      ) : quizData ? (
        <QuizUI quizData={quizData} />
      ) : (
        <div>퀴즈를 불러오지 못했습니다.</div>
      )}
    </div>
  );
}
