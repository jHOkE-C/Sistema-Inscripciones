import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import { AuthProvider } from "./hooks/AuthProvider";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {routes
                        .filter((route) => route !== null)
                        .map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                </Routes>
            </Router>
        </AuthProvider>
    );
}
