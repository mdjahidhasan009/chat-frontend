import {Outlet, useParams} from "react-router-dom";
import { Page } from '../utils/styles';
import { ConversationSidebar } from "../components/conversation/ConversationSidebar";
import { ConversationPanel } from "../components/conversation/ConversationPanel";

export const ConversationPage = () => {
    const { id } = useParams();
    return <Page>
        <ConversationSidebar />
        {!id && <ConversationPanel />}
        <Outlet />
    </Page>
}