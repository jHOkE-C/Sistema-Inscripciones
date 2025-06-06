import React from 'react';
import PrivateRoute from "./components/PrivateRoute";


const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });
const protectedPrefixes = ["/admin", "/usuario", "/subir"];

const routeConfigs = Object.entries(pages)
  .map(([filePath, module]) => {

    const routePath = filePath
      .replace("./pages", "")
      .replace(/\.tsx$/, "")
      .replace(/\/page$/, "")
      .replace(/\[(\w+)\]/g, ":$1");

    const Page = (module as { default: React.ComponentType<unknown> }).default;

    const pageElement = <Page />;

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
  const NotFound = (pages["./pages/404.tsx"] as { default: React.ComponentType<unknown> }).default;
  routeConfigs.push({
    path: "*",
    element: <NotFound />
  });
}

export default routeConfigs;
