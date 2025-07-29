'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../styles/Filelist.module.css';
import Footer from '../components/Footer';

export default function FileList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 업로드 후 URL에는 file_id가 없고, fileName·description만 전달됨
  const folderName = searchParams.get('name') || '폴더 이름 없음';
  const fileName = searchParams.get('file');
  const description = searchParams.get('description') || '폴더 설명 없음';

  const [isLoading, setIsLoading] = useState(false);

  // 1) 파일 열기: filename 파라미터로 호출
  const handleOpenFile = async () => {
    if (!fileName) {
      alert('퀴즈를 생성할 파일 정보가 없습니다.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://3.148.139.172:8000/api/v2/file/${fileName}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch {
      alert('파일 열기 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
  console.log('[DEBUG] 퀴즈 생성 버튼 클릭됨');
  console.log('[DEBUG] filename:', fileName);

  if (!fileName) {
    alert('퀴즈를 생성할 파일 정보가 없습니다.');
    return;
  }
  setIsLoading(true);
  try {
    const res = await fetch('http://3.148.139.172:8000/api/v2/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: fileName }),
    });
    console.log(' [DEBUG] API 응답 상태:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error('generate API error:', res.status, text);
      alert(`퀴즈 생성 API 오류: ${res.status}\n${text}`);
      return;
    }

    await res.json();
    const params = new URLSearchParams({ filename: fileName });
    router.push(`/loading?${params.toString()}`);
  } catch (err) {
    console.error(' [DEBUG] fetch 오류:', err);
    alert('퀴즈 생성 중 문제가 발생했습니다.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className={styles.wrapper}>
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
            <h4>{fileName}</h4>
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
    </div>
  );
}
