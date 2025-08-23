//현재 지정된 페이지의 렌더링을 합니다.


// 메인 페이지 렌더링
import Main from './main.jsx';

export default function Home() {
 return (
   <main>
      <Main /> {/*main.jsx파일 내용 가져오기*/}
   </main>
 );
}


// 파일리스트 페이지 렌더링(테스트)
//import FileList from './FileList.jsx';

//export default function Home() {
//  return (
//    <main>
//      <FileList />
//    </main>
//  );
//}


// 퀴즈 페이지 렌더링(테스트)
//import QuizPage from './quiz.jsx';
//export default function Home() {
//  return (
//    <main>
//      <QuizPage/>
//    </main>
//  );
//}