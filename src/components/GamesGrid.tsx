import GameCard from './GameCard';
import { Game } from '@/lib/types';

export default function GamesGrid({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return <p className="text-center py-20 text-xl">بازی ای با این فیلترها یافت نشد.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
