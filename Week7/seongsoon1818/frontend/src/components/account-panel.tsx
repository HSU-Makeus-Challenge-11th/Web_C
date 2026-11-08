import type { ReactNode } from "react";

export function AccountPanel({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 sm:py-16">
      <section aria-labelledby="account-title" className="rounded-xl border border-gray-200 bg-white p-6 sm:p-9">
        <h1 id="account-title" className="text-[28px] font-bold tracking-[-0.04em]">{title}</h1>
        <p className="mt-2 mb-8 text-sm leading-6 text-gray-600">{description}</p>
        {children}
      </section>
    </main>
  );
}
