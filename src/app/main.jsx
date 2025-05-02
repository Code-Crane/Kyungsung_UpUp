// 메인 페이지에 들어갈 요소 정리

'use client'; // Next.js APP router 환경에서 해당 파일이 클라이언트 컴포넌트임을 명시하는 선언

import { useRouter } from 'next/navigation'; // 라우터 import(이동 로직 추가)
import { useState } from 'react';
import UploadModal from './components/UploadModal';
import styles from './main.module.css';

export default function Main() {
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter(); // 라우터 객체 생성

    // 폴더명과 폴더설명을 파일리스트 페이지로 전달
    const goToFileList = (folder) => {
      const query = new URLSearchParams({
        name: folder.name,                        // 폴더이름
        description: folder.description || '',     // 폴더설명
        file: folder.filename || '',            // 파일이름 (file.name추출)
      }).toString();
    
      router.push(`/filelist?${query}`);
    };
    
    

  /*폴더가 4개 이하로 생성되었다면 폴더 생성 버튼을 출력*/
  const handleCreateFolder = (newFolder) => {
    if (folders.length < 4) {
      setFolders([...folders, newFolder]);
    }
  };

  /*메인 페이지 중앙의 파일 업로드 영역*/
  return (
    <div className={styles.wrapper}>
      <img src="/image/upup.png" alt="배경" className={styles.backgroundImage} />

      <div className={styles.contentBox}>
        <h2 className={styles.title}>파일을 업로드 해주세요!</h2>

        <div className={styles.grid}>

          {folders.map((folder, index) => (
  <div
    key={index}
    className={styles.folder}
    onClick={() => goToFileList(folder)}
    style={{ cursor: 'pointer' }}
  >
    <img src="/image/folder-icon.png" alt="폴더" />
    <p>{folder.name}</p>
  </div>
))}
          {/*'+'버튼 영역*/}  
          {folders.length < 4 && (
            <div className={styles.addButton} onClick={() => setShowModal(true)}>
              +
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateFolder}
        />
      )}
    </div>
  );
}


