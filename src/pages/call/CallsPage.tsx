import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { useEffect } from "react";
import { fetchFriendsThunk } from "../../store/friends/friendsThunk";
import { Outlet } from "react-router-dom";
import { CallsSidebar } from "../../components/sidebars/calls/CallsSidebar";

export const CallsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFriendsThunk());
  }, []);

  return (
    <>
      <CallsSidebar />
      <Outlet />
    </>
  )
}