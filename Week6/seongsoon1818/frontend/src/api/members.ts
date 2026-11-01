export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingPage {
  items: Rating[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const baseUrl = (import.meta.env.VITE_BACKEND_API_BASE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

async function get<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
    headers: { Accept: 'application/json' },
  });
  const body = await response.json();
  if (!response.ok) {
    const message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
    throw new Error(message || `요청을 처리하지 못했어요. (${response.status})`);
  }
  return body as T;
}

export function checkAvailability(kind: 'nickname' | 'email', value: string, signal: AbortSignal) {
  return get<{ available: boolean }>(`/members/${kind}/${encodeURIComponent(value)}`, signal);
}

export function getMemberRatings(memberId: number, page: number, size: number, signal: AbortSignal) {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return get<RatingPage>(`/members/${memberId}/ratings?${query}`, signal);
}

export function getMemberErrorMessage(error: unknown): string {
  if (error instanceof TypeError || (error instanceof DOMException && error.name === 'TimeoutError')) {
    return '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.';
  }
  return error instanceof Error ? error.message : '요청을 처리하지 못했어요.';
}
