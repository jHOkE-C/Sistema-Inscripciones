import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute ()  {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
