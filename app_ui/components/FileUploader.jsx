import { useState } from 'react';
import styles from '../styles/FileUploader.module.css';
import { uploadFile } from '../utils/api'; // ✅ API 헬퍼 불러오기 (백엔드 파일 전송 URL설정 > uploadFile(formData))

export default function UploadModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('폴더 이름을 입력해주세요.');
      return;
    }

    if (!file) {
      alert('파일을 첨부해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lecture_name", name);

    try {
      const data = await uploadFile(formData); // utils/api.js의 함수 호출

      const newFolder = {
        name,
        description: desc,
        file,
        filename: data.filename,
        text: data.text,
      };

      onCreate(newFolder);
      onClose();
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("파일 업로드에 실패했습니다.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>📁 폴더를 생성합니다.</h3>

        <p style={{ textAlign: 'left' }}>폴더명</p>
        <input
          type="text"
          placeholder="폴더이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />

        <p style={{ textAlign: 'left' }}>폴더 설명</p>
        <textarea
          placeholder="설명 입력(선택)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className={`${styles.input} ${styles.description}`}
        />

        <div className={styles.fileRow}>
          <label htmlFor="fileUpload" className={styles.fileLabel}>
            파일 첨부
          </label>

          <div className={styles.fileDisplay}>
            <input
              id="fileUpload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <span className={styles.fileName}>
              {file ? file.name : ''}
            </span>
          </div>
        </div>

        <p className={styles.warning}>* 파일은 최대 30MB까지 첨부 가능합니다.</p>

        <div>
          <button onClick={handleSubmit} className={styles.button}>폴더 생성</button>
          <button onClick={onClose} className={styles.cancel}>취소</button>
        </div>
      </div>
    </div>
  );
}