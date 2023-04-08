import { Edit } from "akar-icons";
import { UserBanner } from "../../components/settings/profile/UserBanner";
import { Page } from "../../utils/styles";
import { Button } from '../../utils/styles/button';
import { ProfileAboutSection, ProfileAboutSectionHeader, ProfileDescriptionField, ProfileEditActionBar, ProfileSection, SettingsProfileUserDetails } from "../../utils/styles/settings";
import { useState } from "react";
import { updateUserProfile } from "../../utils/api";

export const SettingsProfilePage = () => {
  const [bannerSource] = useState(
    'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80'
  );
  const [bannerFile, setBannerFile] = useState<File>();
  const [bannerSourceCopy, setBannerSourceCopy] = useState(bannerSource);
  const [sourceCopy, setSourceCopy] = useState(bannerSource);
  const [about] = useState('hello world');
  const [ aboutCopy, setAboutCopy ] = useState<string>(about);
  const [ isEditing, setIsEditing ] = useState<boolean>(false);

  const isChanged = () => aboutCopy !== about || bannerFile;

  const reset = () => {
    setAboutCopy(about);
    setBannerSourceCopy(bannerSource);
    setBannerFile(undefined);
    URL.revokeObjectURL(bannerSourceCopy);
  };

  const save = async () => {
    const formData = new FormData();
    bannerFile && formData.append('banner', bannerFile);
    about !== aboutCopy && formData.append('about', aboutCopy);
    try {
      await updateUserProfile(formData);
    } catch (err) {
      console.log(err);
    }
  }

  return(
    <Page>
      <UserBanner
        bannerSource={bannerSource}
        bannerSourceCopy={bannerSourceCopy}
        setBannerSourceCopy={setBannerSourceCopy}
        setBannerFile={setBannerFile}
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
            value={aboutCopy}
            onChange={(e) => setAboutCopy(e.target.value)}
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
            <Button 
              size="md"
              onClick={save}
            >
              Save
            </Button>
          </div>
        </ProfileEditActionBar>
      )}
    </Page>
  )
};