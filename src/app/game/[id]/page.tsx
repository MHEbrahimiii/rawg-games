import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGameById } from '@/lib/rawg';

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!process.env.RAWG_API_KEY) {
    notFound();
  }

  let game = null;
  try {
    game = await getGameById(id);
  } catch {
    notFound();
  }

  if (!game || !game.id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
        <Link href="/" className="inline-block m-6 text-red-500 hover:underline">
          بازگشت به لیست
        </Link>

        {game.background_image && (
          <div className="relative h-96">
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6">{game.name}</h1>

          <div className="grid md:grid-cols-2 gap-6 text-lg">
            <div>
              <p><strong>تاریخ انتشار:</strong> {game.released || 'نامشخص'}</p>
              <p><strong>امتیاز Metacritic:</strong> {game.metacritic || 'نامشخص'}</p>
              <p><strong>پلتفرم ها:</strong> {game.parent_platforms?.map((p) => p.platform.name).join(', ') || 'نامشخص'}</p>
              <p><strong>ژانرها:</strong> {game.genres?.map((g) => g.name).join(', ') || 'نامشخص'}</p>
            </div>
          </div>

          {game.description_raw && (
            <div className="mt-8 prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">توضیحات</h2>
              <p className="whitespace-pre-line">{game.description_raw}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
