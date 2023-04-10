import { Edit } from "akar-icons";
import { UserBanner } from "../../components/settings/profile/UserBanner";
import { OverlayStyle, Page } from "../../utils/styles";
import { Button } from '../../utils/styles/button';
import { ProfileAboutSection, ProfileAboutSectionHeader, ProfileDescriptionField, ProfileEditActionBar, ProfileSection, SettingsProfileUserDetails } from "../../utils/styles/settings";
import { useContext, useEffect, useState } from "react";
import { updateUserProfile } from "../../utils/api";
import { AuthContext } from "../../utils/context/AuthContext";
import { MoonLoader } from "react-spinners";
import { UserAvatar } from "../../components/settings/profile/UserAvatar";

export const SettingsProfilePage = () => {
  const { user, updateAuthUser } = useContext(AuthContext);
  // const [bannerSource, setBannerSource] = useState(
  //   CDN_URL.BASE.concat(user?.profile?.banner || '')
  // );
  const [avatarFile, setAvatarFile] = useState<File>();
  // const [avatarSource, setAvatarSource] = useState(
  //   CDN_URL.BASE.concat(user?.profile?.avatar || '')
  // );
  const [avatarSource, setAvatarSource] = useState('https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80');
  const [avatarSourceCopy, setAvatarSourceCopy] = useState(avatarSource);
  const [bannerSource, setBannerSource] = useState(
    'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80'
  );
  const [bannerFile, setBannerFile] = useState<File>();
  const [bannerSourceCopy, setBannerSourceCopy] = useState(bannerSource);
  const [sourceCopy, setSourceCopy] = useState(bannerSource);
  const [about, setAbout] = useState(user?.profile?.about || '');
  const [ aboutCopy, setAboutCopy ] = useState<string>(about);
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAbout(user?.profile?.about || '');
  }, [user?.profile?.about]);

  // useEffect(() => {
  //   setBannerSource(CDN_URL.BASE.concat(user?.profile?.banner || ''));
  //   setBannerSourceCopy(CDN_URL.BASE.concat(user?.profile?.banner || ''));
  // }, [user?.profile?.banner]);

  const isChanged = () => aboutCopy !== about || bannerFile|| avatarFile;

  const reset = () => {
    setAboutCopy(about);
    setBannerSourceCopy(bannerSource);
    setAvatarSourceCopy(avatarSource);
    setIsEditing(false);
    setAvatarFile(undefined);
    setBannerFile(undefined);
    URL.revokeObjectURL(bannerSourceCopy);
    URL.revokeObjectURL(avatarSourceCopy);
  };

  const save = async () => {
    const formData = new FormData();
    bannerFile && formData.append('banner', bannerFile);
    avatarFile && formData.append('avatar', avatarFile);
    about !== aboutCopy && formData.append('about', aboutCopy);
    try {
      setLoading(true);
      const { data: updatedUser } = await updateUserProfile(formData);
      URL.revokeObjectURL(bannerSourceCopy);
      URL.revokeObjectURL(avatarSourceCopy);
      setBannerFile(undefined);
      setAvatarFile(undefined);
      updateAuthUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return(
    <>
    {loading && (
      <OverlayStyle>
        <MoonLoader size={40} color="#fff" />
      </OverlayStyle>
      )}
      <Page>
        <UserBanner
          bannerSource={bannerSource}
          bannerSourceCopy={bannerSourceCopy}
          setBannerSourceCopy={setBannerSourceCopy}
          setBannerFile={setBannerFile}
        />
        <ProfileSection>
          <SettingsProfileUserDetails>
          <UserAvatar
              avatarSource={avatarSource}
              avatarSourceCopy={avatarSourceCopy}
              setAvatarSourceCopy={setAvatarSourceCopy}
              setAvatarFile={setAvatarFile}
            />
            <span>@{user?.username}</span>
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
              <Button
                size="md"
                variant="secondary"
                onClick={reset}
                disabled={loading}
              >
                Reset
              </Button>
              <Button size="md" onClick={save} disabled={loading}>
                Save
              </Button>
            </div>
          </ProfileEditActionBar>
        )}
      </Page>
    </>
  )
};