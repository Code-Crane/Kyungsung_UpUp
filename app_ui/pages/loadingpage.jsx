'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/loading.module.css';

export default function LoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filename = searchParams.get('filename');

  // 이미지 순환 상태 (1~3)
  const [imageIndex, setImageIndex] = useState(1);

  // 이미지 순환 (0.5초마다 변경)
  useEffect(() => {
    const imgTimer = setInterval(() => {
      setImageIndex((prev) => (prev % 3) + 1);
    }, 500);

    return () => clearInterval(imgTimer);
  }, []);

  // 3초 후 QuizPage로 이동
  useEffect(() => {
    if (filename) {
      const timer = setTimeout(() => {
        router.push(`/quiz?filename=${filename}`);
       }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fileId, filename, router]);

  return (
    <div className={styles.loadingWrapper}>
      <h2 className={styles.loadingText}>퀴즈를 준비 중입니다...</h2>
      <p className={styles.loadingSubText}>파일 분석 중이니 잠시만 기다려 주세요.</p>

      {/* 0.5초마다 순환되는 이미지 */}
      <img
        src={`/image/loading_${imageIndex}.png`}
        alt="로딩 중..."
        className={styles.loadingImage}
      />
    </div>
  );
}
