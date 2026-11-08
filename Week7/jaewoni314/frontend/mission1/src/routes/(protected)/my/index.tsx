import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../../../pages/my/my-info-page";

// (protected) 폴더에는 로그인한 회원만 볼 수 있는 페이지를 모아 둬요.
// 괄호로 감싼 폴더(route group)는 URL에 들어가지 않아서 주소는 /my, /my/edit이에요.
// 이번 주차에는 layout과 로그인 여부에 따른 접근 제한을 만들지 않아요.
export const Route = createFileRoute("/(protected)/my/")({
  component: MyInfoPage,
});
