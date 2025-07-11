// 파일을 열 때는 파일 ID를 기반으로, 
// 백엔드에서 해당 파일을 찾아 반환하는 API 엔드포인트를 호출
// /filelist?name=컴퓨터구조론&description=수업자료&id=3&file=자료.pdf 백엔드에 파일저장시에 브라우저 정상 출력

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../styles/Filelist.module.css';
import Footer from '../components/Footer';

export default function FileList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const folderName  = searchParams.get('name')        || '폴더 이름 없음';
  const fileName    = searchParams.get('file')        || '파일 없음';
  const description = searchParams.get('description') || '폴더 설명 없음';

  const [isLoading, setIsLoading] = useState(false);

  // 1) 파일 열기: 업로드 시 받은 파일명(filename)으로 조회
  const handleOpenFile = async () => {
    if (!fileName) {
      alert('열 파일 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://3.148.139.172:8000/api/v2/file?` +
        new URLSearchParams({ filename: fileName }).toString()
      );
      if (!response.ok) throw new Error('파일 불러오기에 실패했습니다.');

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (err) {
      console.error('파일 열기 오류:', err);
      alert('파일 열기 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2) 퀴즈 생성: filename으로 generate 호출 → { quiz, file_id } 받음 → file_id로 QuizPage 이동
  const handleGenerateQuiz = async () => {
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
      if (!res.ok) throw new Error('퀴즈 생성에 실패했습니다.');

      const data = await res.json(); // { quiz: [...], file_id: 123 }
      const params = new URLSearchParams({ file_id: data.file_id.toString() });
      router.push(`/quiz?${params.toString()}`);
    } catch (err) {
      console.error('퀴즈 생성 오류:', err);
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
