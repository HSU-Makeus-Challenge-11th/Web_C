import { ProtectedLayout } from "@/components/layout/protected-layout";

// 8주차 routes/(protected)/route.tsx → app/(protected)/layout.tsx
// 괄호로 감싼 폴더는 Next.js에서도 Route Group이라 URL에 들어가지 않아요. (/my, /my/edit)
// 이 폴더의 모든 페이지가 이 layout을 거치므로, 로그인 확인을 한곳에서 해요.
export default function Layout({ children }: LayoutProps<"/">) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
