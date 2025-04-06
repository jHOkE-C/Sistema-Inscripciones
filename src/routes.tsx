import PrivateRoute from "./components/PrivateRoute";

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const protectedPrefixes = ["/admin", "/usuario"];

const routes = Object.keys(pages)
    .map((path) => {
        const routePath = path
            .replace("./pages", "")
            .replace(/\.tsx$/, "")
            .replace(/\/page$/, "")
            .replace(/\[(\w+)\]/g, ":$1");

        const module = pages[path] as { default: React.ComponentType };
        const Component = module.default;
        if (!Component) return null;

        const authRequired = protectedPrefixes.some((prefix) =>
            routePath.startsWith(prefix)
        );

        const WrappedComponent = authRequired
            ? () => (
                  <PrivateRoute>
                      <Component />
                  </PrivateRoute>
              )
            : Component;

        return {
            path: routePath || "/",
            element: <WrappedComponent />,
        };
    })
    .filter(Boolean);

export default routes;
