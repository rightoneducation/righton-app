import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ProfileSkeleton from '../components/ProfileSkeleton';
import { UserRole } from '../api';
import errorIcon from '../images/errorIcon.svg';
import { avatarIcons, DEFAULT_AVATAR_INDEX } from '../images/avatars';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from '../hooks/context/useMicroCoachDataContext';
import { useMisconceptions } from '../hooks/useMisconceptions';
import {
  EditPictureChip,
  ProfileAction,
  ProfileAvatar,
  ProfileAvatarImage,
  ProfileForm,
  ProfileHeading,
  ProfileLayout,
  ProfileNamePill,
  ProfilePage,
  ProfileSectionTitle,
  ProfileSidebar,
  ProfileStat,
  ScreenSizeProps,
} from '../lib/styledcomponents/ProfileStyledComponents';
import {
  FieldErrorIcon,
  FieldRow,
  SignUpField,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

const NAME_ERROR_ID = 'profile-name-error';

/**
 * Account Settings.
 *
 * Borrows central_v2's UserProfile edit model: changes are made against a
 * draft copy and only committed on a valid save, so a failed save leaves the
 * work recoverable rather than discarding it. Its image upload, username
 * uniqueness check and password modal are all out of scope here — the frame
 * has none of them, and editing is scoped to the two name fields.
 */
export default function Profile({ screenSize }: ScreenSizeProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userProfile } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const { session } = useMisconceptions();
  const isReady = useAllReady(useI18nReady());

  const displayName = userProfile?.teacherName ?? session.teacher.displayName;

  /*
   * Split on the *first* space only. Destructuring the whole split would drop
   * everything past the second token, so saving "Mary Jo Smith" would write
   * back "Mary Smith".
   */
  const spaceIndex = displayName.indexOf(' ');
  const first =
    spaceIndex === -1 ? displayName : displayName.slice(0, spaceIndex);
  const last = spaceIndex === -1 ? '' : displayName.slice(spaceIndex + 1);

  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({ first, last });
  const [showFieldErrors, setShowFieldErrors] = React.useState(false);
  const [isShowPassword, setIsShowPassword] = React.useState(false);

  // Keeps focus on the field rather than letting mousedown move it to the
  // toggle — the same handling the sign-up form's toggle uses.
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  if (!isReady) return <ProfileSkeleton screenSize={screenSize} />;

  const startEditing = () => {
    // Re-seed from the committed profile, so a previous cancel cannot leak.
    setDraft({ first, last });
    setShowFieldErrors(false);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!draft.first.trim() || !draft.last.trim()) {
      // Stay in edit mode — the draft is still recoverable.
      setShowFieldErrors(true);
      return;
    }
    dispatch({
      type: 'SET_USER_PROFILE',
      payload: {
        ...userProfile,
        email: userProfile?.email ?? session.teacher.email,
        role: userProfile?.role ?? UserRole.MEMBER,
        teacherName: `${draft.first.trim()} ${draft.last.trim()}`,
      },
    });
    setShowFieldErrors(false);
    setIsEditing(false);
  };

  const isFirstInvalid = showFieldErrors && !draft.first.trim();
  const isLastInvalid = showFieldErrors && !draft.last.trim();

  /*
   * Decorative on purpose: `aria-invalid` on the input is what assistive tech
   * announces, so an icon repeating it would only add noise. It is there to
   * make the failing field findable at a glance. (Ported from SignUpRegister.)
   */
  const errorAdornment = (show: boolean) =>
    show ? (
      <InputAdornment position="end">
        <FieldErrorIcon src={errorIcon} alt="" />
      </InputAdornment>
    ) : undefined;

  /*
   * The account's own dates come from the profile once there is a real one
   * behind it; until then they come from the mocked session, the same place
   * every other value on this screen does.
   */
  const accountCreated =
    userProfile?.createdAt ?? session.teacher.accountCreated;
  // timeZone is load-bearing: a date-only ISO string parses as UTC midnight,
  // which renders as the previous day in every US zone without it.
  const accountCreatedLabel = new Intl.DateTimeFormat(i18n.language, {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(accountCreated));

  return (
    <ProfilePage screenSize={screenSize}>
      <ProfileLayout screenSize={screenSize}>
        <ProfileSidebar screenSize={screenSize}>
          {/* Wraps to two lines at 40px inside the 325 card, and a
              shrink-wrapped block left-aligns its own lines. */}
          <Typography variant="displayBold" sx={{ textAlign: 'center' }}>
            {displayName}
          </Typography>
          <ProfileNamePill>{displayName}</ProfileNamePill>

          <ProfileAvatar>
            <ProfileAvatarImage
              src={avatarIcons[DEFAULT_AVATAR_INDEX]}
              alt=""
            />
          </ProfileAvatar>
          {/* No upload frame in this design, so the control is present but
              inert rather than opening something invented. isInert rather
              than disabled: the frame paints it at full strength. */}
          <EditPictureChip isInert disableElevation aria-disabled>
            {t('profile.editPicture')}
          </EditPictureChip>

          <ProfileStat>
            <Typography variant="headingSm" sx={{ display: 'block' }}>
              {t('profile.accountCreated')}
            </Typography>
            <Typography variant="rubikBody" sx={{ display: 'block' }}>
              {accountCreatedLabel}
            </Typography>
          </ProfileStat>
          <ProfileStat>
            <Typography variant="headingSm" sx={{ display: 'block' }}>
              {t('profile.uploadsMade')}
            </Typography>
            <Typography variant="rubikBody" sx={{ display: 'block' }}>
              {session.teacher.uploadsMade}
            </Typography>
          </ProfileStat>
        </ProfileSidebar>

        <ProfileForm screenSize={screenSize}>
          {/* Figma aligns this with the top of the navy card and centres it on
              the form column, so it belongs to this column rather than sitting
              above the row. */}
          <ProfileHeading>{t('profile.title')}</ProfileHeading>

          <ProfileSectionTitle>{t('profile.sectionTitle')}</ProfileSectionTitle>

          <FieldRow screenSize={screenSize}>
            <SignUpField
              isFilled
              readOnly={!isEditing}
              isError={isFirstInvalid}
              endAdornment={errorAdornment(isFirstInvalid)}
              inputProps={{
                'aria-label': t('profile.firstName'),
                'aria-invalid': isFirstInvalid,
                'aria-describedby': isFirstInvalid ? NAME_ERROR_ID : undefined,
              }}
              value={isEditing ? draft.first : first}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  first: event.target.value,
                }))
              }
            />
            <SignUpField
              isFilled
              readOnly={!isEditing}
              isError={isLastInvalid}
              endAdornment={errorAdornment(isLastInvalid)}
              inputProps={{
                'aria-label': t('profile.lastName'),
                'aria-invalid': isLastInvalid,
                'aria-describedby': isLastInvalid ? NAME_ERROR_ID : undefined,
              }}
              value={isEditing ? draft.last : last}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  last: event.target.value,
                }))
              }
            />
          </FieldRow>

          {/* In flow rather than in reserved space, so the column does not
              hold a gap open for a message that is usually absent. */}
          {(isFirstInvalid || isLastInvalid) && (
            <Typography
              id={NAME_ERROR_ID}
              variant="rubikLabel"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke' }}
            >
              {t('profile.nameRequired')}
            </Typography>
          )}

          <Box>
            <Typography
              variant="headingSm"
              sx={{ display: 'block', color: 'designSystem.surface.black' }}
            >
              {t('profile.email')}
            </Typography>
            <Typography
              variant="rubikBody"
              sx={{ display: 'block', color: 'designSystem.surface.black' }}
            >
              {t('profile.emailNote')}
            </Typography>
          </Box>
          {/* Locked by design — the note above says so outright. */}
          <SignUpField
            isLocked
            readOnly
            inputProps={{ 'aria-label': t('profile.email') }}
            value={userProfile?.email ?? session.teacher.email}
          />

          <ProfileAction
            disableElevation
            onClick={isEditing ? handleSave : startEditing}
          >
            {t(isEditing ? 'profile.save' : 'profile.editInformation')}
          </ProfileAction>

          <Typography
            variant="headingSm"
            sx={{ color: 'designSystem.surface.black' }}
          >
            {t('profile.password')}
          </Typography>
          <SignUpField
            isFilled
            readOnly
            type={isShowPassword ? 'text' : 'password'}
            inputProps={{ 'aria-label': t('profile.password') }}
            value="*******"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="end"
                  aria-label={t(
                    isShowPassword
                      ? 'signup.hidePassword'
                      : 'signup.showPassword',
                  )}
                  onClick={() => setIsShowPassword((shown) => !shown)}
                  onMouseDown={suppressDefault}
                  onMouseUp={suppressDefault}
                  sx={{ color: 'designSystem.foreground.slateNavy' }}
                >
                  {isShowPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* Hands off to the existing reset flow, entered in-session so it
              comes back here rather than to /login. The flow is still mocked —
              it walks the steps without calling Cognito. */}
          <ProfileAction
            disableElevation
            onClick={() => navigate('/profile/password')}
          >
            {t('profile.changePassword')}
          </ProfileAction>
        </ProfileForm>
      </ProfileLayout>
    </ProfilePage>
  );
}
