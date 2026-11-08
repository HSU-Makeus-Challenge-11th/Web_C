import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { checkAvailability, getMemberErrorMessage, getMemberRatings, type RatingPage } from '../../api/members';
import { Pagination } from '../../components/pagination';
import { RequestError } from '../../components/request-error';

const inputClass = 'h-11 min-w-0 rounded-md border border-gray-300 bg-white px-3 text-sm';
const buttonClass = 'h-11 shrink-0 cursor-pointer rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-[#226fd1] disabled:cursor-default disabled:opacity-50';

export function MembersPage() {
  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[1120px] flex-1 py-8 sm:w-[calc(100%-48px)] sm:py-10">
      <div className="flex items-center gap-3">
        <img src="/icons/movie.svg" alt="" className="size-8" />
        <h1 className="text-2xl font-bold">회원 · 평점</h1>
      </div>
      <section aria-labelledby="member-check-heading" className="mt-8 border-y border-gray-200 py-7">
        <h2 id="member-check-heading" className="text-lg font-bold">회원 정보 확인</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-10">
          <AvailabilityField kind="nickname" label="닉네임" placeholder="닉네임 입력" />
          <AvailabilityField kind="email" label="이메일" placeholder="name@example.com" />
        </div>
      </section>
      <RatingsSection />
    </main>
  );
}

function AvailabilityField({ kind, label, placeholder }: {
  kind: 'nickname' | 'email'; label: string; placeholder: string;
}) {
  const [value, setValue] = useState('');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ message: string; tone: 'success' | 'warning' | 'error' } | null>(null);
  const currentRequest = useRef<AbortController | null>(null);
  useEffect(() => () => currentRequest.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value) return;
    currentRequest.current?.abort();
    const controller = new AbortController();
    currentRequest.current = controller;
    setPending(true);
    setResult(null);
    try {
      const { available } = await checkAvailability(kind, value, controller.signal);
      if (!controller.signal.aborted) setResult({
        message: available ? `사용 가능한 ${label}입니다.` : `이미 사용 중인 ${label}입니다.`,
        tone: available ? 'success' : 'warning',
      });
    } catch (error) {
      if (!controller.signal.aborted) setResult({ message: getMemberErrorMessage(error), tone: 'error' });
    } finally {
      if (!controller.signal.aborted) setPending(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={kind} className="text-sm font-semibold">{label}</label>
      <div className="mt-2 flex gap-2">
        <input id={kind} name={kind} type={kind === 'email' ? 'email' : 'text'}
          autoComplete={kind === 'email' ? 'email' : 'nickname'} value={value} placeholder={placeholder}
          aria-describedby={`${kind}-result`} aria-invalid={result?.tone === 'error'}
          onChange={(event) => {
            currentRequest.current?.abort();
            setValue(event.target.value);
            setPending(false);
            setResult(null);
          }} className={`${inputClass} flex-1`} />
        <button type="submit" disabled={pending || !value} className={buttonClass}>
          {pending ? '확인 중' : '중복 확인'}
        </button>
      </div>
      <p id={`${kind}-result`} aria-live="polite" className={`mt-2 min-h-5 text-sm ${
        result?.tone === 'success' ? 'text-emerald-700' : result?.tone === 'warning' ? 'text-amber-800' : 'text-red-600'
      }`}>{result?.message ?? (pending ? '확인하고 있어요.' : '\u00a0')}</p>
    </form>
  );
}

function RatingsSection() {
  const [memberInput, setMemberInput] = useState('');
  const [memberId, setMemberId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [revision, setRevision] = useState(0);
  const [inputError, setInputError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = Number(memberInput);
    if (!/^\d+$/.test(memberInput) || !Number.isSafeInteger(id) || id <= 0) {
      setInputError('회원 번호는 1 이상의 정수로 입력해 주세요.');
      return;
    }
    setInputError('');
    setMemberId(id);
    setPage(0);
    setRevision((value) => value + 1);
  }

  return (
    <section aria-labelledby="ratings-heading" className="py-8">
      <h2 id="ratings-heading" className="text-lg font-bold">회원별 평점</h2>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <form onSubmit={submit} noValidate className="w-full sm:w-auto">
          <label htmlFor="member-id" className="text-sm font-semibold">회원 번호</label>
          <div className="mt-2 flex gap-2">
            <input id="member-id" inputMode="numeric" value={memberInput} placeholder="회원 번호 입력"
              onChange={(event) => { setMemberInput(event.target.value); setInputError(''); }}
              aria-invalid={Boolean(inputError)} aria-describedby="member-id-error" className={`${inputClass} w-full sm:w-52`} />
            <button type="submit" disabled={!memberInput} className={buttonClass}>평점 조회</button>
          </div>
        </form>
        <label className="flex items-center gap-3 text-sm text-gray-600">
          페이지당
          <select aria-label="페이지 크기" value={size} onChange={(event) => { setSize(Number(event.target.value)); setPage(0); }}
            className={`${inputClass} w-24`}>
            {[1, 5, 10, 20, 50].map((count) => <option key={count} value={count}>{count}개</option>)}
          </select>
        </label>
      </div>
      <p id="member-id-error" role="alert" className="mt-2 text-sm text-red-600">{inputError}</p>
      {memberId === null ? (
        <div className="mt-6 flex min-h-56 flex-col items-center justify-center gap-3 border-y border-gray-200 text-sm text-gray-500">
          <img src="/icons/movie.svg" alt="" className="size-9 opacity-40" />
          <p>조회할 회원을 선택해 주세요.</p>
        </div>
      ) : (
        <RatingResults key={`${memberId}-${page}-${size}-${revision}`} memberId={memberId} page={page} size={size}
          onPageChange={setPage} onRetry={() => setRevision((value) => value + 1)} />
      )}
    </section>
  );
}

function RatingResults({ memberId, page, size, onPageChange, onRetry }: {
  memberId: number; page: number; size: number; onPageChange: (page: number) => void; onRetry: () => void;
}) {
  const [data, setData] = useState<RatingPage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getMemberRatings(memberId, page, size, controller.signal)
      .then((response) => { if (!controller.signal.aborted) setData(response); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setErrorMessage(getMemberErrorMessage(error)); });
    return () => controller.abort();
  }, [memberId, page, size]);

  if (errorMessage) return <div className="mt-6 min-h-56 border-y border-gray-200 py-12 text-center"><RequestError message={errorMessage} onRetry={onRetry} /></div>;
  if (!data) return <p role="status" className="mt-6 min-h-56 border-y border-gray-200 py-20 text-center text-sm text-gray-500">평점을 불러오는 중이에요.</p>;

  return (
    <div className="mt-6" aria-live="polite">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="font-semibold">회원 #{memberId} <span className="ml-2 font-normal text-gray-500">총 {data.totalItems}개의 평점</span></p>
        <span className="text-gray-500">{data.totalPages === 0 ? 0 : data.page + 1} / {data.totalPages} 페이지</span>
      </div>
      <div className="overflow-x-auto border-y border-gray-200">
        <table className="w-full min-w-[580px] table-fixed text-left text-sm">
          <caption className="sr-only">회원 {memberId}의 평점 목록</caption>
          <thead className="bg-gray-100 text-gray-600">
            <tr><th scope="col" className="w-36 px-4 py-3">영화</th><th scope="col" className="w-20 px-4 py-3">평점</th><th scope="col" className="px-4 py-3">한줄평</th><th scope="col" className="w-32 px-4 py-3">작성일</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.items.map((rating) => (
              <tr key={rating.ratingId}>
                <td className="px-4 py-5"><Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }} className="font-semibold text-brand hover:underline">영화 #{rating.movieId}</Link></td>
                <td className="px-4 py-5 font-semibold text-emerald-700">{rating.score}</td>
                <td className="break-words whitespace-pre-wrap px-4 py-5 text-gray-700">{rating.comment || '작성된 한줄평이 없어요.'}</td>
                <td className="px-4 py-5 text-gray-500"><time dateTime={rating.createdAt}>{new Date(rating.createdAt).toLocaleDateString('ko-KR')}</time></td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.items.length === 0 && <p className="py-14 text-center text-sm text-gray-500">{data.totalItems === 0 ? '아직 작성한 평점이 없어요.' : '이 페이지에는 평점이 없어요.'}</p>}
      </div>
      <Pagination currentPage={page + 1} totalPages={data.totalPages} label="평점 목록 페이지" onPageChange={(next) => onPageChange(next - 1)} />
    </div>
  );
}
