import React, { Suspense, lazy } from 'react';
import PrivateRoute from "./components/PrivateRoute";
import Loading from '@/components/Loading';


const pages = import.meta.glob("./pages/**/*.tsx");
const protectedPrefixes = ["/admin", "/usuario", "/subir"];

const routeConfigs = Object.entries(pages)
  .map(([filePath, importer]) => {

    const routePath = filePath
      .replace("./pages", "")
      .replace(/\.tsx$/, "")
      .replace(/\/page$/, "")
      .replace(/\[(\w+)\]/g, ":$1");


    const LazyPage = lazy(importer as () => Promise<{ default: React.ComponentType<unknown> }>);


    const pageElement = (
      <>
        <Loading />
        <LazyPage />
      </>
    );


    const element = protectedPrefixes.some(pref => routePath.startsWith(pref))
      ? <PrivateRoute>{pageElement}</PrivateRoute>
      : pageElement;

    return {
      path: routePath || "/",
      element
    };
  })
  .filter(Boolean);


if (pages["./pages/404.tsx"]) {
  const NotFound = lazy(pages["./pages/404.tsx"] as () => Promise<{ default: React.ComponentType<unknown> }>);
  routeConfigs.push({
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    )
  });
}

export default routeConfigs;