import { useSample } from '@/modules/sample/hooks/use-sample';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { SampleListItem, SampleListItemSkeleton } from './sample-list-item';

function SampleListSkeleton() {
  return (
    <>
      <SampleListItemSkeleton />
      <SampleListItemSkeleton />
      <SampleListItemSkeleton />
      <SampleListItemSkeleton />
      <SampleListItemSkeleton />
    </>
  );
}

export function SampleList() {
  const { data, isPending, isFailed, allSamples } = useSample();

  useEffect(() => {
    function fetchAllSamples() {
      allSamples();
    }

    fetchAllSamples();
  }, [allSamples]);

  if (isPending) {
    return <SampleListSkeleton />;
  }

  if (isFailed) {
    return (
      <div
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <span className="font-medium">Failed</span> {data}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div
        className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
        role="alert"
      >
        You haven't created any Samples yet.{' '}
        <Link to="/sample/add" className="underline">
          Add one now
        </Link>
      </div>
    );
  }

  return (
    <>
      {data.map((item) => (
        <SampleListItem name={item.name} id={item._id} key={item._id} />
      ))}
    </>
  );
}
