import { HomePage } from '@/modules/home/pages/home-page';
import { SampleLayout } from '@/modules/sample/layouts/sample-layout';
import { SampleAddPage } from '@/modules/sample/pages/sample-add-page';
import { SampleIndexPage } from '@/modules/sample/pages/sample-index-page';
import { SampleViewPage } from '@/modules/sample/pages/sample-view-page';
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    index: true,
  },
  {
    path: '/sample',
    element: <SampleLayout />,
    children: [
      {
        path: '',
        index: true,
        element: <SampleIndexPage />,
      },
      {
        path: ':id',
        element: <SampleViewPage />,
      },
      {
        path: 'add',
        element: <SampleAddPage />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
