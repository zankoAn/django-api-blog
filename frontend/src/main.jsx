import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import AppRouter from './routers/router';
import './index.css';


const queryClient = new QueryClient();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={AppRouter} >
            <App tab="home" />
        </RouterProvider>
    </QueryClientProvider>
);