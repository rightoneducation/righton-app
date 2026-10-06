import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AppContentRow from '../components/AppContentRow';
import {
  MicroCoachDataStatus,
  ScreenSize,
  UserStatusType,
} from '../lib/MicroCoachModels';
import { UploadStepProps } from '../lib/UploadModels';
import { formatSchoolWeek, schoolWeeks } from '../lib/weeks';
import { PromptIconTile } from '../lib/styledcomponents/ActivityDetailStyledComponents';
import { SignUpCta } from '../lib/styledcomponents/SignUpStyledComponents';
import {
  Dropzone,
  DropzoneRow,
  FormatHint,
  SetupRow,
  SetupSelect,
  SetupValue,
  UploadCard,
  UploadHintChip,
  UploadPill,
  UploadedFileMain,
  UploadedFileRow,
  GhostAction,
} from '../lib/styledcomponents/UploadStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';

/**
 * RTD upload — one screen in four states, exactly as the frames draw it:
 * both empty, one errored, one done, both done. Only the dropzone changes,
 * so the states are props rather than separate screens.
 *
 * Mocked like the rest of the prototype: there is no real file handling, so
 * "Upload file" marks a slot complete and "Replace file" clears it. The error
 * state is reachable through the second slot so it can be demonstrated.
 */
export default function UploadRtd({
  screenSize,
  upload,
  actions,
}: UploadStepProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    userProfile,
    userStatus,
    classrooms: classList,
    selectedClassroomId,
    classroomsStatus,
  } = useMicroCoachDataState();

  // Waits on auth and the class list: this screen renders during LOADING (it
  // is in PUBLIC_SCREENS), and painting before they settle flashed an empty
  // name and class in.
  const isReady = useAllReady(
    useI18nReady(),
    userStatus !== UserStatusType.LOADING,
    classroomsStatus !== MicroCoachDataStatus.LOADING,
  );

  if (!isReady) return null;

  const teacherName = [userProfile?.firstName, userProfile?.lastName]
    .filter(Boolean)
    .join(' ');
  const teacherEmail = userProfile?.email ?? '';
  // Read from the shared selection, so switching class in the header mid-upload
  // updates this card rather than leaving it pointing at the old class.
  const className =
    classList.find((classroom) => classroom.id === selectedClassroomId)?.name ??
    '';
  const hasClass = !!className;
  const weekOptions = schoolWeeks();

  const slots = [
    {
      key: 'exemplar' as const,
      title: t('upload.exemplar'),
      note: t('upload.exemplarNote'),
      format: t('upload.formatDocx'),
      file: upload.exemplar,
    },
    {
      key: 'responses' as const,
      title: t('upload.responses'),
      note: t('upload.responsesNote'),
      format: t('upload.formatXlsx'),
      file: upload.responses,
    },
  ];

  const bothComplete = slots.every((slot) => slot.file?.status === 'COMPLETE');

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.space6}px`,
        pt: `${theme.sizing.space8}px`,
        pb: `${theme.sizing.space12}px`,
      }}
    >
      <Typography
        variant="appTitle"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {t('upload.setupTitle')}
      </Typography>

      <UploadCard>
        <SetupRow screenSize={screenSize}>
          {[
            // Teacher and Class are outlined at 50% in the frames, Week at 70%:
            // the first two are fixed for this upload; Week is the teacher's
            // to change, so it is the SetupSelect after these.
            {
              label: t('upload.teacher'),
              value: [teacherName, teacherEmail].filter(Boolean).join(' · '),
            },
            {
              label: t('upload.class'),
              value: className || t('upload.noClass'),
            },
          ].map((field) => (
            <Box key={field.label}>
              <Typography
                variant="smallTitle"
                sx={{
                  display: 'block',
                  mb: `${theme.sizing.space1}px`,
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {field.label}
              </Typography>
              <SetupValue isLocked>{field.value}</SetupValue>
            </Box>
          ))}
          <Box>
            <Typography
              variant="smallTitle"
              sx={{
                display: 'block',
                mb: `${theme.sizing.space1}px`,
                color: 'designSystem.surface.atlanticNavy',
              }}
            >
              {t('upload.week')}
            </Typography>
            <SetupSelect
              value={upload.weekStart}
              onChange={(event) => actions.setWeek(event.target.value)}
              inputProps={{ 'aria-label': t('upload.week') }}
            >
              {weekOptions.map((week) => (
                <MenuItem key={week} value={week}>
                  {formatSchoolWeek(week, t, i18n.language)}
                </MenuItem>
              ))}
            </SetupSelect>
          </Box>
        </SetupRow>
      </UploadCard>

      <Box>
        <Typography
          variant="appTitle"
          sx={{ display: 'block', color: 'designSystem.surface.atlanticNavy' }}
        >
          {t('upload.uploadTitle')}
        </Typography>
        <Typography
          variant="uploadLabel"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {t('upload.uploadSubtitle')}
        </Typography>
      </Box>

      <DropzoneRow screenSize={screenSize}>
        {slots.map((slot) => {
          const { file } = slot;
          const isErrored = file?.status === 'ERROR';

          return (
            <UploadCard key={slot.key}>
              <Typography
                variant="smallTitle"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {slot.title}
                <Box
                  component="span"
                  sx={{ fontWeight: 300, ml: `${theme.sizing.space1}px` }}
                >
                  {slot.note}
                </Box>
              </Typography>

              {file ? (
                <UploadedFileRow isError={isErrored}>
                  <UploadedFileMain>
                    <Typography
                      variant="statusLabel"
                      sx={{ color: 'designSystem.surface.atlanticNavy' }}
                    >
                      {file.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {isErrored ? (
                        <ErrorIcon
                          fontSize="small"
                          sx={{ color: 'designSystem.status.errorIcon' }}
                        />
                      ) : (
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: 'designSystem.status.success' }}
                        />
                      )}
                      <Typography
                        variant="xsLabel"
                        sx={{ color: 'designSystem.surface.atlanticNavy' }}
                      >
                        {t(isErrored ? 'upload.error' : 'upload.completed')}
                      </Typography>
                    </Stack>
                  </UploadedFileMain>
                  {/* Figma keeps this inside the row's border, which is why the
                      errored box is 67.5 tall against the completed 47.5. */}
                  {isErrored && (
                    <Typography
                      variant="xsLabel"
                      role="alert"
                      sx={{ color: 'designSystem.surface.atlanticNavy' }}
                    >
                      {t('upload.errorFormat')}
                    </Typography>
                  )}
                </UploadedFileRow>
              ) : (
                <Dropzone>
                  <PromptIconTile>
                    <UploadFileIcon />
                  </PromptIconTile>
                  <Typography
                    variant="mediumLabel"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  >
                    {t('upload.dropHint')}
                  </Typography>
                  <FormatHint>{slot.format}</FormatHint>
                </Dropzone>
              )}

              <UploadPill
                disableElevation
                sx={{ alignSelf: 'center' }}
                onClick={() =>
                  file
                    ? actions.clearFile(slot.key)
                    : actions.completeFile(slot.key)
                }
              >
                {t(file ? 'upload.replaceFile' : 'upload.uploadFile')}
              </UploadPill>
            </UploadCard>
          );
        })}
      </DropzoneRow>

      {!hasClass && <UploadHintChip>{t('upload.addClassHint')}</UploadHintChip>}
      {hasClass && !bothComplete && (
        <UploadHintChip>{t('upload.bothToContinue')}</UploadHintChip>
      )}

      <Stack
        direction={screenSize === ScreenSize.LARGE ? 'row' : 'column'}
        spacing={`${theme.sizing.space3}px`}
        sx={{ alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Figma draws no fill behind this — it is a link, not a second CTA
            competing with Continue. */}
        <GhostAction disableElevation onClick={() => navigate('/dashboard')}>
          {t('upload.backHome')}
        </GhostAction>
        {/* Present from the start in its disabled treatment: the frame shows
            it greyed before either file lands, which is what tells the
            teacher the step exists. */}
        <SignUpCta
          disableElevation
          disabled={!bothComplete || !hasClass}
          onClick={() => navigate('/upload-rtd/review')}
        >
          {t('upload.continue')}
        </SignUpCta>
      </Stack>
    </AppContentRow>
  );
}
