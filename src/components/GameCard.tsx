import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/types';

export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/game/${game.id}`} prefetch={false}>
        <div className="relative h-48 bg-neutral-900">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{game.name}</h3>
          <p className="text-sm text-neutral-300">امتیاز: {game.rating}/5</p>
          <p className="text-sm text-neutral-300">انتشار: {game.released || 'نامشخص'}</p>
        </div>
      </Link>
    </div>
  );
}
