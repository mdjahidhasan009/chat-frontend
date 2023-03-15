import {LayoutPage, Page} from "../utils/styles";
import {Outlet} from "react-router-dom";
import {UserSidebar} from "../components/sidebars/UserSidebar";

export const AppPage = () => {
  return (
    <LayoutPage>
      <UserSidebar />
      <Outlet />
    </LayoutPage>
  )
}