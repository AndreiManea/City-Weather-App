import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { CitiesPage } from '@/features/cities/pages/CitiesPage';
import { CityEditPage } from '@/features/cities/pages/CityEditPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <CitiesPage /> },
      { path: '/cities/new', element: <CityEditPage mode="create" /> },
      { path: '/cities/:id/edit', element: <CityEditPage mode="edit" /> },
    ],
  },
]);
