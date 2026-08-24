import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  MenuItem,
  useTheme,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IUserProfile, CloudFrontDistributionUrl } from '@righton/networking';
import Adpic from '../images/@.svg';
import OwnerCard from '../components/profile/OwnerCard';
import UserProfileImageUploadModal from '../components/modal/UserProfileImageUploadModal';
import ModalBackground from '../components/modal/ModalBackground';
import { TextContainerStyled } from '../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  UserProfileGridContainer,
  UserProfileGridItem,
  UserProfileMainContainer,
  TitleText,
  UsernameTextContainer,
  SubHeadingText,
  BodyText,
  SubHeadingTextLight,
  UserInfoContainer,
  UserInfoItemContainer,
  ImageContainer,
  ImagePlaceHolder,
  IdImageWrapper,
  IdImageOverlay,
  ImageText,
  UploadImagesContainer,
  UsernameInputContainer,
  TitleField,
} from '../lib/styledcomponents/UserProfileStyledComponents';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../hooks/context/useCentralDataContext';
import { ButtonType } from '../components/button/ButtonModels';
import CentralButton from '../components/button/Button';
import { ScreenSize } from '../lib/CentralModels';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import ConfirmPasswordUpdateModal from '../components/modal/ConfirmPasswordUpdateModal';
import NoticeModal from '../components/modal/NoticeModal';
import { TITLE_PLACEHOLDER, normalizeTitle } from './SignUp';

// mirrors getMissingRequiredFields in SignUp.tsx: the edit flow must not let a
// profile reach a state that signup would have rejected. Title is absent from
// both by design -- it is optional everywhere.
const getMissingProfileFields = (profile: IUserProfile): string[] => {
  const missing: string[] = [];
  if ((profile.firstName ?? '').trim().length === 0) missing.push('First Name');
  if ((profile.lastName ?? '').trim().length === 0) missing.push('Last Name');
  if (profile.userName.trim().length === 0) missing.push('Username');
  return missing;
};

interface UserProfileProps {
  screenSize: ScreenSize;
  handleLogOut: () => void;
}

export default function UserProfile({
  screenSize,
  handleLogOut,
}: UserProfileProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isEditInformationHighlight, setEditInformationHighlight] =
    useState(true);

  const [isEditInformation, setIsEditInformation] = useState(false);

  const buttonChangePassword = ButtonType.CHANGEPASSWORD;
  const [isChangePassword, setIsChangePassword] = useState(true);

  // password input field
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleClickShowPassword = () => setIsShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const [draftUserProfile, setDraftUserProfile] = useState<IUserProfile>(
    centralData.userProfile,
  );
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  const buttonTypeUpload = ButtonType.UPLOAD;
  const [isUploadFrontEnabled, setIsUploadFrontEnabled] = useState(true);
  const [isUploadBackEnabled, setIsUploadBackEnabled] = useState(true);

  const [isImageUploadVisible, setIsImageUploadVisible] =
    useState<boolean>(true);
  const [isCloneImageChanged, setIsCloneImageChanged] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const apiClients = useTSAPIClientsContext(APIClientsContext);

  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
  const [hoveredIdSlot, setHoveredIdSlot] = useState<'front' | 'back' | null>(
    null,
  );

  // latches on a failed save attempt so the inline red outlines only appear
  // once the user has actually tried to submit
  const [showFieldErrors, setShowFieldErrors] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [noticeModal, setNoticeModal] = useState<{
    header: string;
    body: string;
    items: string[];
  } | null>(null);

  useEffect(() => {
    if (centralData.userProfile) {
      setDraftUserProfile(centralData.userProfile);
    }
  }, [centralData.userProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditPicture = () => {
    setIsModalOpen(true);
  };

  const handleEditInformation = () => {
    setIsEditInformation(true);
    setEditInformationHighlight(false);
  };

  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  };

  const handleImageSave = async (image?: File, inputUrl?: string) => {
    setIsModalOpen(false);
    try {
      const response =
        await apiClients.centralDataManager?.userProfileImageUpdate(
          draftUserProfile,
          newProfilePic,
        );
      if (response?.updatedUser) {
        centralDataDispatch({
          type: 'SET_USER_PROFILE',
          payload: response.updatedUser,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = async (
    inputImage?: File | null,
    inputUrl?: string,
  ) => {
    setIsCloneImageChanged(true);
    if (inputImage) {
      setNewProfilePic(inputImage);
      setDraftUserProfile((prev) => ({
        ...prev,
        profilePicPath: '',
      }));
    } else if (inputUrl) {
      setNewProfilePic(null);
      setDraftUserProfile((prev) => ({
        ...prev,
        profilePicPath: inputUrl,
      }));
    }
  };

  const handlePasswordModal = () => {
    setOpenPasswordModal(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOpenPasswordModal(false);
    setNoticeModal(null);
  };

  const handleGetStarted = async () => {
    const missing = getMissingProfileFields(draftUserProfile);
    if (missing.length > 0) {
      setShowFieldErrors(true);
      setNoticeModal({
        header: 'Complete Required Fields',
        body: 'These cannot be left blank:',
        items: missing,
      });
      return; // stay in edit mode so the draft is still recoverable
    }

    const trimmedUserName = draftUserProfile.userName.trim();
    setIsSaving(true);
    try {
      // only query when it actually changed -- re-saving an unchanged username
      // would otherwise collide with the user's own record
      if (trimmedUserName !== centralData.userProfile.userName) {
        const existing = await apiClients.user.getUserByUserName(
          trimmedUserName,
        );
        // the id guard still matters: a case-only change can return self
        if (existing && existing.id !== centralData.userProfile.id) {
          setShowFieldErrors(true);
          setNoticeModal({
            header: 'Username Unavailable',
            body: 'That username is already taken. Please choose a different one.',
            items: [],
          });
          setIsSaving(false);
          return;
        }
      }

      const updatedUser = {
        ...draftUserProfile,
        userName: trimmedUserName,
        firstName: (draftUserProfile.firstName ?? '').trim(),
        lastName: (draftUserProfile.lastName ?? '').trim(),
        title: normalizeTitle(draftUserProfile.title),
      };
      const response =
        await apiClients.centralDataManager?.userProfileInformationUpdate(
          updatedUser,
          centralData.userProfile,
          frontImage ?? null,
          backImage ?? null,
        );
      if (response?.updatedUser) {
        centralDataDispatch({
          type: 'SET_USER_PROFILE',
          payload: response.updatedUser,
        });
      }
      // only leave edit mode once the write has actually landed
      setFrontImage(null);
      setBackImage(null);
      setShowFieldErrors(false);
      setEditInformationHighlight(true);
      setIsEditInformation(false);
    } catch (error) {
      // this used to be a bare console.error, which made a failed save
      // indistinguishable from a successful one
      console.error(error);
      setNoticeModal({
        header: 'Could Not Save Changes',
        body:
          error instanceof Error && error.message.length > 0
            ? error.message
            : 'Something went wrong while saving your profile. Please try again.',
        items: [],
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openIdUpload = (inputId: string) => {
    const uploadInput = document.getElementById(
      inputId,
    ) as HTMLInputElement | null;
    uploadInput?.click();
  };

  const handleCancelEdit = () => {
    setDraftUserProfile(centralData.userProfile);
    setFrontImage(null);
    setBackImage(null);
    setNewProfilePic(null);
    setHoveredIdSlot(null);
    setIsEditInformation(false);
    setEditInformationHighlight(true);
    setShowFieldErrors(false);
  };

  const renderFrontImageSection = () => {
    let imageSrc = '';
    if (frontImage) {
      imageSrc = URL.createObjectURL(frontImage);
    } else if (draftUserProfile.frontIdPath) {
      imageSrc = `${CloudFrontDistributionUrl}${draftUserProfile.frontIdPath}`;
    }

    if (!imageSrc) {
      return (
        <CentralButton
          buttonType={buttonTypeUpload}
          isEnabled={isUploadFrontEnabled}
          buttonWidthOverride="38px"
          iconOnlyOverride
          onClick={() => openIdUpload('front-upload')}
        />
      );
    }

    const isOverlayVisible =
      isEditInformation &&
      (screenSize !== ScreenSize.LARGE || hoveredIdSlot === 'front');

    return (
      <IdImageWrapper
        onMouseEnter={() => setHoveredIdSlot('front')}
        onMouseLeave={() => setHoveredIdSlot(null)}
      >
        <ImagePlaceHolder src={imageSrc} alt="Front of teacher ID" />
        {isOverlayVisible && (
          <IdImageOverlay>
            <CentralButton
              buttonType={buttonTypeUpload}
              isEnabled
              buttonWidthOverride="38px"
              iconOnlyOverride
              onClick={() => openIdUpload('front-upload')}
            />
          </IdImageOverlay>
        )}
      </IdImageWrapper>
    );
  };

  const renderBackImageSection = () => {
    let imageSrc = '';
    if (backImage) {
      imageSrc = URL.createObjectURL(backImage);
    } else if (draftUserProfile.backIdPath) {
      imageSrc = `${CloudFrontDistributionUrl}${draftUserProfile.backIdPath}`;
    }

    if (!imageSrc) {
      return (
        <CentralButton
          buttonType={buttonTypeUpload}
          isEnabled={isUploadBackEnabled}
          buttonWidthOverride="38px"
          iconOnlyOverride
          onClick={() => openIdUpload('back-upload')}
        />
      );
    }

    const isOverlayVisible =
      isEditInformation &&
      (screenSize !== ScreenSize.LARGE || hoveredIdSlot === 'back');

    return (
      <IdImageWrapper
        onMouseEnter={() => setHoveredIdSlot('back')}
        onMouseLeave={() => setHoveredIdSlot(null)}
      >
        <ImagePlaceHolder src={imageSrc} alt="Back of teacher ID" />
        {isOverlayVisible && (
          <IdImageOverlay>
            <CentralButton
              buttonType={buttonTypeUpload}
              isEnabled
              buttonWidthOverride="38px"
              iconOnlyOverride
              onClick={() => openIdUpload('back-upload')}
            />
          </IdImageOverlay>
        )}
      </IdImageWrapper>
    );
  };

  return (
    <UserProfileMainContainer>
      <ConfirmPasswordUpdateModal
        isModalOpen={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
        userEmail={centralData.userProfile.email}
      />
      <UserProfileImageUploadModal
        screenSize={screenSize}
        draftUserProfile={draftUserProfile}
        newProfilePic={newProfilePic}
        isModalOpen={isModalOpen}
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseModal}
      />
      <NoticeModal
        isModalOpen={noticeModal !== null}
        header={noticeModal?.header ?? ''}
        body={noticeModal?.body ?? ''}
        items={noticeModal?.items ?? []}
        onClose={() => setNoticeModal(null)}
      />
      <ModalBackground
        isModalOpen={isModalOpen || openPasswordModal || noticeModal !== null}
        handleCloseModal={handleCloseModal}
      />
      <TitleText>My Profile</TitleText>
      <UserProfileGridContainer container wrap="nowrap">
        <Grid
          sm
          md={1}
          lg={4}
          item
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          {screenSize === ScreenSize.LARGE && (
            <Box style={{ paddingLeft: `${theme.sizing.lgPadding}px` }}>
              <OwnerCard
                screenSize={screenSize}
                draftUserProfile={centralData.userProfile}
                newProfilePic={newProfilePic}
                handleEditPicture={handleEditPicture}
                handleLogOut={handleLogOut}
              />
            </Box>
          )}
        </Grid>
        <UserProfileGridItem
          item
          sm={12}
          md={4}
          lg={4}
          screenSize={screenSize}
          style={{
            width: '100%',
            maxWidth: '672px',
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.smPadding}px`,
            paddingLeft: `${theme.sizing.lgPadding}px`,
            paddingRight: `${theme.sizing.lgPadding}px`,
          }}
        >
          {screenSize !== ScreenSize.LARGE && (
            <OwnerCard
              screenSize={screenSize}
              draftUserProfile={centralData.userProfile}
              newProfilePic={newProfilePic}
              handleEditPicture={handleEditPicture}
              handleLogOut={handleLogOut}
            />
          )}
          <UsernameTextContainer>
            <SubHeadingText>Username</SubHeadingText>
            <BodyText>( Note: email cannot be edited )</BodyText>
          </UsernameTextContainer>
          <UsernameInputContainer>
            <img src={Adpic} alt="Adpic" style={{ width: '26px' }} />
            <TextContainerStyled
              variant="outlined"
              placeholder="Username..."
              error={
                showFieldErrors && draftUserProfile.userName.trim().length === 0
              }
              value={draftUserProfile.userName}
              onChange={(event) =>
                setDraftUserProfile({
                  ...draftUserProfile,
                  userName: event.target.value,
                })
              }
              disabled={!isEditInformation}
            />
          </UsernameInputContainer>
          <SubHeadingText>Information</SubHeadingText>
          <UserInfoContainer>
            <UserInfoItemContainer>
              <TitleField
                select
                // `||` not `??`: an optional/cleared title is stored as '',
                // which matches no MenuItem and renders the select blank
                value={draftUserProfile.title || TITLE_PLACEHOLDER}
                onChange={(event) =>
                  setDraftUserProfile({
                    ...draftUserProfile,
                    title: event.target.value,
                  })
                }
                disabled={!isEditInformation}
              >
                <MenuItem value="Title...">Title...</MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Dr.">Dr.</MenuItem>
              </TitleField>
              <TextContainerStyled
                variant="outlined"
                placeholder="First Name"
                error={
                  showFieldErrors &&
                  (draftUserProfile.firstName ?? '').trim().length === 0
                }
                value={draftUserProfile.firstName}
                onChange={(event) =>
                  setDraftUserProfile({
                    ...draftUserProfile,
                    firstName: event.target.value,
                  })
                }
                disabled={!isEditInformation}
              />
              <TextContainerStyled
                variant="outlined"
                placeholder="Last Name"
                error={
                  showFieldErrors &&
                  (draftUserProfile.lastName ?? '').trim().length === 0
                }
                value={draftUserProfile.lastName}
                onChange={(event) =>
                  setDraftUserProfile({
                    ...draftUserProfile,
                    lastName: event.target.value,
                  })
                }
                disabled={!isEditInformation}
              />
            </UserInfoItemContainer>
            <TextContainerStyled
              variant="outlined"
              placeholder="School Email..."
              value={draftUserProfile.email}
              disabled
            />
            <SubHeadingTextLight>Teacher ID Image</SubHeadingTextLight>
            <UploadImagesContainer>
              <ImageContainer>
                <ImageText>Front</ImageText>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="front-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFrontImage(e.target.files[0]); // Store the selected image
                    }
                  }}
                  disabled={!isEditInformation}
                />
                {renderFrontImageSection()}
              </ImageContainer>
              <ImageContainer>
                <ImageText>Back</ImageText>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="back-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      setBackImage(e.target.files[0]); // Store the selected image
                    }
                  }}
                  disabled={!isEditInformation}
                />
                {renderBackImageSection()}
              </ImageContainer>
            </UploadImagesContainer>
          </UserInfoContainer>
          {isEditInformationHighlight ? (
            <CentralButton
              buttonType={ButtonType.EDITINFORMATION}
              isEnabled
              smallScreenOverride
              onClick={handleEditInformation}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <CentralButton
                buttonType={ButtonType.SAVE}
                isEnabled={!isSaving}
                smallScreenOverride
                onClick={handleGetStarted}
              />
              <CentralButton
                buttonType={ButtonType.CANCELEDIT}
                isEnabled
                smallScreenOverride
                onClick={handleCancelEdit}
              />
            </Box>
          )}
          <SubHeadingText>Password</SubHeadingText>
          <TextContainerStyled
            variant="outlined"
            placeholder="Password..."
            type={isShowPassword ? 'text' : 'password'}
            value={centralData.userProfile.password}
            onChange={(event) => setPassword(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      isShowPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <CentralButton
            buttonWidthOverride="211px"
            buttonType={ButtonType.CHANGEPASSWORD}
            isEnabled
            smallScreenOverride
            onClick={handlePasswordModal}
          />
        </UserProfileGridItem>
        <Grid sm md={1} lg={4} item />
      </UserProfileGridContainer>
    </UserProfileMainContainer>
  );
}
