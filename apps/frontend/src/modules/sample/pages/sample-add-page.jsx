import { SampleForm } from '@/modules/sample/components/sample-form';
import { Link } from 'react-router';

export function SampleAddPage() {
  return (
    <div className="grid gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lead text-3xl">Add Sample</h1>
        <Link to="/sample" className="underline">
          All Samples
        </Link>
      </header>
      <SampleForm />
    </div>
  );
}
