import { unstable_cache } from 'next/cache';
import { Game, GamesResponse, Genre, Platform } from './types';

const RAWG_BASE_URL = 'https://api.rawg.io/api';
const RAWG_TIMEOUT_MS = 12000;
const RAWG_RETRY_COUNT = 2;
const RAWG_RETRY_DELAY_MS = 600;

type RawgErrorCode = 'timeout' | 'rate_limit' | 'network' | 'http' | 'unknown';

export class RawgApiError extends Error {
  code: RawgErrorCode;
  status?: number;

  constructor(code: RawgErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'RawgApiError';
    this.code = code;
    this.status = status;
  }
}

function getApiKey() {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    throw new RawgApiError('unknown', 'RAWG_API_KEY is not configured');
  }
  return key;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(url: string, revalidateSeconds: number): Promise<T> {
  for (let attempt = 1; attempt <= RAWG_RETRY_COUNT; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RAWG_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        next: { revalidate: revalidateSeconds },
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new RawgApiError('rate_limit', 'RAWG rate limit', res.status);
        }
        throw new RawgApiError('http', `RAWG HTTP ${res.status}`, res.status);
      }

      return (await res.json()) as T;
    } catch (error) {
      if (error instanceof RawgApiError) {
        throw error;
      }

      const isTimeout = error instanceof Error && error.name === 'AbortError';
      const isNetwork = error instanceof TypeError;

      if (!isTimeout && !isNetwork) {
        throw new RawgApiError('unknown', 'Unexpected RAWG error');
      }

      if (attempt === RAWG_RETRY_COUNT) {
        if (isTimeout) {
          throw new RawgApiError('timeout', 'RAWG timeout');
        }
        throw new RawgApiError('network', 'RAWG network failure');
      }

      await delay(RAWG_RETRY_DELAY_MS * attempt);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new RawgApiError('unknown', 'RAWG fetch failed');
}

const getFiltersCached = unstable_cache(
  async (): Promise<{ platforms: Platform[]; genres: Genre[] }> => {
    const key = getApiKey();
    const [platformsData, genresData] = await Promise.all([
      fetchJson<{ results?: Platform[] }>(`${RAWG_BASE_URL}/platforms/lists/parents?key=${key}`, 86400),
      fetchJson<{ results?: Genre[] }>(`${RAWG_BASE_URL}/genres?key=${key}`, 86400),
    ]);

    return {
      platforms: platformsData.results ?? [],
      genres: genresData.results ?? [],
    };
  },
  ['rawg-filters'],
  { revalidate: 86400 }
);

export async function getFilters() {
  return getFiltersCached();
}

export async function getGames(searchParams: Record<string, string | undefined>): Promise<GamesResponse> {
  const key = getApiKey();
  const page = searchParams.page ?? '1';

  const gamesParams = new URLSearchParams({
    key,
    page_size: '20',
    ordering: '-rating',
    page,
    ...(searchParams.search ? { search: searchParams.search } : {}),
    ...(searchParams.parent_platforms ? { parent_platforms: searchParams.parent_platforms } : {}),
    ...(searchParams.genres ? { genres: searchParams.genres } : {}),
  });

  return fetchJson<GamesResponse>(`${RAWG_BASE_URL}/games?${gamesParams.toString()}`, 600);
}

export async function getGameById(id: string): Promise<Game | null> {
  const key = getApiKey();
  return fetchJson<Game>(`${RAWG_BASE_URL}/games/${id}?key=${key}`, 3600);
}

export function toFaErrorMessage(error: unknown): string {
  if (error instanceof RawgApiError) {
    if (error.code === 'timeout') {
      return 'زمان پاسخ API طولانی شد. VPN را امتحان کنید یا کمی بعد دوباره تلاش کنید.';
    }
    if (error.code === 'rate_limit') {
      return 'تعداد درخواست ها از حد مجاز RAWG عبور کرده است (429). چند دقیقه بعد دوباره تلاش کنید.';
    }
    if (error.code === 'network') {
      return 'ارتباط شبکه با RAWG برقرار نشد. VPN یا DNS را بررسی کنید.';
    }
    if (error.code === 'http') {
      return 'دریافت داده از RAWG با خطا مواجه شد. لطفا کمی بعد دوباره تلاش کنید.';
    }
  }
  return 'خطا در اتصال به API. VPN را امتحان کنید یا بعدا دوباره تلاش کنید.';
}
