// 25.05.14 서버에서 퀴즈정보 받아와서 출력 되도록 수정

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/quiz.module.css';

export default function QuizUI({ quizData }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [graded, setGraded] = useState(false);
  const [explanationIndex, setExplanationIndex] = useState(null);
  const [feedbackImage, setFeedbackImage] = useState(null);

  /*유효성 검사 조건문*/
  if (!quizData) {
    return <div>퀴즈 데이터를 불러오는 중입니다...</div>;
  }

  const { filename, question, options, explanations } = quizData;

  const handleSelect = (idx) => {
    if (graded) return; // 채점 후에는 다른 보기 선택 불가
    setSelected(idx);
  };

  const handleGrade = () => {
    if (graded) {
      setGraded(false);
      setSelected(null);
      setExplanationIndex(null);
    } else if (selected !== null) {
      setGraded(true);
      setExplanationIndex(selected);

      const isCorrect = options[selected].is_correct;
      const imagePath = isCorrect ? '/image/KsYEE_YES.png' : '/image/KsYEE_NO.png'; // 문제 정답여부에 따른 이미지 렌더링
      setFeedbackImage(imagePath);

      // 2초 후 이미지 제거
      setTimeout(() => {
        setFeedbackImage(null);
      }, 2000);
    }
  };

  const goBackToFileList = () => {
    router.push('/filelist'); // 소문자 경로로 접근(Next.js에서는 소문자로 파일명을 지정하는 것이 안정적)
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={goBackToFileList}>
          ← 뒤로가기
        </button>

        <div className={styles.header}>{filename}</div>
        <div className={styles.questionBox}>{question}</div>

        <div className={styles.options}>
          {options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = graded && selected === idx && opt.is_correct;
            const isWrong = graded && isSelected && !opt.is_correct;

            return (
              <div
                key={idx}
                className={`${styles.option} 
                  ${isSelected ? styles.selected : ''} 
                  ${isCorrect ? styles.correct : ''} 
                  ${isWrong ? styles.incorrect : ''}`}
                onClick={() => handleSelect(idx)}
              >
                {`${idx + 1}. ${opt.text}`}
              </div>
            );
          })}
        </div>

        <button className={styles.button} onClick={handleGrade}>
          {graded ? '다시 풀기' : '채점하기'}
        </button>

        {graded && explanationIndex !== null && (
          <div className={styles.explanationBox}>
            <div className={styles.answerSummary}>
              {explanationIndex + 1}번 : {options[explanationIndex].is_correct ? '정답' : '오답'}
            </div>
            <div className={styles.explanationHeader}>(해설)</div>
            <div>{explanations[explanationIndex]}</div>
          </div>
        )}
      </div>

      {feedbackImage && (
        <div className={styles.feedbackOverlay}>
          <img src={feedbackImage} alt="정답 여부" className={styles.feedbackImage} />
        </div>
      )}
    </div>
  );
}
