import {LayoutPage, Page} from "../utils/styles";
import {Outlet} from "react-router-dom";
import {ConversationSidebar} from "../components/conversations/ConversationSidebar";
import {UserSidebar} from "../components/sidebars/UserSidebar";

export const AppPage = () => {
  return (
    <LayoutPage>
      <UserSidebar />
      <Outlet />
    </LayoutPage>
  )
}