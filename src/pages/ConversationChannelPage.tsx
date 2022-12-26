import { ConversationChannelPageStyle } from "../utils/styles";
import {useContext} from "react";
import {AuthContext} from "../utils/context/AuthContext";

export const ConversationChannelPage = () => {
    const { user } = useContext(AuthContext);
    return <ConversationChannelPageStyle>
        {user && user.email}
    </ConversationChannelPageStyle>
};