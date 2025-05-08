// ✅ 프론트엔드 filelist.jsx 수정 코드 (로딩 표시 추가)

'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './filelist_style.module.css';

export default function FileList() {
  const searchParams = useSearchParams();
  const folderName = searchParams.get('name') || '폴더 이름 없음';
  const fileName = searchParams.get('file') || '파일 없음';
  const description = searchParams.get('description') || '설명 없음';

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenFile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://3.148.139.172:8000/file/${fileId}`); // DB에 파일저장되도록 값 수정
      if (!response.ok) {
        alert('파일 불러오기에 실패했습니다.');
        setIsLoading(false);
        return;
      }
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (err) {
      console.error('파일 열기 에러:', err);
      alert('파일 열기 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.header}>{folderName}</div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>번호</th>
              <th className={styles.th}>제목</th>
              <th className={styles.th}>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.td}>1</td>
              <td className={styles.td}>
                <strong>{fileName}</strong>
                <div style={{ fontSize: '12px', color: '#777' }}>{description}</div>
              </td>
              <td className={styles.td}>
                <button className={styles.grayButton} onClick={handleOpenFile} disabled={isLoading}>
                  {isLoading ? '로딩 중...' : '파일 열기'}
                </button>
                <button className={styles.yellowButton}>퀴즈 생성</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
