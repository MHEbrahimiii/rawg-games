import Filters from '@/components/Filters';
import GamesGrid from '@/components/GamesGrid';
import Pagination from '@/components/Pagination';
import { GamesResponse, Genre, Platform } from '@/lib/types';
import { getFilters, getGames, toFaErrorMessage } from '@/lib/rawg';

async function getData(searchParams: Record<string, string | undefined>) {
  if (!process.env.RAWG_API_KEY) {
    return {
      platforms: [] as Platform[],
      genres: [] as Genre[],
      gamesData: { results: [], next: null, previous: null, count: 0 } as GamesResponse,
      error: 'API Key تنظیم نشده',
    };
  }

  try {
    const [filters, gamesData] = await Promise.all([
      getFilters(),
      getGames(searchParams),
    ]);

    return {
      platforms: filters.platforms,
      genres: filters.genres,
      gamesData,
      error: null,
    };
  } catch (error) {
    return {
      platforms: [] as Platform[],
      genres: [] as Genre[],
      gamesData: { results: [], next: null, previous: null, count: 0 } as GamesResponse,
      error: toFaErrorMessage(error),
    };
  }
}

export default async function Home(props: { searchParams: Promise<Record<string, string | undefined>> }) {
  const searchParams = await props.searchParams;
  const { platforms, genres, gamesData, error } = await getData(searchParams);
  const filtersKey = `${searchParams.search ?? ''}|${searchParams.parent_platforms ?? ''}|${searchParams.genres ?? ''}`;

  const currentPage = Number(searchParams.page ?? '1');
  const hasPrev = gamesData.previous !== null;
  const hasNext = gamesData.next !== null;

  const getHref = (pageNum: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k !== 'page' && v) params.set(k, v);
    });
    if (pageNum > 1) params.set('page', pageNum.toString());
    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  const prevHref = hasPrev ? getHref(currentPage - 1) : '/';
  const nextHref = hasNext ? getHref(currentPage + 1) : '/';

  return (
    <main className="min-h-screen bg-[var(--background)] py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-500">لیست بازی های ویدیویی</h1>

        {!process.env.RAWG_API_KEY ? (
          <p className="text-center text-xl">لطفا RAWG_API_KEY را در فایل .env.local تنظیم کنید.</p>
        ) : error ? (
          <p className="text-center text-red-500 text-xl py-20">{error}</p>
        ) : (
          <>
            <Filters key={filtersKey} platforms={platforms} genres={genres} />
            <GamesGrid games={gamesData.results} />
            <Pagination
              currentPage={currentPage}
              hasPrev={hasPrev}
              hasNext={hasNext}
              prevHref={prevHref}
              nextHref={nextHref}
            />
          </>
        )}

        <footer className="text-center mt-20 text-neutral-400 text-sm">
          Powered by <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="underline">RAWG</a>
        </footer>
      </div>
    </main>
  );
}
