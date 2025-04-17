import { createBrowserRouter } from 'react-router-dom';
import {ShopDetailsPage} from './pages/shop/ShopDetailsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home Page</div>,
  },
  {
    path: '/shop/:id',
    element: <ShopDetailsPage />,
  },
  {
    path: '/shop/edit',
    element: <div>Edit Shop Page</div>,
  },
]); 