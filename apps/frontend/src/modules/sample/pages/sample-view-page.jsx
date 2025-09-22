import { SampleView, SampleViewSkeleton } from '@/modules/sample/components/sample-view';
import { useSample } from '@/modules/sample/hooks/use-sample';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router';

export function SampleViewPage() {
  const { id } = useParams();

  const { viewSample, data, isFailed, isPending, isSuccess } = useSample();

  useEffect(() => {
    function fetchSample(id) {
      viewSample(id);
    }

    fetchSample(id);
  }, [id, viewSample]);

  if (isFailed) {
    return <>Failed to retrieve Sample</>;
  }

  if (isSuccess && data === null) {
    return <>Something went wrong</>;
  }

  return (
    <>
      <header>
        <Link to="/sample" className="underline">
          All Samples
        </Link>
      </header>
      {isPending && <SampleViewSkeleton />}
      {isSuccess && <SampleView id={id} name={data?.name} createdAt={data?.createdAt} />}
    </>
  );
}
