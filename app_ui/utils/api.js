export async function uploadFile(formData) {
  const res = await fetch('http://3.148.139.172:8000/api/v2/upload/', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('서버 업로드 실패');
  }

  return await res.json();
}