import React, {FC, useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {User} from "../utils/types";
import {getAuthUser} from "../utils/api";

function useAuth () {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const controller = new AbortController();

  useEffect(() => {
    getAuthUser()
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    return () => {
      controller.abort();
    }
  }, []);

  return { user, loading };
}
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