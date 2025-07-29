// QuizUI.jsx

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/quiz.module.css';

export default function QuizUI({ quizData }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에 ?filename=… 으로 넘겨준 값 우선, 없으면 quizData.filename, 없으면 '파일명 없음'
  const urlFilename = searchParams.get('filename');
  const { filename: dataFilename = '' } = quizData[0] || {};
  const displayFilename = urlFilename || dataFilename || '파일명 없음';

  // grading state
  const [selected, setSelected] = useState(null);
  const [graded, setGraded] = useState(false);
  const [explanationIndex, setExplanationIndex] = useState(null);
  const [feedbackImage, setFeedbackImage] = useState(null);

  // 문제 데이터 체크
  if (!quizData?.length) {
    return <div>퀴즈 데이터가 없습니다</div>;
  }

  // 한 문제만 표시
  const { question, options = [] } = quizData[0];

  // 선택 로직
  const handleSelect = (idx) => {
    if (graded) return;
    setSelected(idx);
  };

  // 채점 로직
  const handleGrade = () => {
    if (graded) {
      // 다시 풀기 로직
      setGraded(false);
      setSelected(null);
      setExplanationIndex(null);
    } else if (selected !== null) {
      // 채점하기 로직
      setGraded(true);
      setExplanationIndex(selected);

      const isCorrect = options[selected].is_correct;
      const imagePath = isCorrect
        ? '/image/KsYEE_YES.png'
        : '/image/KsYEE_NO.png';
      setFeedbackImage(imagePath);

      setTimeout(() => {
        setFeedbackImage(null);
      }, 2000);
    }
  };

  // 이전 페이지(파일 리스트)로 안전하게 돌아가기
  const goBackToFileList = () => {
    router.back();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button
          className={styles.backButton}
          onClick={goBackToFileList}
        >
          ← 뒤로가기
        </button>

        {/* 파일명 표시 */}
        <div className={styles.header}>{displayFilename}</div>

        {/* 문제 표시 */}
        <div className={styles.questionBox}>{question}</div>

        {/* 보기 출력 */}
        <div className={styles.options}>
          {options.length === 0 ? (
            <div className={styles.noOptions}>
              보기 문항이 없습니다.
            </div>
          ) : (
            options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect =
                graded && isSelected && opt.is_correct;
              const isWrong =
                graded && isSelected && !opt.is_correct;

              return (
                <div
                  key={idx}
                  className={[
                    styles.option,
                    isSelected && styles.selected,
                    isCorrect && styles.correct,
                    isWrong && styles.incorrect,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSelect(idx)}
                >
                  {`${idx + 1}. ${opt.text}`}
                </div>
              );
            })
          )}
        </div>

        {/* 채점 버튼 */}
        <button className={styles.button} onClick={handleGrade}>
          {graded ? '다시 풀기' : '채점하기'}
        </button>

        {/* 정답/오답 요약 (explanations 제거) */}
        {graded && explanationIndex !== null && (
          <div className={styles.explanationBox}>
            <div className={styles.answerSummary}>
              {explanationIndex + 1}번 :{' '}
              {options[explanationIndex].is_correct
                ? '정답'
                : '오답'}
            </div>
          </div>
        )}
      </div>

      {/* 정답/오답 시 피드백 이미지 */}
      {feedbackImage && (
        <div className={styles.feedbackOverlay}>
          <img
            src={feedbackImage}
            alt="정답 여부"
            className={styles.feedbackImage}
          />
        </div>
      )}
    </div>
  );
}



















// QuizUI.jsx
/*
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/quiz.module.css';

export default function QuizUI({ quizData }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1) URL에 ?filename=… 으로 넘겨준 값 우선, 없으면 quizData.filename, 없으면 '파일명 없음'
  const urlFilename = searchParams.get('filename');
  const { filename: dataFilename = '' } = quizData;
  const displayFilename = urlFilename || dataFilename || '파일명 없음';

  // grading state
  const [selected, setSelected] = useState(null);
  const [graded, setGraded] = useState(false);
  const [explanationIndex, setExplanationIndex] = useState(null);
  const [feedbackImage, setFeedbackImage] = useState(null);

  if (!quizData?.length) {
  return <div>퀴즈 데이터가 없습니다</div>;
}

const { question, options = [] } = quizData[0]; 


  // 선택 로직
  const handleSelect = (idx) => {
    if (graded) return;
    setSelected(idx);
  };

  // 채점 로직
  const handleGrade = () => {
    if (graded) {
      setGraded(false);
      setSelected(null);
      setExplanationIndex(null);
    } else if (selected !== null) {
      setGraded(true);
      setExplanationIndex(selected);

      const isCorrect = options[selected].is_correct;
      const imagePath = isCorrect
        ? '/image/KsYEE_YES.png'
        : '/image/KsYEE_NO.png';
      setFeedbackImage(imagePath);

      setTimeout(() => {
        setFeedbackImage(null);
      }, 2000);
    }
  };

  // 2) 이전 페이지(파일 리스트)로 안전하게 돌아가기
  const goBackToFileList = () => {
    router.back();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button
          className={styles.backButton}
          onClick={goBackToFileList}
        >
          ← 뒤로가기
        </button>

        {/* 3) 헤더에 파일명 출력 *//*}
        <div className={styles.header}>{displayFilename}</div>

        <div className={styles.questionBox}>{question}</div>

        <div className={styles.options}>
          {options.length === 0 ? (
            <div className={styles.noOptions}>
              보기 문항이 없습니다.
            </div>
          ) : (
            options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect =
                graded && isSelected && opt.is_correct;
              const isWrong =
                graded && isSelected && !opt.is_correct;

              return (
                <div
                  key={idx}
                  className={[
                    styles.option,
                    isSelected && styles.selected,
                    isCorrect && styles.correct,
                    isWrong && styles.incorrect,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSelect(idx)}
                >
                  {`${idx + 1}. ${opt.text}`}
                </div>
              );
            })
          )}
        </div>

        <button className={styles.button} onClick={handleGrade}>
          {graded ? '다시 풀기' : '채점하기'}
        </button>

        {graded && explanationIndex !== null && (
          <div className={styles.explanationBox}>
            <div className={styles.answerSummary}>
              {explanationIndex + 1}번 :{' '}
              {options[explanationIndex].is_correct
                ? '정답'
                : '오답'}
            </div>
            <div className={styles.explanationHeader}>
              (해설)
            </div>
            <div>
              {explanations[explanationIndex]}
            </div>
          </div>
        )}
      </div>

      {feedbackImage && (
        <div className={styles.feedbackOverlay}>
          <img
            src={feedbackImage}
            alt="정답 여부"
            className={styles.feedbackImage}
          />
        </div>
      )}
    </div>
  );
}
*/