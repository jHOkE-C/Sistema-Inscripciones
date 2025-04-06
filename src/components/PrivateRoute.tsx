import { useAuth } from "@/hooks/auth";
import { Navigate } from "react-router-dom";

function PrivateRoute ({ children }: { children: React.ReactNode })  {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;