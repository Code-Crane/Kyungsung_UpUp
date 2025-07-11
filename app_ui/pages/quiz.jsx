'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizUI from '../components/QuizUI';
import styles from '../styles/quiz.module.css';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get('file_id');

  const [quizData, setQuizData]         = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(1);
  const [showLoading, setShowLoading]   = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setLoadingIndex(i => (i % 3) + 1);
    }, 600);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    // file_id 없으면 곧바로 로딩 종료
    if (!fileId || fileId === 'null') {
      setShowLoading(false);
      return;
    }

    const fetchQuizData = async () => {
      const startTime = Date.now();
      try {
        const query = new URLSearchParams({ file_id: fileId }).toString();
        const res = await fetch(`http://3.148.139.172:8000/api/v2/quiz?${query}`);
        if (!res.ok) throw new Error('퀴즈 데이터를 불러올 수 없습니다');

        const { quiz } = await res.json();
        const elapsed = Date.now() - startTime;
        const remaining = 5000 - elapsed;

        setTimeout(() => {
          setQuizData(quiz);
          setShowLoading(false);
        }, remaining > 0 ? remaining : 0);
      } catch (err) {
        console.error('QuizPage fetch error:', err);
        setShowLoading(false);
      }
    };

    fetchQuizData();
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
