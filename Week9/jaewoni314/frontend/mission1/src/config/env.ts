// 브라우저 코드에서도 읽는 값이라 NEXT_PUBLIC_ 접두사를 붙였어요. (Vite의 VITE_ 접두사와 같은 역할)
// Next.js는 빌드할 때 process.env.NEXT_PUBLIC_... 자리를 실제 값으로 바꿔 넣으므로, 구조 분해 없이 이름을 그대로 적어야 해요.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("백엔드 API 주소(NEXT_PUBLIC_API_BASE_URL)가 필요해요.");
}

export const env = {
  apiBaseUrl,
};
