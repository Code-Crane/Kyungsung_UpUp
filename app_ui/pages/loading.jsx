'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/loading.module.css';

export default function LoadingPage() {
  const router = useRouter();
  const { filename, file_id } = router.query;

  const [imageIndex, setImageIndex] = useState(1);

  // 이미지 순환
  useEffect(() => {
    const imgTimer = setInterval(() => {
      setImageIndex((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(imgTimer);
  }, []);

  // file_id 기반 퀴즈 데이터 호출 후 이동
  useEffect(() => {
    if (!file_id) return;

    const fetchQuizData = async () => {
      try {
        const query = new URLSearchParams({ file_id }).toString();
        const res = await fetch(`http://3.148.139.172:8000/api/v2/quiz?${query}`);
        if (!res.ok) throw new Error('퀴즈 데이터를 불러올 수 없습니다.');

        const { quiz } = await res.json();

        // sessionStorage에 quiz 데이터 저장
        sessionStorage.setItem('quizData', JSON.stringify(quiz));

        // 짧은 로딩 후 quiz 페이지로 이동
        setTimeout(() => {
          router.push(`/quiz?file_id=${file_id}&filename=${filename}`);
        }, 1000);
      } catch (err) {
        console.error('LoadingPage fetch error:', err);
      }
    };

    fetchQuizData();
  }, [file_id, filename, router]);

  return (
    <div className={styles.loadingWrapper}>
      <h2 className={styles.loadingText}>퀴즈를 준비 중입니다...</h2>
      <p className={styles.loadingSubText}>파일 분석 중이니 잠시만 기다려 주세요.</p>
      <img
        src={`/image/loading_${imageIndex}.png`}
        alt="로딩 중..."
        className={styles.loadingImage}
      />
    </div>
  );
}
