// 메인 페이지입니다.

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UploadModal from "../components/FileUploader";
import styles from "../styles/main.module.css";
import Footer from "../components/Footer";

export default function Main() {
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const router = useRouter();

  // 로컬스토리지에서 폴더 정보 로드
  useEffect(() => {
    const stored = localStorage.getItem("folders");
    if (stored) {
      try {
        setFolders(JSON.parse(stored));
      } catch {
        setFolders([]);
      }
    }
  }, []);

  // 폴더 목록이 변경될 때마다 저장
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  const goToFileList = (folder) => {
    const query = new URLSearchParams({
      name: folder.name,
      description: folder.description || "",
      file: folder.filename || "",
    }).toString();
    router.push(`/FileList?${query}`);
  };

  const handleCreateFolder = (newFolder) => {
    if (folders.length < 9) {
      const folderWithDate = {
        ...newFolder,
        createdAt: new Date().toISOString(),
      };
      setFolders([...folders, folderWithDate]);
    }
  };

  const handlePreview = (e, folder) => {
    e.stopPropagation();
    setSelectedFolder(folder);
    setShowPreviewModal(true);
  };

  // 메인 페이지 상단 내용
  return (
    <div className={styles.wrapper}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Learning Mate</h1>
        <p className={styles.heroSubtitle}>
          다양한 학습 자료를 업로드하고 퀴즈를 풀면서 성장하세요!
        </p>
        <div className={styles.heroButtons}>
          <button
            className={styles.createButton}
            onClick={() => setShowModal(true)}
          >
            + 폴더 생성
          </button>
          {/*<button className={styles.mockButton}>내 폴더</button>*/}
        </div>
      </div>

      <div className={styles.grayBackground}>
        <div className={styles.folderHeaderOnly}>
          <h3>생성된 폴더</h3>
          <p>생성된 폴더를 확인하고 학습을 시작해보세요!</p>
        </div>

        {/*생성된 폴더의 폴더명 및 아이콘 설정*/}
        {folders.length === 0 ? (
          <div className={styles.emptyState}>
            <img
              src="/image/ks_logo2.png" // 폴더 아이콘
              alt="아직 폴더가 없습니다" // 폴더명 기본값
              className={styles.emptyImage}
            />
          </div>
        ) : (
          <div className={styles.folderSection}>
            <div
              className={`${styles.folderList} ${
                folders.length > 0 && folders.length % 12 === 0
                  ? styles["columns-4"]
                  : folders.length > 0 && folders.length % 3 === 0
                  ? styles["columns-3"]
                  : ""
              }`.trim()}
            >
              {folders.map((folder, index) => (
                <div
                  key={index}
                  className={styles.folderCard}
                  onClick={() => goToFileList(folder)}
                >
                  <h4>{folder.name}</h4>
                  <p>{folder.description || "설명이 없습니다."}</p>
                  <span>
                    생성일:{" "}
                    {folder.createdAt
                      ? new Date(folder.createdAt).toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]}
                  </span>
                  <button onClick={(e) => handlePreview(e, folder)}>
                    미리보기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateFolder}
        />
      )}

      {showPreviewModal && selectedFolder && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedFolder.name}</h2>
            <div className={styles.modalDetails}>
              <p>
                <strong>설명:</strong> {selectedFolder.description || "없음"}
              </p>
              <p>
                <strong>파일명:</strong>{" "}
                {selectedFolder.filename
                  ? selectedFolder.filename.split("_").slice(1).join("_")
                  : "없음"}
              </p>
              <p>
                <strong>생성일:</strong>{" "}
                {selectedFolder.createdAt
                  ? new Date(selectedFolder.createdAt)
                      .toISOString()
                      .split("T")[0]
                  : new Date().toISOString().split("T")[0]}
              </p>
            </div>
            <button onClick={() => setShowPreviewModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
