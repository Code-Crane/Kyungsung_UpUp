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
  const router = useRouter(); // 라우터 사용

  const folderName = searchParams.get('name') || '폴더 이름 없음';
  const fileName = searchParams.get('file') || '파일 없음';
  const description = searchParams.get('description') || '폴더 설명 없음';
  
  const fileId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const handleOpenFile = async () => {

    if (!fileId) {
      alert('파일 ID가 없어 파일을 열 수 없습니다.');
      return;
    }

    //뷰어구현
    setIsLoading(true);
    try {
      const response = await fetch(`http://3.148.139.172:8000/api/v1/file/${filename}`);
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

  // 버튼 클릭 시, /quiz로 이동하면서, fileID, filename. folderName, dexcription을 쿼리로 받아옴
  const handleGenerateQuiz = () => {
  setShowLoading(true); // 로딩 즉시 표시

  // 2초 뒤에 퀴즈 페이지로 이동
  setTimeout(() => {
    router.push(`/quiz?file=${fileName}&id=${fileId}&name=${folderName}&description=${description}`);
  }, 2000);
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Learning Mate</h1>
        <p className={styles.heroSubtitle}>선택한 폴더의 파일을 확인하고 퀴즈를 생성해보세요!</p>
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
              <button className={styles.grayButton} onClick={handleOpenFile} disabled={isLoading}>
                {isLoading ? '로딩 중...' : '파일 열기'}
              </button>
              <button className={styles.yellowButton} onClick={handleGenerateQuiz}>
                퀴즈 생성
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer /> {/*푸터 불러오기*/}
    </div>
  );
}
