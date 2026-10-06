import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentRow from '../components/ContentRow';
import {
  IUploadFile,
  SLOT_EXTENSION,
  UploadSlot,
  UploadStepProps,
  isFileReady,
} from '../lib/UploadModels';
import { formatSchoolWeek, schoolWeeks } from '../lib/weeks';
import { PromptIconTile } from '../lib/styledcomponents/ActivityDetailStyledComponents';
import { SignUpCta } from '../lib/styledcomponents/SignUpStyledComponents';
import {
  Dropzone,
  DropzoneRow,
  FormatHint,
  GhostAction,
  RemoveFileButton,
  SetupField,
  SetupRow,
  SetupSelect,
  UploadCard,
  UploadLayout,
  UploadPill,
  UploadedFileMain,
  UploadedFileRow,
  continueTooltipSx,
} from '../lib/styledcomponents/UploadStyledComponents';
import { useI18nReady } from '../hooks/readiness';
import { ScreenSize } from '../lib/MicroCoachModels';

// The file area keeps the dropzone's height once a file is in, so the cards
// do not jump between states (Figma: 308).
const FILE_AREA_HEIGHT = 308;

const ACCEPT: Record<UploadSlot, string> = {
  exemplar:
    '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  responses:
    '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

interface FileSlotCardProps {
  slot: UploadSlot;
  title: string;
  note: string;
  format: string;
  upload: IUploadFile | null;
  onPick: (file: File) => void;
  onClear: () => void;
}

/**
 * One MIU file: a dropzone while empty, then the picked file as a Completed or
 * Error row. The whole card takes a drop, so a file can be replaced by
 * dragging a new one over it as well as through the button.
 */
function FileSlotCard({
  slot,
  title,
  note,
  format,
  upload,
  onPick,
  onClear,
}: FileSlotCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const errorText =
    upload?.error === 'SIZE'
      ? t('upload.errorSize')
      : t('upload.errorFormat', { extension: SLOT_EXTENSION[slot] });

  const browse = () => inputRef.current?.click();
  const takeFirst = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onPick(file);
  };

  const pickButton = (
    <UploadPill disableElevation onClick={browse}>
      {t(isFileReady(upload) ? 'upload.replaceFile' : 'upload.uploadFile')}
    </UploadPill>
  );

  return (
    <UploadCard
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        takeFirst(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[slot]}
        hidden
        onChange={(event) => {
          const input = event.currentTarget;
          takeFirst(input.files);
          // Cleared so picking the same file again still fires onChange.
          input.value = '';
        }}
      />
      <Typography
        variant="smallTitle"
        sx={{ color: 'designSystem.surface.darkBlue' }}
      >
        {title}
        <Box
          component="span"
          sx={{ fontWeight: 300, ml: `${theme.sizing.space1}px` }}
        >
          {note}
        </Box>
      </Typography>

      {upload ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: FILE_AREA_HEIGHT,
          }}
        >
          <UploadedFileRow isError={!!upload.error}>
            <UploadedFileMain>
              <Typography
                variant="statusLabel"
                sx={{ color: 'designSystem.background.navyBlue' }}
              >
                {upload.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: `${theme.sizing.space1}px`,
                  flexShrink: 0,
                }}
              >
                {upload.error ? (
                  <ErrorIcon
                    fontSize="small"
                    sx={{ color: 'designSystem.status.errorStroke' }}
                  />
                ) : (
                  <CheckCircleIcon
                    fontSize="small"
                    sx={{ color: 'designSystem.status.success' }}
                  />
                )}
                <Typography
                  variant="xsLabel"
                  sx={{ color: 'designSystem.foreground.selectedNavy' }}
                >
                  {t(upload.error ? 'upload.error' : 'upload.completed')}
                </Typography>
                <RemoveFileButton
                  aria-label={t('upload.removeFile', { name: upload.name })}
                  onClick={onClear}
                >
                  <CancelIcon fontSize="small" />
                </RemoveFileButton>
              </Box>
            </UploadedFileMain>
            {upload.error && (
              <Typography
                variant="xsLabel"
                role="alert"
                sx={{ color: 'designSystem.status.errorStroke' }}
              >
                {errorText}
              </Typography>
            )}
          </UploadedFileRow>
          {pickButton}
        </Box>
      ) : (
        <Dropzone isDragOver={isDragOver}>
          <PromptIconTile>
            <UploadFileIcon />
          </PromptIconTile>
          <Typography
            variant="mediumLabel"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {t('upload.dropHint')}
          </Typography>
          <FormatHint>{format}</FormatHint>
          {pickButton}
        </Dropzone>
      )}
    </UploadCard>
  );
}

/**
 * MIU upload, step 1 and 2 on one screen (Figma Upload1-3): class and week,
 * pre-filled from the dashboard, then the exemplar and responses files.
 * Nothing leaves the browser until "Submit files for analysis" on the review.
 */
export default function UploadMiu({
  screenSize,
  upload,
  actions,
  classrooms,
}: UploadStepProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isI18nReady = useI18nReady();
  const isLarge = screenSize === ScreenSize.LARGE;

  const classId = upload.classId ?? '';
  const hasClass = classrooms.some((classroom) => classroom.id === classId);
  const bothReady = isFileReady(upload.exemplar) && isFileReady(upload.responses);
  const canContinue = hasClass && !!upload.weekStart && bothReady;
  const blockedReason = hasClass
    ? t('upload.bothToContinue')
    : t('upload.selectClassToContinue');

  if (!isI18nReady) return null;

  return (
    <UploadLayout screenSize={screenSize}>
      <ContentRow
        narrow
        screenSize={screenSize}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${theme.sizing.space7}px`,
          pt: `${isLarge ? theme.sizing.space12 : theme.sizing.space8}px`,
          pb: `${theme.sizing.space12}px`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.space11}px`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${isLarge ? theme.sizing.space8 : theme.sizing.space5}px`,
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
                <SetupField>
                  <Typography
                    variant="smallTitle"
                    component="label"
                    htmlFor="upload-class"
                    sx={{ color: 'designSystem.surface.darkBlue' }}
                  >
                    {t('upload.class')}
                  </Typography>
                  <SetupSelect
                    id="upload-class"
                    isEmpty={!hasClass}
                    value={hasClass ? classId : ''}
                    displayEmpty
                    disabled={classrooms.length === 0}
                    onChange={(event) => actions.setClass(event.target.value)}
                    renderValue={(value) =>
                      classrooms.find((c) => c.id === value)?.name ??
                      t(
                        classrooms.length === 0
                          ? 'upload.noClasses'
                          : 'upload.classPlaceholder',
                      )
                    }
                  >
                    {classrooms.map((classroom) => (
                      <MenuItem key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </MenuItem>
                    ))}
                  </SetupSelect>
                </SetupField>
                <SetupField>
                  <Typography
                    variant="smallTitle"
                    component="label"
                    htmlFor="upload-week"
                    sx={{ color: 'designSystem.surface.darkBlue' }}
                  >
                    {t('upload.week')}
                  </Typography>
                  <SetupSelect
                    id="upload-week"
                    isEmpty={!upload.weekStart}
                    value={upload.weekStart}
                    displayEmpty
                    onChange={(event) => actions.setWeek(event.target.value)}
                    renderValue={(value) =>
                      value
                        ? formatSchoolWeek(value, t, i18n.language, 'upload.weekOption')
                        : t('upload.weekPlaceholder')
                    }
                  >
                    {schoolWeeks().map((week) => (
                      <MenuItem key={week} value={week}>
                        {formatSchoolWeek(week, t, i18n.language, 'upload.weekOption')}
                      </MenuItem>
                    ))}
                  </SetupSelect>
                </SetupField>
              </SetupRow>
            </UploadCard>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${theme.sizing.space5}px`,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.space0}px` }}>
              <Typography
                variant="appTitle"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {t('upload.uploadTitle')}
              </Typography>
              <Typography
                variant="uploadLabel"
                sx={{ color: 'designSystem.background.navyBlue' }}
              >
                {t('upload.uploadSubtitle')}
              </Typography>
            </Box>
            <DropzoneRow screenSize={screenSize}>
              <FileSlotCard
                slot="exemplar"
                title={t('upload.exemplar')}
                note={t('upload.exemplarNote')}
                format={t('upload.formatDocx')}
                upload={upload.exemplar}
                onPick={(file) => actions.pickFile('exemplar', file)}
                onClear={() => actions.clearFile('exemplar')}
              />
              <FileSlotCard
                slot="responses"
                title={t('upload.responses')}
                note={t('upload.responsesNote')}
                format={t('upload.formatXlsx')}
                upload={upload.responses}
                onPick={(file) => actions.pickFile('responses', file)}
                onClear={() => actions.clearFile('responses')}
              />
            </DropzoneRow>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isLarge ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: `${theme.sizing.space3}px`,
          }}
        >
          <GhostAction
            disableElevation
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate('/dashboard')}
          >
            {t('upload.backHome')}
          </GhostAction>
          {/* A disabled button fires no hover, so the tooltip sits on a span. */}
          <Tooltip
            title={canContinue ? '' : blockedReason}
            placement="top"
            arrow
            slotProps={continueTooltipSx}
          >
            <span>
              <SignUpCta
                disableElevation
                disabled={!canContinue}
                onClick={() => navigate('/upload-miu/review')}
              >
                {t('upload.continue')}
              </SignUpCta>
            </span>
          </Tooltip>
        </Box>
      </ContentRow>
    </UploadLayout>
  );
}
