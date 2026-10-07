import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog';
import ProfileSkeleton from '../components/ProfileSkeleton';
import { IAPIClients } from '../api';
import accountPatternTopLeft from '../images/accountPatternTopLeft.svg';
import accountPatternBottomRight from '../images/accountPatternBottomRight.svg';
import { IUserState } from '../hooks/useUserState';
import { useConfirmRemove } from '../hooks/useConfirmRemove';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from '../hooks/context/useMicroCoachDataContext';
import { useI18nReady } from '../hooks/readiness';
import { ScreenSize } from '../lib/MicroCoachModels';
import { schoolFromEmail } from '../lib/schools';
import {
  AvatarGroup,
  ClassList,
  ClassName,
  ClassRow,
  EditPictureChip,
  FieldPair,
  FormIntro,
  InitialsAvatar,
  LabelledField,
  PatternCorner,
  ProfileAction,
  ProfileForm,
  ProfileHeading,
  ProfileInput,
  ProfileLayout,
  ProfilePage,
  ProfileSection,
  ProfileSectionTitle,
  ProfileSidebar,
  SidebarIdentity,
  SidebarLogOut,
  SuccessBanner,
  ScreenSizeProps,
} from '../lib/styledcomponents/ProfileStyledComponents';

const NAME_ERROR_ID = 'profile-name-error';
const PASSWORD_ERROR_ID = 'profile-password-error';

// Keeps focus on the field rather than letting mousedown move it to the
// visibility toggle, as the sign-up form's toggle does.
const suppressDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
  event.preventDefault();

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isError?: boolean;
}

/** A password field with the frame's eye toggle (Account1/5). */
function PasswordField({
  label,
  value,
  onChange,
  readOnly,
  isError,
}: PasswordFieldProps) {
  const { t } = useTranslation();
  const [isShown, setIsShown] = React.useState(false);

  return (
    <ProfileInput
      type={isShown ? 'text' : 'password'}
      value={value}
      readOnly={readOnly}
      isError={isError}
      onChange={(event) => onChange?.(event.target.value)}
      inputProps={{
        'aria-label': label,
        'aria-invalid': isError,
        'aria-describedby': isError ? PASSWORD_ERROR_ID : undefined,
      }}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            size="small"
            edge="end"
            aria-label={t(isShown ? 'signup.hidePassword' : 'signup.showPassword')}
            onClick={() => setIsShown((shown) => !shown)}
            onMouseDown={suppressDefault}
            onMouseUp={suppressDefault}
            sx={{ color: 'designSystem.foreground.slateNavy' }}
          >
            {isShown ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

type PasswordError = 'REQUIRED' | 'MISMATCH' | 'WRONG_OLD' | 'INVALID' | 'LIMIT' | 'OTHER';

const PASSWORD_ERROR_KEY: Record<PasswordError, string> = {
  REQUIRED: 'profile.passwordRequired',
  MISMATCH: 'profile.passwordMismatch',
  WRONG_OLD: 'profile.passwordWrongOld',
  INVALID: 'profile.passwordInvalid',
  LIMIT: 'profile.passwordLimit',
  OTHER: 'profile.passwordError',
};

// Cognito's exception names, mapped to what the teacher can act on.
function passwordErrorFrom(error: unknown): PasswordError {
  const name = (error as { name?: string } | null)?.name;
  if (name === 'NotAuthorizedException') return 'WRONG_OLD';
  if (name === 'InvalidPasswordException' || name === 'InvalidParameterException') {
    return 'INVALID';
  }
  if (name === 'LimitExceededException' || name === 'TooManyRequestsException') {
    return 'LIMIT';
  }
  return 'OTHER';
}

interface PasswordPanelProps {
  apiClients: IAPIClients;
  onChanged: () => void;
}

/**
 * Password, changed in place (Account5): the masked field and Change Password,
 * then old / new / re-enter and Done. Cognito checks the old password and the
 * policy; only the three-filled and the match checks happen here.
 */
function PasswordPanel({ apiClients, onChanged }: PasswordPanelProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [fields, setFields] = React.useState({ old: '', next: '', confirm: '' });
  const [error, setError] = React.useState<PasswordError | null>(null);

  const setField = (key: keyof typeof fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const handleDone = async () => {
    if (!fields.old || !fields.next || !fields.confirm) {
      setError('REQUIRED');
      return;
    }
    if (fields.next !== fields.confirm) {
      setError('MISMATCH');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await apiClients.auth.awsUpdatePassword(fields.old, fields.next);
      setFields({ old: '', next: '', confirm: '' });
      setIsEditing(false);
      onChanged();
    } catch (caught) {
      console.error('Could not change the password', caught);
      setError(passwordErrorFrom(caught));
    }
    setIsSaving(false);
  };

  if (!isEditing) {
    return (
      <>
        <PasswordField label={t('profile.password')} value="*******" readOnly />
        <ProfileAction disableElevation onClick={() => setIsEditing(true)}>
          {t('profile.changePassword')}
        </ProfileAction>
      </>
    );
  }

  const isMismatch = error === 'MISMATCH';
  return (
    <>
      <LabelledField>
        <Typography variant="headingSm" sx={{ color: 'designSystem.surface.black' }}>
          {t('profile.oldPassword')}
        </Typography>
        <PasswordField
          label={t('profile.oldPassword')}
          value={fields.old}
          onChange={setField('old')}
          isError={error === 'WRONG_OLD' || (error === 'REQUIRED' && !fields.old)}
        />
      </LabelledField>
      <LabelledField>
        <Typography variant="headingSm" sx={{ color: 'designSystem.surface.black' }}>
          {t('profile.newPassword')}
        </Typography>
        <PasswordField
          label={t('profile.newPassword')}
          value={fields.next}
          onChange={setField('next')}
          isError={
            isMismatch || error === 'INVALID' || (error === 'REQUIRED' && !fields.next)
          }
        />
      </LabelledField>
      <LabelledField>
        <Typography variant="headingSm" sx={{ color: 'designSystem.surface.black' }}>
          {t('profile.confirmPassword')}
        </Typography>
        <PasswordField
          label={t('profile.confirmPassword')}
          value={fields.confirm}
          onChange={setField('confirm')}
          isError={isMismatch || (error === 'REQUIRED' && !fields.confirm)}
        />
      </LabelledField>
      {error && (
        <Typography
          id={PASSWORD_ERROR_ID}
          variant="rubikBody"
          role="alert"
          sx={{ color: 'designSystem.status.errorStroke' }}
        >
          {t(PASSWORD_ERROR_KEY[error])}
        </Typography>
      )}
      <ProfileAction
        disableElevation
        disabled={isSaving}
        aria-busy={isSaving}
        onClick={handleDone}
      >
        {isSaving ? (
          <CircularProgress size={16} color="inherit" aria-label={t('profile.saving')} />
        ) : (
          t('profile.done')
        )}
      </ProfileAction>
    </>
  );
}

/**
 * Account Settings (microcoach-assets/Account). Names are edited against a
 * draft and committed only on a valid save; email and school are locked (the
 * school comes from the email's domain). Classes can be deleted here; adding
 * them waits on design. The password changes in place.
 */
interface ProfileProps extends ScreenSizeProps {
  apiClients: IAPIClients;
  updateUserProfile: IUserState['updateUserProfile'];
  onLogOut: () => void;
}

export default function Profile({
  apiClients,
  screenSize,
  updateUserProfile,
  onLogOut,
}: ProfileProps) {
  const { t, i18n } = useTranslation();
  const isI18nReady = useI18nReady();
  const { userProfile, classrooms, selectedClassroomId } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const isLarge = screenSize === ScreenSize.LARGE;

  const first = userProfile?.firstName || '';
  const last = userProfile?.lastName || '';
  const displayName = `${first} ${last}`.trim();
  const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({ first, last });
  const [showFieldErrors, setShowFieldErrors] = React.useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = React.useState(false);
  // Google accounts have no MicroCoach password; null until known, and the
  // section shows meanwhile since most teachers sign in with email.
  const [isFederated, setIsFederated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    apiClients.auth
      .isFederatedUser()
      .then((federated) => {
        if (!cancelled) setIsFederated(federated);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [apiClients]);

  const removeClass = async (classId: string) => {
    try {
      const deleted = await apiClients.classroom.deleteClassroom(classId);
      if (!deleted) return false;
    } catch (error) {
      console.error('Could not delete the class', error);
      return false;
    }
    const remaining = classrooms.filter((classroom) => classroom.id !== classId);
    dispatch({ type: 'SET_CLASSROOMS', payload: remaining });
    if (selectedClassroomId === classId) {
      dispatch({
        type: 'SET_SELECTED_CLASSROOM_ID',
        payload: remaining[0]?.id ?? null,
      });
    }
    return true;
  };
  const remove = useConfirmRemove(removeClass);

  // AuthGuard holds this screen until the user is known, but the profile row
  // can land a beat after; the skeleton covers that rather than empty fields.
  if (!isI18nReady || !userProfile) {
    return <ProfileSkeleton screenSize={screenSize} />;
  }

  const email = userProfile.email || '';
  const school = userProfile.school || schoolFromEmail(email) || '';

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
    if (userProfile.id) {
      try {
        const updated = await apiClients.user.updateUser({
          id: userProfile.id,
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
      updateUserProfile({ firstName, lastName });
    }
    setShowFieldErrors(false);
    setIsEditing(false);
  };

  const isFirstInvalid = showFieldErrors && !draft.first.trim();
  const isLastInvalid = showFieldErrors && !draft.last.trim();

  // timeZone: the stamp is UTC, and the date should not shift a day in US zones.
  const accountCreatedLabel = userProfile.createdAt
    ? new Intl.DateTimeFormat(i18n.language, {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(userProfile.createdAt))
    : '—';

  const nameField = (
    key: 'first' | 'last',
    label: string,
    committed: string,
    isInvalid: boolean,
  ) => (
    <LabelledField>
      <Typography variant="headingSm" sx={{ color: 'designSystem.surface.black' }}>
        {label}
      </Typography>
      <ProfileInput
        readOnly={!isEditing}
        isError={isInvalid}
        value={isEditing ? draft[key] : committed}
        onChange={(event) =>
          setDraft((current) => ({ ...current, [key]: event.target.value }))
        }
        inputProps={{
          'aria-label': label,
          'aria-invalid': isInvalid,
          'aria-describedby': isInvalid ? NAME_ERROR_ID : undefined,
        }}
      />
    </LabelledField>
  );

  const lockedField = (label: string, note: string, value: string) => (
    <LabelledField>
      <Box>
        <Typography
          variant="headingSm"
          sx={{ display: 'block', color: 'designSystem.surface.black' }}
        >
          {label}
        </Typography>
        <Typography
          variant="rubikBody"
          sx={{ display: 'block', color: 'designSystem.surface.black' }}
        >
          {note}
        </Typography>
      </Box>
      <ProfileInput isLocked readOnly value={value} inputProps={{ 'aria-label': label }} />
    </LabelledField>
  );

  return (
    <ProfilePage screenSize={screenSize}>
      {isLarge && (
        <>
          <PatternCorner src={accountPatternTopLeft} alt="" aria-hidden sx={{ top: 0, left: 0 }} />
          {/* Figma: 173 from the right and 137 from the bottom of the frame. */}
          <PatternCorner
            src={accountPatternBottomRight}
            alt=""
            aria-hidden
            sx={{ right: 173, bottom: 137 }}
          />
        </>
      )}

      {isPasswordChanged && (
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <SuccessBanner role="status">
            {t('profile.passwordChanged')}
            <IconButton
              size="small"
              aria-label={t('profile.dismiss')}
              onClick={() => setIsPasswordChanged(false)}
              sx={{ color: 'designSystem.foreground.mutedGrey' }}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </SuccessBanner>
        </Box>
      )}

      <ProfileLayout screenSize={screenSize}>
        <ProfileSidebar screenSize={screenSize}>
          <SidebarIdentity>
            <AvatarGroup>
              <InitialsAvatar aria-hidden>{initials}</InitialsAvatar>
              {/* No upload frame in this design, so the control is present but
                  inert rather than opening something invented. */}
              <EditPictureChip disableElevation aria-disabled>
                {t('profile.editPicture')}
              </EditPictureChip>
            </AvatarGroup>
            <Box>
              <Typography variant="headingXl" component="h2">
                {displayName}
              </Typography>
              <Typography
                variant="labelSmBold"
                sx={{ display: 'block', color: 'designSystem.foreground.wildSand' }}
              >
                {t('profile.accountCreated')}
              </Typography>
              <Typography
                variant="buttonLabelSmLight"
                sx={{ display: 'block', color: 'designSystem.foreground.wildSand' }}
              >
                {accountCreatedLabel}
              </Typography>
            </Box>
          </SidebarIdentity>
          <SidebarLogOut
            disableElevation
            startIcon={<LogoutIcon fontSize="small" />}
            onClick={onLogOut}
          >
            {t('profile.logOut')}
          </SidebarLogOut>
        </ProfileSidebar>

        <ProfileForm screenSize={screenSize}>
          <FormIntro>
            <ProfileHeading>{t('profile.title')}</ProfileHeading>
            <ProfileSection>
              <ProfileSectionTitle>{t('profile.sectionTitle')}</ProfileSectionTitle>
              <FieldPair screenSize={screenSize}>
                {nameField('first', t('profile.firstName'), first, isFirstInvalid)}
                {nameField('last', t('profile.lastName'), last, isLastInvalid)}
              </FieldPair>
              {(isFirstInvalid || isLastInvalid) && (
                <Typography
                  id={NAME_ERROR_ID}
                  variant="rubikBody"
                  role="alert"
                  sx={{ color: 'designSystem.status.errorStroke' }}
                >
                  {t('profile.nameRequired')}
                </Typography>
              )}
              <FieldPair screenSize={screenSize}>
                {lockedField(t('profile.email'), t('profile.emailNote'), email)}
                {lockedField(t('profile.school'), t('profile.schoolNote'), school)}
              </FieldPair>
              <ProfileAction
                disableElevation
                onClick={isEditing ? handleSave : startEditing}
              >
                {t(isEditing ? 'profile.save' : 'profile.editInformation')}
              </ProfileAction>
            </ProfileSection>
          </FormIntro>

          <ProfileSection>
            <ProfileSectionTitle>{t('profile.yourClasses')}</ProfileSectionTitle>
            {classrooms.length === 0 ? (
              <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.ashyGray' }}>
                {t('profile.noClasses')}
              </Typography>
            ) : (
              <ClassList>
                {classrooms.map((classroom) => (
                  <ClassRow key={classroom.id}>
                    <ClassName>{classroom.name}</ClassName>
                    <IconButton
                      aria-label={t('profile.deleteClass', { name: classroom.name })}
                      onClick={() =>
                        remove.ask({ id: classroom.id, className: classroom.name })
                      }
                      sx={{ color: 'designSystem.surface.atlanticNavy' }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </ClassRow>
                ))}
              </ClassList>
            )}
          </ProfileSection>

          {isFederated !== true && (
            <ProfileSection>
              <ProfileSectionTitle>{t('profile.password')}</ProfileSectionTitle>
              <PasswordPanel
                apiClients={apiClients}
                onChanged={() => setIsPasswordChanged(true)}
              />
            </ProfileSection>
          )}
        </ProfileForm>
      </ProfileLayout>

      <ConfirmRemoveDialog
        className={remove.target?.className ?? null}
        isRemoving={remove.isRemoving}
        hasError={remove.hasError}
        onCancel={remove.cancel}
        onConfirm={remove.confirm}
        title={t('profile.deleteClassTitle')}
        body={t('profile.deleteClassBody', { className: remove.target?.className })}
        errorText={t('profile.deleteClassError')}
      />
    </ProfilePage>
  );
}
