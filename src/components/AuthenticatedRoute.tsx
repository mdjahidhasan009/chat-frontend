import React, { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../utils/hooks/useAuth";

const AuthenticatedRoute: FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if(loading) {
    return <div>loading</div>
  }
  if(user) return <>{children}</>;
    return <Navigate to="/login" state={{ from: location }} replace />;
}

export default AuthenticatedRoute;