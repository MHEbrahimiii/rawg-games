'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Platform, Genre } from '@/lib/types';
import { useMemo, useState } from 'react';

interface Props {
  platforms: Platform[];
  genres: Genre[];
}

function splitParam(value: string | null) {
  return value?.split(',').filter(Boolean) ?? [];
}

export default function Filters({ platforms, genres }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchFromUrl = searchParams.get('search') || '';
  const platformsFromUrl = useMemo(() => splitParam(searchParams.get('parent_platforms')), [searchParams]);
  const genresFromUrl = useMemo(() => splitParam(searchParams.get('genres')), [searchParams]);

  const [search, setSearch] = useState(searchFromUrl);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(platformsFromUrl);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(genresFromUrl);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');

    if (selectedPlatforms.length) params.set('parent_platforms', selectedPlatforms.join(','));
    else params.delete('parent_platforms');

    if (selectedGenres.length) params.set('genres', selectedGenres.join(','));
    else params.delete('genres');

    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const resetFromUrl = () => {
    setSearch(searchFromUrl);
    setSelectedPlatforms(platformsFromUrl);
    setSelectedGenres(genresFromUrl);
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-lg shadow-md mb-8">
      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="جستجوی نام بازی..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] rounded-md focus:outline-none focus:border-red-500"
        />
        <select
          multiple
          size={5}
          value={selectedPlatforms}
          onChange={(e) => setSelectedPlatforms(Array.from(e.target.selectedOptions, (o) => o.value))}
          className="px-4 py-2 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] rounded-md focus:outline-none focus:border-red-500"
        >
          {platforms.map((p) => (
            <option key={p.id} value={String(p.id)}>{p.name}</option>
          ))}
        </select>
        <select
          multiple
          size={5}
          value={selectedGenres}
          onChange={(e) => setSelectedGenres(Array.from(e.target.selectedOptions, (o) => o.value))}
          className="px-4 py-2 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] rounded-md focus:outline-none focus:border-red-500"
        >
          {genres.map((g) => (
            <option key={g.id} value={g.slug}>{g.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={applyFilters} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          اعمال فیلترها
        </button>
        <button onClick={resetFromUrl} className="px-6 py-2 bg-neutral-800 text-neutral-100 rounded-md hover:bg-neutral-700 border border-[var(--border)]">
          بازنشانی
        </button>
      </div>
    </div>
  );
}
