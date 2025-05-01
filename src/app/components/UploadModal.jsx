//폴더 생성 팝업창의 기능 및 스타일을 지정합니다.

'use client';

import { useState } from 'react';

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
    formData.append("file", file);              // 파일 업로드
    formData.append("lecture_name", name);      // 폴더 이름  
    try {
      //const res = await fetch("3.148.139.172:8000/upload", {   EC2 AWS 서버 주소
      // const res = await fetch("http://localhost:8000/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/`, {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error("서버 응답 실패");
      }
  
      const data = await res.json();
  
      const newFolder = {
        name,
        description: desc,
        file,           // 원본 파일
        filename: data.filename, // 백엔드에서 받은 파일 이름
        text: data.text,         // 추출된 텍스트
      };
  
      onCreate(newFolder);
      onClose();
  
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("파일 업로드에 실패했습니다.");
    }

  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: '10px' }}>📁 폴더를 생성합니다.</h3>

        <p style={{textAlign:'left'}}>폴더명</p>
        <input
          type="text" // 단일 줄 입력 필드
          placeholder="폴더이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={foldernameStyle}
        />

        <br/>

        <p style={{ textAlign: 'left' }}>폴더 설명</p>
<textarea
  placeholder="설명 입력 (선택)"
  value={desc}
  onChange={(e) => setDesc(e.target.value)}
  style={descriptionStyle}
/>

{/*파일첨부 영역*/}
<div style={fileRowStyle}>
  <label htmlFor="fileUpload" style={fileLabelStyle}>
    파일 첨부
  </label>

  <div style={fileDisplayStyle}>
    <input
      id="fileUpload"
      type="file" // 사용자가 파일을 입력했을 때 file.name얻기기
      onChange={(e) => setFile(e.target.files[0])}
      style={{ display: 'none' }}
    />
    <span style={fileNameStyle}>
      {file ? file.name : ''}
    </span>
  </div>
</div>

<p style={warningStyle}>* 파일은 최대 30MB까지 첨부 가능합니다.</p>


        <div>
          <button onClick={handleSubmit} style={buttonStyle}>폴더 생성</button>
          <button onClick={onClose} style={cancelStyle}>취소</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 999
};

// 폴더생성 팝업창 스타일
const modalStyle = {
  backgroundColor: '#fff', 
  padding: '20px', 
  borderRadius: '12px',
  width: '500px', 
  height: '450px',
  textAlign: 'center',
};

// 폴더명 입력란 스타일
const foldernameStyle = {
  width: '100%', 
  padding: '8px', 
  marginBottom: '10px', 
  borderRadius: '5px', 
  border: '1px solid #ccc'
};

// 폴더설명 입력란 스타일
const descriptionStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  height: '100px',
  resize: 'none',     // 크기 조절 제한
  lineHeight: '1.4',
  fontSize: '14px'
};


// 폴더 생성 버튼 스타일
const buttonStyle = {
  backgroundColor: '#1c64f2', 
  color: '#fff', 
  padding: '8px 16px', 
  marginRight: '10px', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer'
};

// 취소 버튼 스타일
const cancelStyle = {
  backgroundColor: '#ccc', 
  color: '#000', 
  padding: '8px 16px', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer'
};

// 라벨 + 파일명 포함한 전체 박스
const fileRowStyle = {
  display: 'flex',
  alignItems: 'stretch',
  border: '1px solid #ccc',
  borderRadius: '20px',
  marginTop: '30px',
  marginBottom: '10px',
  overflow: 'hidden',
  height: '48px',
};

// 좌측 라벨 (파일 첨부 버튼처럼 보임)
const fileLabelStyle = {
  backgroundColor: '#726e77',
  color: '#fff',
  fontWeight: 'bold',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '14px',
  whiteSpace: 'nowrap',
};

// 파일명 표시 구역 (우측 흰색 영역)
const fileDisplayStyle = {
  flex: 1,
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  padding: '0 12px',
  overflow: 'hidden'
};

// 업로드된 파일 이름 (줄이면 ... 표시)
const fileNameStyle = {
  fontSize: '14px',
  color: '#333',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

// 파일 크기 경고 문구
const warningStyle = {
  color: 'red',
  fontSize: '12px',
  textAlign: 'left',
  marginBottom: '20px',
};

