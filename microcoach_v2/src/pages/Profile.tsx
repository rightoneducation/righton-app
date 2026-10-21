import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog';
import ProfileSkeleton from '../components/ProfileSkeleton';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import accountPatternTopLeft from '../images/accountPatternTopLeft.svg';
import accountPatternBottomRight from '../images/accountPatternBottomRight.svg';
import removeIcon from '../images/removeIcon.svg';
import { IUserState } from '../hooks/useUserState';
import { useConfirmRemove } from '../hooks/useConfirmRemove';
import { useProfilePictureUrl } from '../hooks/useProfilePictureUrl';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from '../hooks/context/useMicroCoachDataContext';
import { useI18nReady } from '../hooks/readiness';
import { ScreenSize } from '../lib/MicroCoachModels';
import { schoolFromEmail } from '../lib/schools';
import {
  AvatarGroup,
  AddClassButton,
  ClassDeleteButton,
  ClassList,
  Toast,
  ToastSnackbar,
  ClassName,
  ClassRow,
  EditPictureChip,
  FieldPair,
  FormIntro,
  InitialsAvatar,
  LabelledField,
  PatternCorner,
  ProfileAction,
  ProfileTextAction,
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
  ScreenSizeProps,
} from '../lib/styledcomponents/ProfileStyledComponents';
import type { ToastTone } from '../lib/styledcomponents/ProfileStyledComponents';

const NAME_ERROR_ID = 'profile-name-error';
const PASSWORD_ERROR_ID = 'profile-password-error';
const ADD_CLASS_ERROR_ID = 'profile-add-class-error';

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
          {/* The masked field only holds a placeholder, so there is nothing to
              reveal: the frame's faded eye-off is a marker, not a toggle. */}
          {readOnly ? (
            <VisibilityOff
              fontSize="small"
              aria-hidden
              sx={{ color: 'designSystem.foreground.slateNavy', opacity: 0.6 }}
            />
          ) : (
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
          )}
        </InputAdornment>
      }
    />
  );
}

type PasswordError =
  | 'REQUIRED'
  | 'MISMATCH'
  | 'SAME'
  | 'WRONG_OLD'
  | 'INVALID'
  | 'LIMIT'
  | 'OTHER';

const PASSWORD_ERROR_KEY: Record<PasswordError, string> = {
  REQUIRED: 'profile.passwordRequired',
  MISMATCH: 'profile.passwordMismatch',
  SAME: 'profile.passwordSame',
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

// Not about any one field, so they go to the toast rather than under the form.
const TOAST_PASSWORD_ERRORS: PasswordError[] = ['LIMIT', 'OTHER'];

// The rules the reset screen lists. Cognito only enforces the length
// (passwordPolicyCharacters is empty), so they are checked here too, or the
// list would promise more than is enforced.
const PASSWORD_RULE_KEYS = ['reset.ruleLength', 'reset.ruleLetter', 'reset.ruleNumber'];
function meetsPasswordRules(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

interface PasswordPanelProps {
  apiClients: IAPIClients;
}

const EMPTY_PASSWORD_FIELDS = { old: '', next: '', confirm: '' };
// Success is a notice, not a blocker, so it closes itself; errors wait.
const SUCCESS_TOAST_MS = 6000;

/**
 * Password, changed in place (rev4 ChangePassword_1/2): the masked field and
 * Change Password, then old / new / re-enter with the rules shown up front,
 * and Save password or Cancel. Cognito checks the old password; the filled,
 * rules, same-as-old and match checks happen here first. The outcome is a
 * toast at the top of the page.
 */
function PasswordPanel({ apiClients }: PasswordPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [fields, setFields] = React.useState(EMPTY_PASSWORD_FIELDS);
  const [error, setError] = React.useState<PasswordError | null>(null);
  const [toast, setToast] = React.useState<ToastTone | null>(null);

  const setField = (key: keyof typeof fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const handleCancel = () => {
    setFields(EMPTY_PASSWORD_FIELDS);
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setToast(null);
    if (!fields.old || !fields.next || !fields.confirm) {
      setError('REQUIRED');
      return;
    }
    if (!meetsPasswordRules(fields.next)) {
      setError('INVALID');
      return;
    }
    if (fields.next === fields.old) {
      setError('SAME');
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
      setFields(EMPTY_PASSWORD_FIELDS);
      setIsEditing(false);
      setToast('success');
    } catch (caught) {
      console.error('Could not change the password', caught);
      const reason = passwordErrorFrom(caught);
      setError(reason);
      if (TOAST_PASSWORD_ERRORS.includes(reason)) setToast('error');
    }
    setIsSaving(false);
  };

  // Lives outside the form so it outlasts the collapse after a save.
  const toastSnackbar = (
    <ToastSnackbar
      open={toast !== null}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={toast === 'success' ? SUCCESS_TOAST_MS : null}
      onClose={(event, reason) => {
        if (reason !== 'clickaway') setToast(null);
      }}
    >
      <Toast tone={toast ?? 'success'} role={toast === 'error' ? 'alert' : 'status'}>
        {toast === 'error' && error
          ? t(PASSWORD_ERROR_KEY[error])
          : t('profile.passwordChanged')}
        <IconButton
          size="small"
          aria-label={t('profile.dismiss')}
          onClick={() => setToast(null)}
        >
          <CancelIcon sx={{ fontSize: 20, color: 'designSystem.foreground.disabledStroke' }} />
        </IconButton>
      </Toast>
    </ToastSnackbar>
  );

  if (!isEditing) {
    return (
      <>
        <PasswordField label={t('profile.password')} value="*******" readOnly />
        <ProfileAction disableElevation onClick={() => setIsEditing(true)}>
          {t('profile.changePassword')}
        </ProfileAction>
        {toastSnackbar}
      </>
    );
  }

  const isMismatch = error === 'MISMATCH';
  const inlineError = error && !TOAST_PASSWORD_ERRORS.includes(error) ? error : null;
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
            isMismatch ||
            error === 'INVALID' ||
            error === 'SAME' ||
            (error === 'REQUIRED' && !fields.next)
          }
        />
        <Box sx={{ color: 'designSystem.surface.ashyGray' }}>
          <Typography variant="rubikBody">{t('reset.rulesTitle')}</Typography>
          <Box component="ul" sx={{ m: 0, pl: `${theme.sizing.space4}px` }}>
            {PASSWORD_RULE_KEYS.map((key) => (
              <Typography key={key} component="li" variant="rubikBody">
                {t(key)}
              </Typography>
            ))}
          </Box>
        </Box>
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
      {inlineError && (
        <Typography
          id={PASSWORD_ERROR_ID}
          variant="rubikBody"
          role="alert"
          sx={{ color: 'designSystem.status.errorStroke' }}
        >
          {t(PASSWORD_ERROR_KEY[inlineError])}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: `${theme.sizing.space3}px` }}>
        <ProfileAction
          disableElevation
          disabled={isSaving}
          aria-busy={isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            <CircularProgress size={16} color="inherit" aria-label={t('profile.saving')} />
          ) : (
            t('profile.savePassword')
          )}
        </ProfileAction>
        <ProfileTextAction disableElevation disabled={isSaving} onClick={handleCancel}>
          {t('profile.cancel')}
        </ProfileTextAction>
      </Box>
      {toastSnackbar}
    </>
  );
}

/**
 * "+ Add a class" (rev4 UserAccount_1): opens a name field as a new row, as
 * signup does. Enter or "Add class" creates the class; Escape or the close
 * tile drops the row. A failed create keeps the name so it can be retried.
 */
function AddClassPanel({ apiClients }: { apiClients: IAPIClients }) {
  const { t } = useTranslation();
  const { userProfile, classrooms, selectedClassroomId } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const [draftName, setDraftName] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  // The toast can be dismissed while the field stays marked until a retry.
  const [isToastOpen, setIsToastOpen] = React.useState(false);
  // A held or repeated Enter can commit twice; this lets only one through.
  const isAddingRef = React.useRef(false);

  const close = () => {
    setDraftName(null);
    setHasError(false);
    setIsToastOpen(false);
  };

  const commit = async () => {
    const name = draftName?.trim() ?? '';
    if (!name) {
      close();
      return;
    }
    if (isAddingRef.current) return;
    isAddingRef.current = true;
    setIsAdding(true);
    setHasError(false);
    setIsToastOpen(false);
    let created: IMicroCoachClassroom | null = null;
    try {
      if (userProfile?.id) {
        created = await apiClients.classroom.createClassroom({
          userId: userProfile.id,
          name,
          grade: null,
          state: null,
          schoolYear: null,
        } as IMicroCoachClassroom);
      }
    } catch (error) {
      console.error('Could not add the class', error);
    }
    isAddingRef.current = false;
    setIsAdding(false);
    if (!created) {
      setHasError(true);
      setIsToastOpen(true);
      return;
    }
    dispatch({ type: 'SET_CLASSROOMS', payload: [...classrooms, created] });
    if (!selectedClassroomId) {
      dispatch({ type: 'SET_SELECTED_CLASSROOM_ID', payload: created.id });
    }
    close();
  };

  if (draftName === null) {
    return (
      <AddClassButton disableElevation onClick={() => setDraftName('')}>
        {t('profile.addClass')}
      </AddClassButton>
    );
  }

  return (
    <>
      <ClassRow>
        <ProfileInput
          autoFocus
          value={draftName}
          readOnly={isAdding}
          isError={hasError}
          placeholder={t('profile.addClassPlaceholder')}
          onChange={(event) => setDraftName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            } else if (event.key === 'Escape') {
              close();
            }
          }}
          inputProps={{
            'aria-label': t('profile.addClassPlaceholder'),
            'aria-invalid': hasError,
            'aria-describedby': hasError ? ADD_CLASS_ERROR_ID : undefined,
          }}
        />
        <ClassDeleteButton
          aria-label={t('profile.cancelAddClass')}
          onClick={close}
          disabled={isAdding}
        >
          <CloseIcon fontSize="small" sx={{ color: 'designSystem.surface.atlanticNavy' }} />
        </ClassDeleteButton>
      </ClassRow>
      {/* Not dismissed by clicking elsewhere, so a stray click can't hide
          the only sign the class wasn't saved. */}
      <ToastSnackbar
        open={isToastOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={(event, reason) => {
          if (reason !== 'clickaway') setIsToastOpen(false);
        }}
      >
        <Toast tone="error" role="alert">
          <span id={ADD_CLASS_ERROR_ID}>{t('profile.addClassError')}</span>
          <IconButton
            size="small"
            aria-label={t('profile.dismiss')}
            onClick={() => setIsToastOpen(false)}
          >
            <CancelIcon sx={{ fontSize: 20, color: 'designSystem.foreground.disabledStroke' }} />
          </IconButton>
        </Toast>
      </ToastSnackbar>
      <ProfileAction
        disableElevation
        disabled={!draftName.trim() || isAdding}
        aria-busy={isAdding}
        onClick={commit}
        // Greyed out until there is a name, as Home's My activity button is.
        sx={(theme) => ({
          alignSelf: 'flex-start',
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.designSystem.surface.ashyGray, 0.5),
            color: theme.palette.designSystem.surface.white,
          },
        })}
      >
        {isAdding ? (
          <CircularProgress size={16} color="inherit" aria-label={t('profile.saving')} />
        ) : (
          t('profile.addClassSubmit')
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
// The picture types browsers show reliably; the size cap matches the MIU uploads.
const PICTURE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const PICTURE_MAX_BYTES = 5 * 1024 * 1024;

type PictureError = 'TYPE' | 'SIZE' | 'UPLOAD';
const PICTURE_ERROR_KEY: Record<PictureError, string> = {
  TYPE: 'profile.pictureTypeError',
  SIZE: 'profile.pictureSizeError',
  UPLOAD: 'profile.pictureUploadError',
};

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
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [hasSaveFailed, setHasSaveFailed] = React.useState(false);
  const pictureInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingPicture, setIsUploadingPicture] = React.useState(false);
  const [pictureError, setPictureError] = React.useState<PictureError | null>(null);
  const pictureUrl = useProfilePictureUrl(apiClients, userProfile?.profilePicPath);
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

  /*
   * Edit Picture (central_v2's UserProfile, minus its upload modal): the file
   * picker opens straight away; the picture goes to the teacher's private S3
   * prefix and the User row keeps its path.
   */
  const handlePictureChosen = async (file: File | undefined) => {
    if (!file || !userProfile.id) return;
    if (!PICTURE_TYPES.includes(file.type)) {
      setPictureError('TYPE');
      return;
    }
    if (file.size > PICTURE_MAX_BYTES) {
      setPictureError('SIZE');
      return;
    }
    setPictureError(null);
    setIsUploadingPicture(true);
    try {
      const profilePicPath = await apiClients.upload.uploadProfilePicture(file);
      const updated = await apiClients.user.updateUser({ id: userProfile.id, profilePicPath });
      updateUserProfile(updated ?? { profilePicPath });
    } catch (error) {
      console.error('Could not save the profile picture', error);
      setPictureError('UPLOAD');
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleSave = async () => {
    if (!draft.first.trim() || !draft.last.trim()) {
      // Stay in edit mode — the draft is still recoverable.
      setShowFieldErrors(true);
      return;
    }
    const firstName = draft.first.trim();
    const lastName = draft.last.trim();
    setHasSaveFailed(false);
    if (userProfile.id) {
      setIsSavingProfile(true);
      try {
        const updated = await apiClients.user.updateUser({
          id: userProfile.id,
          firstName,
          lastName,
        });
        updateUserProfile(updated ?? { firstName, lastName });
      } catch (error) {
        // Stay in edit mode with the draft, so a retry is one click; showing
        // the new name as saved would hide that it was not.
        console.error('Could not save the profile name', error);
        setHasSaveFailed(true);
        return;
      } finally {
        setIsSavingProfile(false);
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


      <ProfileLayout screenSize={screenSize}>
        <ProfileSidebar screenSize={screenSize}>
          <SidebarIdentity>
            <AvatarGroup>
              <InitialsAvatar aria-hidden>
                {pictureUrl ? (
                  <Box
                    component="img"
                    src={pictureUrl}
                    alt=""
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initials
                )}
              </InitialsAvatar>
              <input
                ref={pictureInputRef}
                type="file"
                accept={PICTURE_TYPES.join(',')}
                hidden
                onChange={(event) => {
                  const input = event.currentTarget;
                  handlePictureChosen(input.files?.[0]);
                  // Cleared so choosing the same file again still fires.
                  input.value = '';
                }}
              />
              <EditPictureChip
                disableElevation
                disabled={isUploadingPicture}
                aria-busy={isUploadingPicture}
                onClick={() => pictureInputRef.current?.click()}
              >
                {isUploadingPicture ? (
                  <CircularProgress size={16} color="inherit" aria-label={t('profile.saving')} />
                ) : (
                  t('profile.editPicture')
                )}
              </EditPictureChip>
              {pictureError && (
                <Typography
                  variant="buttonLabelSmLight"
                  role="alert"
                  sx={{ color: 'designSystem.surface.white', textAlign: 'center' }}
                >
                  {t(PICTURE_ERROR_KEY[pictureError])}
                </Typography>
              )}
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
              {hasSaveFailed && (
                <Typography
                  variant="rubikBody"
                  role="alert"
                  sx={{ color: 'designSystem.status.errorStroke' }}
                >
                  {t('profile.saveError')}
                </Typography>
              )}
              <ProfileAction
                disableElevation
                disabled={isSavingProfile}
                aria-busy={isSavingProfile}
                onClick={isEditing ? handleSave : startEditing}
              >
                {isSavingProfile ? (
                  <CircularProgress size={16} color="inherit" aria-label={t('profile.saving')} />
                ) : (
                  t(isEditing ? 'profile.save' : 'profile.editInformation')
                )}
              </ProfileAction>
            </ProfileSection>
          </FormIntro>

          <ProfileSection>
            <ProfileSectionTitle>{t('profile.yourClasses')}</ProfileSectionTitle>
            {classrooms.length === 0 && (
              <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.ashyGray' }}>
                {t('profile.noClasses')}
              </Typography>
            )}
            <ClassList>
              {classrooms.map((classroom) => (
                <ClassRow key={classroom.id}>
                  <ClassName>{classroom.name}</ClassName>
                  <ClassDeleteButton
                    aria-label={t('profile.deleteClass', { name: classroom.name })}
                    onClick={() =>
                      remove.ask({ id: classroom.id, className: classroom.name })
                    }
                  >
                    <img src={removeIcon} alt="" />
                  </ClassDeleteButton>
                </ClassRow>
              ))}
              <AddClassPanel apiClients={apiClients} />
            </ClassList>
          </ProfileSection>

          {isFederated !== true && (
            <ProfileSection>
              <ProfileSectionTitle>{t('profile.password')}</ProfileSectionTitle>
              <PasswordPanel apiClients={apiClients} />
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
