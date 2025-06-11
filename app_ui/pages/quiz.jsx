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

        let transformed = data;
        if (data && data.questions && data.questions.length > 0) {
          const q = data.questions[0];
          transformed = {
            filename: fileName,
            question: q.question,
            options: Array.isArray(q.options)
              ? q.options.map((opt, idx) => ({
                  text: opt,
                  is_correct: idx + 1 === q.answer,
                }))
              : [],
            explanations: q.explanations || [],
          };
        }

        const elapsed = Date.now() - startTime;
        const remaining = 5000 - elapsed; // 최소 5초 유지

        setTimeout(() => {
          setQuizData(transformed);
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
