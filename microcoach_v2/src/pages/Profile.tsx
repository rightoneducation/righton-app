import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AppContentRow from '../components/AppContentRow';
import { UserRole, isAdmin } from '../api';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from '../hooks/context/useMicroCoachDataContext';
import { useMisconceptions } from '../hooks/useMisconceptions';
import {
  EditPictureChip,
  ProfileAction,
  ProfileAvatar,
  ProfileForm,
  ProfileHeading,
  ProfileLayout,
  ProfileRolePill,
  ProfileSectionTitle,
  ProfileSidebar,
  ScreenSizeProps,
} from '../lib/styledcomponents/ProfileStyledComponents';
import {
  FieldRow,
  SignUpField,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

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
  const { t } = useTranslation();
  const theme = useTheme();
  const { userProfile } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const { session } = useMisconceptions();
  const isReady = useAllReady(useI18nReady());

  const displayName = userProfile?.teacherName ?? session.teacher.displayName;
  const [first = '', last = ''] = displayName.split(' ');

  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({ first, last });
  const [showFieldErrors, setShowFieldErrors] = React.useState(false);

  if (!isReady) return null;

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

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space8}px`, pb: `${theme.sizing.space12}px` }}
    >
      <ProfileHeading sx={{ mb: `${theme.sizing.space6}px` }}>
        {t('profile.title')}
      </ProfileHeading>

      <ProfileLayout screenSize={screenSize}>
        <ProfileSidebar screenSize={screenSize}>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: '40px',
            }}
          >
            {displayName}
          </Typography>
          <Typography variant="rubikSubBold" sx={{ fontWeight: 400 }}>
            {displayName}
          </Typography>
          <ProfileRolePill>
            {isAdmin(userProfile) ? 'Admin' : 'Teacher'}
          </ProfileRolePill>

          <ProfileAvatar>
            <PersonOutlineIcon sx={{ fontSize: 56 }} />
          </ProfileAvatar>
          {/* No upload frame in this design, so the control is present but
              inert rather than opening something invented. */}
          <EditPictureChip disableElevation disabled>
            {t('profile.editPicture')}
          </EditPictureChip>

          <Stack sx={{ width: '100%' }}>
            <Typography variant="headingSm">
              {t('profile.accountCreated')}
            </Typography>
            <Typography variant="rubikBody">11/18/2023</Typography>
          </Stack>
          <Stack sx={{ width: '100%' }}>
            <Typography variant="headingSm">
              {t('profile.uploadsMade')}
            </Typography>
            <Typography variant="rubikBody">16</Typography>
          </Stack>
        </ProfileSidebar>

        <ProfileForm screenSize={screenSize}>
          <ProfileSectionTitle>{t('profile.sectionTitle')}</ProfileSectionTitle>

          <FieldRow screenSize={screenSize}>
            <SignUpField
              isFilled
              readOnly={!isEditing}
              isError={showFieldErrors && !draft.first.trim()}
              inputProps={{
                'aria-label': t('profile.firstName'),
                'aria-invalid': showFieldErrors && !draft.first.trim(),
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
              isError={showFieldErrors && !draft.last.trim()}
              inputProps={{
                'aria-label': t('profile.lastName'),
                'aria-invalid': showFieldErrors && !draft.last.trim(),
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
            type="password"
            inputProps={{ 'aria-label': t('profile.password') }}
            value="*******"
          />

          {/* Inert: there is no change-password frame and no API behind it. */}
          <ProfileAction disableElevation disabled>
            {t('profile.changePassword')}
          </ProfileAction>
        </ProfileForm>
      </ProfileLayout>
    </AppContentRow>
  );
}
