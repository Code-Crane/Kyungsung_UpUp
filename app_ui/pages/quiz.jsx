'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuizUI from '../components/QuizUI';
import styles from '../styles/quiz.module.css';

export default function QuizPage() {
  const router = useRouter();
  const { filename } = router.query;

  const [quizData, setQuizData] = useState(null);

  // sessionStorage에서 quiz 데이터 가져오기
  useEffect(() => {
    const storedQuiz = sessionStorage.getItem('quizData');
    if (storedQuiz) {
      setQuizData(JSON.parse(storedQuiz));
    }
  }, []);

  return (
    <div className={styles.quizPageWrapper}>
      {quizData ? (
        <QuizUI quizData={quizData} />
      ) : (
        <div>퀴즈 데이터를 불러오지 못했습니다.</div>
      )}
    </div>
  );
}
