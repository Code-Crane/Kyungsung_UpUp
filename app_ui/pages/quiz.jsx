'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuizUI from '../components/QuizUI';
import styles from '../styles/quiz.module.css';

export default function QuizPage() {
  const router = useRouter();
  const { filename, file_id } = router.query;

  const [quizData, setQuizData] = useState(null);

  // sessionStorage에서 quiz 데이터 가져오기, 없으면 서버 요청
  useEffect(() => {
    const storedQuiz = sessionStorage.getItem('quizData');
    if (storedQuiz) {
      setQuizData(JSON.parse(storedQuiz));
      return;
    }

    if (!file_id) return;

    const fetchQuiz = async () => {
      try {
        const query = new URLSearchParams({ file_id }).toString();
        const res = await fetch(`http://3.148.139.172:8000/api/v2/quiz?${query}`);
        if (!res.ok) throw new Error();
        const { quiz } = await res.json();
        setQuizData(quiz);
        sessionStorage.setItem('quizData', JSON.stringify(quiz));
      } catch {
        console.error('퀴즈 데이터를 불러올 수 없습니다.');
      }
    };

    fetchQuiz();
  }, [file_id]);

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
