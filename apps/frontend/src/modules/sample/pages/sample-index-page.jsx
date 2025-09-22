import { SampleList } from '@/modules/sample/components/sample-list';
import { Link } from 'react-router';

export function SampleIndexPage() {
  return (
    <div className="grid gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lead text-4xl">All Samples</h1>
        <Link to="/sample/add" className="underline">
          Add Sample
        </Link>
      </header>
      <SampleList />
      <Link to="/" className="underline mt-10 text-center">
        Go to Home Page
      </Link>
    </div>
  );
}
