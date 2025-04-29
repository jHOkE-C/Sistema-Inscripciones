import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { AuthProvider } from "./hooks/AuthProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
    return (
        <>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Toaster richColors />
                <AuthProvider>
                    <Router>
                        <Routes>
                            {routes
                                .filter((route) => route !== null)
                                .map(({ path, element }) => (
                                    <Route
                                        key={path}
                                        path={path}
                                        element={element}
                                    />
                                ))}
                        </Routes>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </>
    );
}
