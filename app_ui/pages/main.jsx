import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UploadModal from '../components/FileUploader';
import styles from '../styles/main.module.css';
import Footer from '../components/Footer';

export default function Main() {
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const goToFileList = (folder) => {
    const query = new URLSearchParams({
      name: folder.name,
      description: folder.description || '',
      file: folder.filename || '',
    }).toString();
    router.push(`/filelist?${query}`);
  };

  /* 폴더생성 버튼을 누르면 테스트용 폴더가 생성됩니다.
  const handleCreateFolder = () => {
  const testFolder = {
    name: '테스트 폴더',
    description: '설명 없이 생성된 테스트 폴더입니다.',
    filename: 'sample.pdf'
  };
  setFolders([...folders, testFolder]);
};
*/

  const handleCreateFolder = (newFolder) => {
    if (folders.length < 9) {
      setFolders([...folders, newFolder]);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 상단 텍스트 및 버튼 영역 */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Learning Mate</h1>
        <p className={styles.heroSubtitle}>다양한 학습 자료를 업로드하고 퀴즈를 풀면서 성장하세요!</p>
        <div className={styles.heroButtons}>
          <button className={styles.createButton} onClick={() => setShowModal(true)}>+ 폴더 생성</button>
          <button className={styles.mockButton}>내 폴더</button>
        </div>
      </div>

      {/* 생성된 폴더 영역 */}
      <div className={styles.grayBackground}>
  <div className={styles.folderHeaderOnly}>
    <h3>생성된 폴더</h3>
    <p>생성된 폴더를 확인하고 학습을 시작해보세요!</p>
  </div>

  {folders.length === 0 ? (
    <div className={styles.emptyState}>
      <img src="/image/ks_logo2.png" alt="아직 폴더가 없습니다" className={styles.emptyImage} />
    </div>
  ) : (
    <div className={styles.folderSection}>
      <div className={styles.folderList}>
        {folders.map((folder, index) => (
          <div key={index} className={styles.folderCard} onClick={() => goToFileList(folder)}>
            <h4>{folder.name}</h4>
            <p>{folder.description || '설명이 없습니다.'}</p>
            <span>생성일: {new Date().toISOString().split('T')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

      {/* ✅ 푸터 */}
      <Footer />

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateFolder}
        />
      )}
    </div>
  );
}