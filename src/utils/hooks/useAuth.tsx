import { useContext, useEffect, useState } from "react";
import { User } from "../types";
import { AuthContext } from "../context/AuthContext";
import { getAuthUser } from "../api";

function useAuth () {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const { updateAuthUser } = useContext(AuthContext);
  const controller = new AbortController();

  useEffect(() => {
    getAuthUser()
      .then(({ data }) => {
        setUser(data);
        updateAuthUser(data);
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

export default useAuth;