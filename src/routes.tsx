import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

const pages = import.meta.glob('./pages/**/*.tsx');

const protectedPrefixes = ['/admin', '/usuario', '/subir'];

interface PageModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: React.ComponentType<any>;
}

const publicRoutes: RouteObject[] = [];
const protectedRoutes: RouteObject[] = [];

Object.entries(pages).forEach(([filePath, importer]) => {
  // 1. Genera el path
  const routePath = filePath
    .replace('./pages', '')
    .replace(/\.tsx$/, '')
    .replace(/\/(page|index)$/, '')
    .replace(/\[(\w+)\]/g, ':$1') || '/';

  // 2. Crea la ruta con lazy loader
  const routeDef: RouteObject = {
    path: routePath,
    lazy: async () => {
      const module = await (importer() as Promise<PageModule>);
      return { Component: module.default };
    }
  };

  // 3. Clasifica pública vs protegida
  if (protectedPrefixes.some(pref => routePath.startsWith(pref))) {
    protectedRoutes.push(routeDef);
  } else {
    publicRoutes.push(routeDef);
  }
});

// 4. Monta el router con createBrowserRouter
const router = createBrowserRouter(
  [
    ...publicRoutes,
    {
      element: <PrivateRoute />,
      children: protectedRoutes
    },

    pages['./pages/404.tsx'] && {
      path: '*',
      lazy: async () => {
        const module = await (import('./pages/404.tsx') as Promise<PageModule>);
        return { Component: module.default };
      }
    }
  ].filter(Boolean) as RouteObject[],
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
