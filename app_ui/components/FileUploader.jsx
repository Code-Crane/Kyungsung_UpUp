import { useState } from 'react';
import styles from '../styles/FileUploader.module.css';
import { uploadFile } from '../utils/api'; // API 헬퍼

export default function UploadModal({ onClose, onCreate }) {
  const [name, setName]         = useState('');
  const [desc, setDesc]         = useState('');
  const [file, setFile]         = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('폴더 이름을 입력해주세요.');
      return;
    }
    if (!file) {
      alert('파일을 첨부해주세요.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('30MB 이하의 파일만 업로드할 수 있습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lecture_name', name);

      // uploadFile(formData) 호출 시 다음 형식의 응답을 기대합니다:
      // {
      //   file_id: 123,
      //   filename: "uuid파일명.ext",
      //   text: "파일에서 추출된 텍스트",
      //   message: "업로드 및 저장 완료"
      // }
      const data = await uploadFile(formData);

      const newFolder = {
        name,
        description: desc,
        filename: data.filename,
        file_id: data.file_id,
        text: data.text,
      };

      onCreate(newFolder);
      onClose();
    } catch (err) {
      console.error('파일 업로드 오류:', err);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>폴더를 생성합니다.</h3>

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

        <p className={styles.warning}>
          * 파일은 최대 30MB까지 첨부 가능합니다.
        </p>

        <div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? '업로드 중…' : '폴더 생성'}
          </button>
          <button onClick={onClose} className={styles.cancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
