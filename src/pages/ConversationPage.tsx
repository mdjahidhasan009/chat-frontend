import {Outlet, useParams} from "react-router-dom";
import { Page } from '../utils/styles';
import { ConversationSidebar } from "../components/conversations/ConversationSidebar";
import { ConversationPanel } from "../components/conversations/ConversationPanel";
import mockConversations from "../__mocks__/conversations";

export const ConversationPage = () => {
    const { id } = useParams();
    return <Page>
        <ConversationSidebar conversations={mockConversations}/>
        {!id && <ConversationPanel />}
        <Outlet />
    </Page>
}