import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { UserRole } from '../api';
import AppContentRow from '../components/AppContentRow';
import { UserStatusType } from '../lib/MicroCoachModels';
import { namedClasses } from '../lib/context/SignUpContext';
import {
  useSignUpDispatch,
  useSignUpState,
} from '../hooks/context/useSignUpContext';
import { useMicroCoachDataDispatch } from '../hooks/context/useMicroCoachDataContext';
import {
  ClassChip,
  ClassChipGrid,
  SignUpColumn,
  SignUpCtaWide,
  SignUpHeading,
  SignUpSubheading,
  TeacherSelectField,
  ScreenSizeProps,
} from '../lib/styledcomponents/SignUpStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

export default function SignUpSelect({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const state = useSignUpState();
  const signUpDispatch = useSignUpDispatch();
  const dispatch = useMicroCoachDataDispatch();
  const isReady = useAllReady(useI18nReady());

  const classes = namedClasses(state);
  const teacherName = `${state.firstName} ${state.lastName}`.trim();
  const [selectedClass, setSelectedClass] = React.useState<string | null>(
    classes[0] ?? null,
  );

  /*
   * The wizard's output becomes the app's identity here, rather than at each
   * step: this is the first screen that presents the user as signed in, and
   * it is what makes the header swap to its identity pill. Runs once — the
   * dependency list is the committed values, not the whole wizard state.
   */
  React.useEffect(() => {
    if (!state.isVerified) return;

    dispatch({
      type: 'SET_USER_PROFILE',
      payload: {
        email: state.email,
        teacherName,
        role: state.role === 'ADMIN' ? UserRole.ADMIN : UserRole.MEMBER,
        classes: classes.map((name) => ({ id: name, name })),
      },
    });
    dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isVerified]);

  if (!state.isVerified) return <Navigate to="/signup" replace />;
  if (!isReady) return null;

  const handleUpload = () => {
    // The upload screen is a later flow; the prototype hands off to the app.
    signUpDispatch({ type: 'RESET' });
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
          <Typography
            variant="headingSm"
            sx={{ color: 'designSystem.surface.placeholderGrey' }}
          >
            {teacherName}
          </Typography>
        </TeacherSelectField>

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

        <Stack sx={{ mt: `${theme.sizing.space11}px`, alignItems: 'center' }}>
          <SignUpCtaWide
            disableElevation
            disabled={!selectedClass}
            onClick={handleUpload}
          >
            {t('signup.upload')}
          </SignUpCtaWide>
        </Stack>
      </SignUpColumn>
    </AppContentRow>
  );
}
