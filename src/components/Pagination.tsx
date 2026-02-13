import Link from 'next/link';

interface Props {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevHref: string;
  nextHref: string;
}

export default function Pagination({ currentPage, hasPrev, hasNext, prevHref, nextHref }: Props) {
  return (
    <div className="flex justify-center items-center gap-8 mt-12 text-lg">
      {hasPrev ? (
        <Link href={prevHref} prefetch={false} className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700">
          قبلی
        </Link>
      ) : (
        <span className="px-6 py-3 text-neutral-500">قبلی</span>
      )}
      <span className="font-semibold">صفحه {currentPage}</span>
      {hasNext ? (
        <Link href={nextHref} prefetch={false} className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700">
          بعدی
        </Link>
      ) : (
        <span className="px-6 py-3 text-neutral-500">بعدی</span>
      )}
    </div>
  );
}
