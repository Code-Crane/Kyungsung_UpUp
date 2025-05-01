'use client';

import { useSearchParams } from 'next/navigation'; //값을 받아오기 위한 import문문
import styles from './filelist_style.module.css';

export default function FileList() {
  const searchParams = useSearchParams();
  const folderName = searchParams.get('name') || '폴더 이름 없음';
  const fileName = searchParams.get('file') || '파일 없음';
  const description = searchParams.get('description') || '설명 없음';

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
                <button className={styles.grayButton}>파일 열기</button>
                <button className={styles.yellowButton}>퀴즈 생성</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
