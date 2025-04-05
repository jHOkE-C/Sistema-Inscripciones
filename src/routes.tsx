const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes = Object.keys(pages).map((path) => {
    const routePath = path
    .replace("./pages", "")
    .replace(/\.tsx$/, "")
    .replace(/\/page$/, "")
    .replace(/\[(\w+)\]/g, ":$1");
  

    return {
        path: routePath || "/",
        component: (pages[path] as { default: React.ComponentType }).default,
    };
});
export default routes;
