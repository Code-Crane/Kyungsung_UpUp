//메인 페이지 렌더링
import Main from '../pages/main.jsx';

export default function Home() {
  return (
    <main>
      <Main /> {/*main.jsx파일 내용 가져오기*/}
    </main>
  );
}


//퀴즈 생성 페이지 테스트 코드입니다!
//import QuizUI from '../components/QuizUI';

//const sampleQuizData = {
//  filename: '정보검색론 중간고사',
//  question: '만약 문제의 문장 길이가 다음과 같을 때 문장의 개행이 어떻게 되는지 확인해야한다면 이러한 문장 길이를 사용해야 한다. 다음 중 정보검색 시스템의 구성요소가 아닌 것은?',
//  options: [
//    { text: '색인기인 척 하지만 사실은 색인기가 아닌 색칠기였다고 한다는 고전 문학이 있다는 이야기가 있다.', is_correct: false },
//    { text: '검색기일 뻔 했지만 검색기능이 있는 홈페지이며, 해당 홈페이지에는 여러가지 기능이 있게 되는데 내용은 문제의 예시와 동일하다.', is_correct: false },
//    { text: '웹 브라우저', is_correct: true },
//    { text: '이용자 인터페이스', is_correct: false }
//  ],
//  explanations: [
//    '색인기는 핵심 구성요소입니다.',
//    '검색기는 검색 엔진의 핵심입니다.',
//    '웹 브라우저는 시스템 구성요소가 아닙니다. 따라서 정답입니다.',
//    '인터페이스는 사용자 접근에 필요한 요소입니다.'
//  ]
//};

//export default function Home() {
//  return (
//    <main>
//      <QuizUI quizData={sampleQuizData} />
//    </main>
//  );}