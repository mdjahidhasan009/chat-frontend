import {Outlet, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useEffect} from "react";
import {updateType} from "../../store/selectedSlice";
import {fetchGroupsThunk} from "../../store/groupSlice";
import {Page} from "../../utils/styles";
import {ConversationSidebar} from "../../components/conversations/ConversationSidebar";
import {ConversationPanel} from "../../components/conversations/ConversationPanel";

export const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(updateType('group'));
    dispatch(fetchGroupsThunk());
  }, []);

  useEffect(() => {}, [id]);

  return (
    <Page>
      <ConversationSidebar />
      {!id && <ConversationPanel />}
      <Outlet />
    </Page>
  );
}