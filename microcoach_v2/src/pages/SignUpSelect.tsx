import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { SignUpStepProps, namedClasses } from '../lib/SignUpModels';
import { UserRole } from '../api';
import AppContentRow from '../components/AppContentRow';
import {
  ClassChip,
  ClassChipGrid,
  ClassSelect,
  SignUpColumn,
  SignUpCtaWide,
  SignUpHeading,
  SignUpSubheading,
  TeacherSelectField,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from '../hooks/context/useMicroCoachDataContext';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';

export default function SignUpSelect({
  apiClients,
  screenSize,
  state,
  setSignedInUser,
}: SignUpStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { userProfile } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const isReady = useAllReady(useI18nReady());

  const classes = namedClasses(state);
  // The two roles share every screen but this one's tail.
  const isAdmin = state.role === 'ADMIN';
  const displayName = `${state.firstName} ${state.lastName}`.trim();
  const [selectedClass, setSelectedClass] = React.useState<string | null>(
    classes[0] ?? null,
  );

  // Class name -> created row id, so the class picked here is the one the
  // dashboard opens on.
  const [classIdsByName, setClassIdsByName] = React.useState<
    Record<string, string>
  >({});
  const [isCommitting, setIsCommitting] = React.useState(true);
  // StrictMode double-invokes effects in dev; a second pass would create every
  // class twice.
  const hasCommitted = React.useRef(false);

  /*
   * The wizard's output becomes the app's identity here, rather than at each
   * step: this is the first screen that presents the user as signed in, and
   * it is what makes the header swap to its identity pill.
   *
   * The classes are written as MicroCoachClassroom rows first, keyed by the
   * User row id SignUpVerify stored on the profile. Order matters twice:
   * - before setSignedInUser, and pushed into the classroom state directly:
   *   useClassrooms loads when the user id appears (at SignUpVerify, before
   *   any class exists), so it will not refetch them;
   * - one at a time, because the dashboard lists classes by createdAt, so this
   *   keeps the order they were typed in.
   * A class that fails to save is logged and skipped rather than blocking the
   * account; it can be re-added from the dashboard.
   */
  React.useEffect(() => {
    if (!state.isVerified || hasCommitted.current) return;
    hasCommitted.current = true;

    const commit = async () => {
      const userId = userProfile?.id;
      const ids: Record<string, string> = {};
      const createdRows: IMicroCoachClassroom[] = [];
      if (userId) {
        await classes.reduce(async (previous, name) => {
          await previous;
          try {
            const created = await apiClients.classroom.createClassroom({
              userId,
              name: name.trim(),
              grade: null,
              state: null,
              schoolYear: null,
            } as IMicroCoachClassroom);
            if (created) {
              ids[name] = created.id;
              createdRows.push(created);
            }
          } catch (error) {
            console.error(`Could not save class "${name}"`, error);
          }
        }, Promise.resolve());
      } else {
        console.error('Signup reached class save with no User row id');
      }
      setClassIdsByName(ids);
      dispatch({ type: 'SET_CLASSROOMS', payload: createdRows });
      setSignedInUser({
        ...(userProfile ?? {}),
        email: state.email,
        firstName: state.firstName,
        lastName: state.lastName,
        role: state.role === 'ADMIN' ? UserRole.ADMIN : UserRole.TEACHER,
      });
      setIsCommitting(false);
    };
    commit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isVerified]);

  if (!state.isVerified) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const handleUpload = () => {
    const selectedId = selectedClass ? classIdsByName[selectedClass] : undefined;
    if (selectedId) {
      dispatch({ type: 'SET_SELECTED_CLASSROOM_ID', payload: selectedId });
    }
    // The upload screen is a later flow; the prototype hands off to the app.
    // No reset needed: leaving /signup unmounts the wizard and its state.
    navigate('/dashboard');
  };

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space12}px`, pb: `${theme.sizing.space12}px` }}
    >
      <SignUpColumn screenSize={screenSize} width={600}>
        <SignUpHeading>{t('signup.welcome')}</SignUpHeading>
        <SignUpSubheading>{t('signup.selectTitle')}</SignUpSubheading>

        <TeacherSelectField>
          {/* Figma sets this at the same 50% it uses for placeholders — the
              name reads as a chosen value in a select, not as body copy. */}
          <Typography
            variant="headingSm"
            sx={{ color: 'designSystem.surface.placeholderGrey', opacity: 0.5 }}
          >
            {displayName}
          </Typography>
        </TeacherSelectField>

        {isAdmin ? (
          <ClassSelect
            value={selectedClass ?? ''}
            onChange={(event) => setSelectedClass(event.target.value)}
            inputProps={{ 'aria-label': t('signup.classPlaceholder') }}
          >
            {classes.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </ClassSelect>
        ) : (
          <ClassChipGrid screenSize={screenSize}>
            {classes.map((name) => (
              <ClassChip
                key={name}
                disableElevation
                isSelected={name === selectedClass}
                aria-pressed={name === selectedClass}
                onClick={() => setSelectedClass(name)}
              >
                {name}
              </ClassChip>
            ))}
            {/* Figma draws a trailing "More" chip in the disabled treatment —
                there is nothing behind it, so it stays inert here too. */}
            <ClassChip disableElevation isMore disabled>
              {t('signup.more')}
            </ClassChip>
          </ClassChipGrid>
        )}

        <Stack sx={{ mt: `${theme.sizing.space12}px`, alignItems: 'center' }}>
          {/* Figma: 384 wide for the admin's longer label, 303 for the
              teacher's. */}
          <SignUpCtaWide
            disableElevation
            disabled={!selectedClass || isCommitting}
            onClick={handleUpload}
            sx={{ maxWidth: isAdmin ? 384 : 303 }}
          >
            {t(isAdmin ? 'signup.viewData' : 'signup.upload')}
          </SignUpCtaWide>
        </Stack>
      </SignUpColumn>
    </AppContentRow>
  );
}
