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

  // no data guard
  if (!quizData?.questions?.length) {
    return <div>퀴즈 데이터가 없습니다</div>;
  }

  // only first question displayed here
  const { question, options = [], explanations = [] } = quizData.questions[0];

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

        {/* 3) 헤더에 파일명 출력 */}
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
