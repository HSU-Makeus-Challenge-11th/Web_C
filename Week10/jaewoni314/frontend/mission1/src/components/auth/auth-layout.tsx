import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  // 폼 아래 안내 문구예요. (예: 회원가입 ↔ 로그인 이동 링크)
  footer?: ReactNode;
}

// 로그인, 회원가입 화면의 제목과 폼 영역을 같은 너비와 간격으로 보여 줘요.
export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-[440px] px-6 pb-20 pt-14">
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">{title}</h1>
      <p className="mt-2 text-[15px] text-muted">{description}</p>
      <div className="mt-8">{children}</div>
      {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
    </main>
  );
}
