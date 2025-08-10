'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../styles/Filelist.module.css';
import loadingStyles from '../styles/loading.module.css';
import Footer from '../components/Footer';

export default function FileList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 정보 읽기
  const folderName = searchParams.get('name') || '폴더 이름 없음';
  const fileName = searchParams.get('file'); // null이면 생성 불가
  const description = searchParams.get('description') || '폴더 설명 없음';

  const [isLoading, setIsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(1);

  // 로딩 이미지 순환 (0.5초마다 변경) — 오버레이 표시 중에만 동작
  useEffect(() => {
    if (!isLoading) return;
    const imgTimer = setInterval(() => {
      setImageIndex((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(imgTimer);
  }, [isLoading]);

  // 파일 열기 (RESTful Path 방식)
  const handleOpenFile = async () => {
    if (!fileName) {
      alert('파일 정보가 없습니다.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://3.148.139.172:8000/api/v2/file/${fileName}`
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch {
      alert('파일 열기 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 퀴즈 생성 → 퀴즈 데이터 준비 → 퀴즈 페이지로 이동
  const handleGenerateQuiz = async () => {
    console.log('[DEBUG] 퀴즈 생성 버튼 클릭됨');
    console.log('[DEBUG] filename:', fileName);

    if (!fileName) {
      alert('퀴즈를 생성할 파일 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 1) 퀴즈 생성: file_id 확보
      const genRes = await fetch('http://3.148.139.172:8000/api/v2/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: fileName }),
      });
      console.log('[DEBUG] /generate 응답 상태:', genRes.status);

      if (!genRes.ok) {
        const text = await genRes.text();
        console.error('generate API error:', genRes.status, text);
        alert(`퀴즈 생성 API 오류: ${genRes.status}\n${text}`);
        setIsLoading(false);
        return;
      }

      const { file_id } = await genRes.json();

      // 2) 퀴즈 데이터 가져오기
      const query = new URLSearchParams({ file_id }).toString();
      const quizRes = await fetch(
        `http://3.148.139.172:8000/api/v2/quiz?${query}`
      );
      console.log('[DEBUG] /quiz 응답 상태:', quizRes.status);
      if (!quizRes.ok) {
        const text = await quizRes.text();
        console.error('quiz API error:', quizRes.status, text);
        alert(`퀴즈 로드 오류: ${quizRes.status}\n${text}`);
        setIsLoading(false);
        return;
      }

      const { quiz } = await quizRes.json();
      // 3) 퀴즈 데이터 보관 (QuizPage에서 즉시 렌더)
      sessionStorage.setItem('quizData', JSON.stringify(quiz));

      // 4) 잠깐의 텀 후 퀴즈 페이지로 이동 (오버레이는 유지한 채 전환)
      setTimeout(() => {
        router.push(`/quiz?file_id=${file_id}&filename=${fileName}`);
      }, 300);
    } catch (err) {
      console.error('[DEBUG] fetch 오류:', err);
      alert('퀴즈 생성 중 문제가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 본문 */}
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
            <h4>{fileName || '파일 없음'}</h4>
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

      {/* 오버레이 로딩 UI - 효과는 styles의 loading.module.css에 있습니다. */}
      {isLoading && (
        <div className={loadingStyles.loadingOverlay}>
          <h2 className={loadingStyles.loadingText}>퀴즈를 준비 중입니다...</h2>
          <p className={loadingStyles.loadingSubText}>
            파일 분석 중이니 잠시만 기다려 주세요.
          </p>
          <img
            src={`/image/loading_${imageIndex}.png`}
            alt="로딩 중..."
            className={loadingStyles.loadingImage}
          />
        </div>
      )}
    </div>
  );
}

// 아래는 로딩화면 테스트 코드입니다.(25/08/10)
/*
'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Filelist.module.css';
import loadingStyles from '../styles/loading.module.css';
import Footer from '../components/Footer';

const API_BASE = 'http://localhost:8000/api/v2'; // 로컬 백엔드 기준

export default function FileList() {
  const router = useRouter();
  const { name, file, description, mock } = router.query;

  // URL 파라미터
  const folderName = (name ?? '폴더 이름 없음');
  const fileName = (file ?? null); // null이면 생성 불가
  const desc = (description ?? '폴더 설명 없음');
  const isMock = mock === '1';

  // 데모 섹션 표시 (원하면 .env로 제어 가능)
  const SHOW_DEMO = process.env.NEXT_PUBLIC_SHOW_DEMO === '1' || true;
  const DEMO_ITEMS = [
    { filename: 'demo_cpu.pdf', description: 'CPU/RAM 샘플 문서' },
    { filename: 'demo_network.txt', description: '네트워크 기초 노트' },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(1);

  // 오버레이 이미지 순환 (0.5초)
  useEffect(() => {
    if (!isLoading) return;
    const t = setInterval(() => setImageIndex((p) => (p % 3) + 1), 500);
    return () => clearInterval(t);
  }, [isLoading]);

  // 유틸
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const buildDummyQuiz = () => ([
    {
      question: 'CPU의 역할은 무엇인가요?',
      options: [
        { text: '연산 수행', is_correct: true },
        { text: '종이 보관', is_correct: false },
        { text: '마우스 클릭', is_correct: false },
        { text: '음악 재생', is_correct: false },
      ],
    },
    {
      question: 'RAM은 무엇을 하나요?',
      options: [
        { text: '영구 저장', is_correct: false },
        { text: '임시 저장', is_correct: true },
        { text: '프린트 출력', is_correct: false },
        { text: '네트워크 라우팅', is_correct: false },
      ],
    },
  ]);

  // 파일 열기
  const handleOpenFile = async (targetName = fileName) => {
    if (!targetName) {
      alert('파일 정보가 없습니다.');
      return;
    }
    setIsLoading(true);
    try {
      const safe = encodeURIComponent(String(targetName));
      const res = await fetch(`${API_BASE}/file/${safe}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch {
      alert('파일 열기 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 퀴즈 생성 → 퀴즈 데이터 준비 → 퀴즈 페이지로 이동
  const handleGenerateQuiz = async (targetName = fileName, forceMock = false) => {
    if (!targetName) {
      alert('퀴즈를 생성할 파일 정보가 없습니다.');
      return;
    }
    setIsLoading(true);
    try {
      // ── MOCK 모드 (URL ?mock=1 또는 데모 버튼에서 강제)
      if (forceMock || isMock) {
        await sleep(800);           // generate 대기 모사
        const fakeFileId = '99999';
        await sleep(1200);          // quiz 호출 대기 모사
        const quiz = buildDummyQuiz();
        sessionStorage.setItem('quizData', JSON.stringify(quiz));
        await sleep(300);           // 짧은 텀
        router.push(`/quiz?file_id=${fakeFileId}&filename=${encodeURIComponent(String(targetName))}`);
        return;
      }

      // 1) generate: file_id 확보
      const genRes = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: targetName }),
      });
      if (!genRes.ok) {
        const text = await genRes.text();
        alert(`퀴즈 생성 API 오류: ${genRes.status}\n${text}`);
        setIsLoading(false);
        return;
      }
      const { file_id } = await genRes.json();

      // 2) quiz 데이터 가져오기
      const q = new URLSearchParams({ file_id: String(file_id) }).toString();
      const quizRes = await fetch(`${API_BASE}/quiz?${q}`);
      if (!quizRes.ok) {
        const text = await quizRes.text();
        alert(`퀴즈 로드 오류: ${quizRes.status}\n${text}`);
        setIsLoading(false);
        return;
      }
      const { quiz } = await quizRes.json();
      sessionStorage.setItem('quizData', JSON.stringify(quiz));

      // 3) 퀴즈 페이지로 이동 (오버레이는 전환까지 보임)
      router.push(`/quiz?file_id=${file_id}&filename=${encodeURIComponent(String(targetName))}`);
    } catch (err) {
      console.error('[DEBUG] fetch 오류:', err);
      alert('퀴즈 생성 중 문제가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 상단 영역 */   /*}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Learning Mate</h1>
        <p className={styles.heroSubtitle}>
          선택한 폴더의 파일을 확인하고 퀴즈를 생성해보세요!
        </p>
      </div>

      {/* 실제 폴더/파일 카드 */   /*}
      <div className={styles.grayBackground}>
        <div className={styles.folderHeaderOnly}>
          <h3>{folderName}</h3>
          <p>{desc}</p>
        </div>

        <div className={styles.folderSection}>
          <div className={styles.folderCard}>
            <h4>{fileName || '파일 없음'}</h4>
            <p>{desc}</p>
            <div className={styles.cardButtons}>
              <button
                className={styles.grayButton}
                onClick={() => handleOpenFile(fileName)}
                disabled={isLoading}
              >
                {isLoading ? '로딩 중...' : '파일 열기'}
              </button>
              <button
                className={styles.yellowButton}
                onClick={() => handleGenerateQuiz(fileName)}
                disabled={isLoading}
              >
                {isLoading ? '퀴즈 생성 중...' : '퀴즈 생성'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {SHOW_DEMO && (
        <div className={styles.grayBackground}>
          <div className={styles.folderHeaderOnly}>
            <h3>테스트 폴더</h3>
            <p>로컬 더미 데이터로 흐름 테스트</p>
          </div>

          <div className={styles.folderSection}>
            {DEMO_ITEMS.map((item) => (
              <div key={item.filename} className={styles.folderCard}>
                <h4>{item.filename}</h4>
                <p>{item.description}</p>
                <div className={styles.cardButtons}>
                  <button
                    className={styles.grayButton}
                    onClick={() => handleOpenFile(item.filename)}
                    disabled={isLoading}
                  >
                    파일 열기
                  </button>
                  <button
                    className={styles.yellowButton}
                    onClick={() => handleGenerateQuiz(item.filename, true)}
                    disabled={isLoading}
                  >
                    퀴즈 생성
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />

      {isLoading && (
        <div className={loadingStyles.loadingOverlay}>
          <h2 className={loadingStyles.loadingText}>퀴즈를 준비 중입니다...</h2>
          <p className={loadingStyles.loadingSubText}>파일 분석 중이니 잠시만 기다려 주세요.</p>
          <img
            src={`/image/loading_${imageIndex}.png`}
            alt="로딩 중..."
            className={loadingStyles.loadingImage}
          />
        </div>
      )}
    </div>
  );
}
*/