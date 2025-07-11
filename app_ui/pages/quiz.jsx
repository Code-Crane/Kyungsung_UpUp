'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizUI from '../components/QuizUI';
import styles from '../styles/quiz.module.css';

export default function QuizPage() {
  const searchParams = useSearchParams();
  // FileList에서 전달한 file_id 읽기
  const fileId = searchParams.get('file_id');

  const [quizData, setQuizData]     = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(1);
  const [showLoading, setShowLoading]   = useState(true);

  // 로딩 애니메이션 순환
  useEffect(() => {
    const iv = setInterval(() => {
      setLoadingIndex((i) => (i % 3) + 1);
    }, 600);
    return () => clearInterval(iv);
  }, []);

  // file_id로 퀴즈 조회 + 최소 5초 로딩 유지
  useEffect(() => {
    if (!fileId || fileId === 'null') return;

    const fetchQuizData = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch(
          `http://3.148.139.172:8000/api/v2/quiz?` +
          new URLSearchParams({ file_id: fileId }).toString()
        );
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
