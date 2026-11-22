import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "@/pages/my/my-edit-page"; // 이걸 component에 넣어준다

// 라우트 객체 선언 - createFileRoute()가 만들어 반환 
export const Route = createFileRoute("/_auth/my/edit")({ // 이 페이지 주소는 /my/edit
  component: MyEditPage, // 위 주소로 오면 보여줄 컴포넌트
});

// 위 코드는 아래 코드와 완전히 같음!
// const makeRoute = createFileRoute("/my/edit");          // ① 주소를 넣으면 → "라우트 만드는 함수"를 돌려줌
// export const Route = makeRoute({ component: MyEditPage }); // ② 그 함수에 설정을 넣으면 → 라우트 객체 완성