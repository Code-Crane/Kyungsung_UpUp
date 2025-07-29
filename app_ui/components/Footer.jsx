// components/Footer.jsx
import styles from '../styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerSection}>
          <div className={styles.footerLogoTitle}>Learning Mate</div>
          <p className={styles.footerText}>
            효율적인 학습을 위한 최고의 도구입니다. 자료를 정리하고 퀴즈를 생성하여 학습 효과를 높이세요.
          </p>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerHeading}>플랫폼</div>
          <ul className={styles.footerLinkList}>
            <li>소개</li>
            <li>기능</li>
            <li>요금제</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerHeading}>리소스</div>
          <ul className={styles.footerLinkList}>
            <li>도움말</li>
            <li>자주 묻는 질문</li>
            <li>문의하기</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerHeading}>법적 정보</div>
          <ul className={styles.footerLinkList}>
            <li>이용약관</li>
            <li>개인정보처리방침</li>
            <li>쿠키 정책</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
