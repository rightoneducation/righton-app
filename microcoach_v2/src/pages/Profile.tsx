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
import { IAPIClients } from '../api';
import errorIcon from '../images/errorIcon.svg';
import { avatarIcons, DEFAULT_AVATAR_INDEX } from '../images/avatars';
import { UserProps } from '../hooks/useUserState';
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
interface ProfileProps extends ScreenSizeProps, UserProps {
  apiClients: IAPIClients;
}

export default function Profile({ apiClients, screenSize, user }: ProfileProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = user;
  const isReady = useAllReady(useI18nReady());

  /*
   * The signed-in profile only — no mock fallback, or an empty name would show
   * the mock teacher's and then get committed as though the user typed it.
   *
   * The two halves are stored separately, so nothing has to be split here. The
   * previous version split the display name on the first space, which was the
   * only thing keeping "Mary Jo Smith" from saving back as "Mary Smith".
   */
  const first = userProfile?.firstName || '';
  const last = userProfile?.lastName || '';
  const displayName = `${first} ${last}`.trim();

  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({ first, last });
  const [showFieldErrors, setShowFieldErrors] = React.useState(false);
  const [isShowPassword, setIsShowPassword] = React.useState(false);

  // Keeps focus on the field rather than letting mousedown move it to the
  // toggle — the same handling the sign-up form's toggle uses.
  const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  /*
   * Also wait on the profile itself. PROFILE is in PUBLIC_SCREENS, so AuthGuard
   * renders this while validateUser is still resolving — without this the page
   * paints empty fields for a beat before the real values arrive.
   *
   * Note this holds the skeleton indefinitely for a signed-out visitor, because
   * AuthGuard's LOGGEDOUT case still returns children for every screen. The
   * real fix is that case redirecting for app screens; until then a skeleton is
   * a better answer than a blank form that looks like your profile was wiped.
   */
  if (!isReady || !userProfile) {
    return <ProfileSkeleton screenSize={screenSize} />;
  }

  const startEditing = () => {
    // Re-seed from the committed profile, so a previous cancel cannot leak.
    setDraft({ first, last });
    setShowFieldErrors(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!draft.first.trim() || !draft.last.trim()) {
      // Stay in edit mode — the draft is still recoverable.
      setShowFieldErrors(true);
      return;
    }
    const firstName = draft.first.trim();
    const lastName = draft.last.trim();
    const id = userProfile?.id;
    // Only the name fields are writable: UpdateUserInput has no `classes` (it is
    // a @hasMany relation) and role is not the user's to change.
    if (id) {
      try {
        const updated = await apiClients.user.updateUser({
          id,
          firstName,
          lastName,
        });
        updateUserProfile(updated ?? { firstName, lastName });
      } catch (error) {
        // The edit still applies locally; only persistence failed.
        console.error('Could not save the profile name', error);
        updateUserProfile({ firstName, lastName });
      }
    } else {
      // No row to write to — keep the edit in state rather than dropping it.
      updateUserProfile({ firstName, lastName });
    }
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
   * Straight off the row — AppSync stamps createdAt. Falls back to an em dash
   * rather than the mock date: showing someone else's signup date as your own
   * is worse than showing nothing.
   */
  const accountCreated = userProfile?.createdAt || '';
  // timeZone is load-bearing: a date-only ISO string parses as UTC midnight,
  // which renders as the previous day in every US zone without it.
  const accountCreatedLabel = accountCreated
    ? new Intl.DateTimeFormat(i18n.language, {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(accountCreated))
    : '—';

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
              {/* No uploads count exists on the User model yet, so this is 0
                  rather than the mock figure — a real teacher should not be
                  shown someone else's stat. */}
              0
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
            value={userProfile?.email || ''}
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
