import { Edit } from "akar-icons";
import { UserBanner } from "../../components/settings/profile/UserBanner";
import { Page } from "../../utils/styles";
import { Button } from '../../utils/styles/button';
import { ProfileAboutSection, ProfileAboutSectionHeader, ProfileDescriptionField, ProfileEditActionBar, ProfileSection, SettingsProfileUserDetails } from "../../utils/styles/settings";
import { useState } from "react";

export const SettingsProfilePage = () => {
  const [source] = useState(
    'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80'
  );
  const [sourceCopy, setSourceCopy] = useState(source);
  const [about] = useState('hello world');
  const [ editedAbout, setEditedAbout ] = useState<string>(about);
  const [ isEditing, setIsEditing ] = useState<boolean>(false);

  const isChanged = () => editedAbout !== about || source !== sourceCopy;

  const reset = () => {
    setEditedAbout(about);
    setSourceCopy(source);
    setIsEditing(false);
    URL.revokeObjectURL(sourceCopy);
  };

  return(
    <Page>
      <UserBanner
        source={source}
        sourceCopy={sourceCopy}
        setSourceCopy={setSourceCopy}
      />
      <ProfileSection>
        <SettingsProfileUserDetails>
          <div className="avatar"></div>
          <span>@username</span>
        </SettingsProfileUserDetails>
        <ProfileAboutSection>
          <ProfileAboutSectionHeader>
            <label htmlFor="about">About Me</label>
            <Edit 
              cursor="pointer"  
              strokeWidth={2} 
              size={28}
              onClick={() => setIsEditing(!isEditing)} 
            />
          </ProfileAboutSectionHeader>
          <ProfileDescriptionField
            maxLength={200}
            disabled={!isEditing}
            value={editedAbout}
            onChange={(e) => setEditedAbout(e.target.value)}
          />
        </ProfileAboutSection>
      </ProfileSection>
      {isChanged() && (
        <ProfileEditActionBar>
          <div>
            <span>You have unsaved changes</span>
          </div>
          <div className="buttons">
          <Button size="md" variant="secondary" onClick={reset}>
              Reset
            </Button>
            <Button size="md">Save</Button>
          </div>
        </ProfileEditActionBar>
      )}
    </Page>
  )
};