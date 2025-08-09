'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/Filelist.module.css';
import styles from '../styles/loading.module.css';
import Footer from '../components/Footer';

export default function FileList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 정보 읽기
  const folderName = searchParams.get('name') || '폴더 이름 없음';
  const fileName = searchParams.get('file'); // null이면 생성 불가
  const description = searchParams.get('description') || '폴더 설명 없음';

  const [isLoading, setIsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(1);

  // 로딩 이미지 순환 (0.5초마다 변경) — 오버레이 표시 중에만 동작
  useEffect(() => {
    if (!isLoading) return;
    const imgTimer = setInterval(() => {
      setImageIndex((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(imgTimer);
  }, [isLoading]);

  // 파일 열기 (RESTful Path 방식)
  const handleOpenFile = async () => {
    if (!fileName) {
      alert('파일 정보가 없습니다.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://3.148.139.172:8000/api/v2/file/${fileName}`
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch {
      alert('파일 열기 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 퀴즈 생성 → 퀴즈 데이터 준비 → 퀴즈 페이지로 이동
  const handleGenerateQuiz = async () => {
    console.log('[DEBUG] 퀴즈 생성 버튼 클릭됨');
    console.log('[DEBUG] filename:', fileName);

    if (!fileName) {
      alert('퀴즈를 생성할 파일 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 1) 퀴즈 생성: file_id 확보
      const genRes = await fetch('http://3.148.139.172:8000/api/v2/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: fileName }),
      });
      console.log('[DEBUG] /generate 응답 상태:', genRes.status);

      if (!genRes.ok) {
        const text = await genRes.text();
        console.error('generate API error:', genRes.status, text);
        alert(`퀴즈 생성 API 오류: ${genRes.status}\n${text}`);
        setIsLoading(false);
        return;
      }

      const { file_id } = await genRes.json();

      // 2) 퀴즈 데이터 가져오기
      const query = new URLSearchParams({ file_id }).toString();
      const quizRes = await fetch(
        `http://3.148.139.172:8000/api/v2/quiz?${query}`
      );
      console.log('[DEBUG] /quiz 응답 상태:', quizRes.status);
      if (!quizRes.ok) {
        const text = await quizRes.text();
        console.error('quiz API error:', quizRes.status, text);
        alert(`퀴즈 로드 오류: ${quizRes.status}\n${text}`);
        setIsLoading(false);
        return;
      }

      const { quiz } = await quizRes.json();
      // 3) 퀴즈 데이터 보관 (QuizPage에서 즉시 렌더)
      sessionStorage.setItem('quizData', JSON.stringify(quiz));

      // 4) 잠깐의 텀 후 퀴즈 페이지로 이동 (오버레이는 유지한 채 전환)
      setTimeout(() => {
        router.push(`/quiz?file_id=${file_id}&filename=${fileName}`);
      }, 300);
    } catch (err) {
      console.error('[DEBUG] fetch 오류:', err);
      alert('퀴즈 생성 중 문제가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 본문 */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Learning Mate</h1>
        <p className={styles.heroSubtitle}>
          선택한 폴더의 파일을 확인하고 퀴즈를 생성해보세요!
        </p>
      </div>

      <div className={styles.grayBackground}>
        <div className={styles.folderHeaderOnly}>
          <h3>{folderName}</h3>
          <p>{description}</p>
        </div>

        <div className={styles.folderSection}>
          <div className={styles.folderCard}>
            <h4>{fileName || '파일 없음'}</h4>
            <p>{description}</p>
            <div className={styles.cardButtons}>
              <button
                className={styles.grayButton}
                onClick={handleOpenFile}
                disabled={isLoading}
              >
                {isLoading ? '로딩 중...' : '파일 열기'}
              </button>
              <button
                className={styles.yellowButton}
                onClick={handleGenerateQuiz}
                disabled={isLoading}
              >
                {isLoading ? '퀴즈 생성 중...' : '퀴즈 생성'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* 오버레이 로딩 UI */}
      {isLoading && (
        <div className={loadingStyles.loadingOverlay}>
          <h2 className={loadingStyles.loadingText}>퀴즈를 준비 중입니다...</h2>
          <p className={loadingStyles.loadingSubText}>
            파일 분석 중이니 잠시만 기다려 주세요.
          </p>
          <img
            src={`/image/loading_${imageIndex}.png`}
            alt="로딩 중..."
            className={loadingStyles.loadingImage}
          />
        </div>
      )}
    </div>
  );
}
