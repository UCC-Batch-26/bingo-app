import { Link } from 'react-router';

export function SampleListItemSkeleton() {
  return <div className="bg-gray-500 w-7/12 h-6 animate-pulse rounded-sm" />;
}

export function SampleListItem({ name, id }) {
  return (
    <div className="flex gap-2 items-center">
      {name}
      <Link to={`/sample/${id}`} className="underline text-sm">
        View
      </Link>
    </div>
  );
}
