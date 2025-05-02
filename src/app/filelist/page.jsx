import { Suspense } from 'react';
import FileList from './FileList';

export default function FileListPage() {
  return (
    <Suspense fallback={<div>로딩 중입니다...</div>}>
      <FileList />
    </Suspense>
  );
}