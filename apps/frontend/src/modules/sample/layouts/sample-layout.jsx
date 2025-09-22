import { Outlet } from 'react-router';

export function SampleLayout() {
  return (
    <div className="container mx-auto px-4 lg:px-0">
      <Outlet />
    </div>
  );
}
