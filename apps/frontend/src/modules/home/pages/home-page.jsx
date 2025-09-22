import { usePing } from '@/modules/home/hooks/use-ping';
import { useEffect } from 'react';
import { Link } from 'react-router';

export function HomePage() {
  const { ping, status } = usePing();

  useEffect(() => {
    ping();
  }, [ping]);

  return (
    <div className="grid gap-2 container mx-auto">
      <div className="text-4xl text-center">This is the Home Page</div>
      <div className="text-center">Backend Connection: {status}</div>
      <Link to="/sample" className="underline mt-10 text-center">
        Go to Sample Page
      </Link>
    </div>
  );
}
