import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AppContentRow from '../components/AppContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import { UploadStepProps } from '../lib/UploadModels';
import { useMisconceptions } from '../hooks/useMisconceptions';
import { PromptIconTile } from '../lib/styledcomponents/ActivityDetailStyledComponents';
import { SignUpCta } from '../lib/styledcomponents/SignUpStyledComponents';
import {
  Dropzone,
  DropzoneRow,
  FormatHint,
  SetupRow,
  SetupValue,
  UploadCard,
  UploadHintChip,
  UploadPill,
  UploadedFileMain,
  UploadedFileRow,
  GhostAction,
} from '../lib/styledcomponents/UploadStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

/**
 * RTD upload — one screen in four states, exactly as the frames draw it:
 * both empty, one errored, one done, both done. Only the dropzone changes,
 * so the states are props rather than separate screens.
 *
 * Mocked like the rest of the prototype: there is no real file handling, so
 * "Upload file" marks a slot complete and "Replace file" clears it. The error
 * state is reachable through the second slot so it can be demonstrated.
 */
export default function UploadRtd({ screenSize, upload, actions, user }: UploadStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { session } = useMisconceptions();
  const { userProfile } = user;

  const isReady = useAllReady(useI18nReady());

  if (!isReady) return null;

  const teacherName = userProfile?.teacherName ?? session.teacher.displayName;
  const teacherEmail = userProfile?.email ?? session.teacher.email;
  const className =
    session.classes.find((option) => option.id === session.selectedClassId)
      ?.name ?? session.classes[0]?.name;

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
            // the first two are fixed for this upload, the third is the
            // teacher's to change.
            {
              label: t('upload.teacher'),
              value: `${teacherName} · ${teacherEmail}`,
              isLocked: true,
            },
            { label: t('upload.class'), value: className, isLocked: true },
            {
              label: t('upload.week'),
              value: session.selectedWeek,
              isLocked: false,
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
              <SetupValue isLocked={field.isLocked}>{field.value}</SetupValue>
            </Box>
          ))}
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
                  (file
                    ? actions.clearFile(slot.key)
                    : actions.completeFile(slot.key))
                }
              >
                {t(file ? 'upload.replaceFile' : 'upload.uploadFile')}
              </UploadPill>
            </UploadCard>
          );
        })}
      </DropzoneRow>

      {!bothComplete && (
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
          disabled={!bothComplete}
          onClick={() => navigate('/upload-rtd/review')}
        >
          {t('upload.continue')}
        </SignUpCta>
      </Stack>
    </AppContentRow>
  );
}
