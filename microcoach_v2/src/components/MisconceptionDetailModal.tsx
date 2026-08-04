import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Modal from 'react-modal';
import { IMisconception } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import StudentWorkTab from './StudentWorkTab';
import SkillContextTab from './SkillContextTab';
import {
  MODAL_MAX_WIDTH,
  MODAL_TOP_OFFSET,
  ModalHeaderBar,
  ModalBody,
  ModalTabs,
  ModalTab,
  ModalFooter,
  SupportStatChip,
  UnderstoodStatChip,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';
import { CardCta } from '../lib/styledcomponents/UnderstandStyledComponents';

type ModalTabId = 'student-work' | 'skill-context';

interface MisconceptionDetailModalProps {
  misconception: IMisconception | null;
  screenSize: ScreenSize;
  onClose: () => void;
  onChooseActivity: (misconceptionId: string) => void;
}

export default function MisconceptionDetailModal({
  misconception,
  screenSize,
  onClose,
  onChooseActivity,
}: MisconceptionDetailModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tab, setTab] = React.useState<ModalTabId>('student-work');

  // Reset to the first tab whenever a different misconception is opened.
  React.useEffect(() => {
    if (misconception) setTab('student-work');
  }, [misconception?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLarge = screenSize === ScreenSize.LARGE;

  // The Modal stays mounted and is driven by isOpen rather than being unmounted
  // on close: react-modal restores the app element's aria-hidden in its own
  // close path, and unmounting it mid-flight leaves #root hidden from
  // screen readers.
  return (
    <Modal
      isOpen={Boolean(misconception)}
      onRequestClose={onClose}
      contentLabel={misconception?.titleCased ?? ''}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: theme.zIndex.modal,
          display: 'flex',
          // Pinned below the top of the screen rather than centred, so the
          // modal's position doesn't shift with its content height.
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: theme.sizing.space4,
          paddingTop: MODAL_TOP_OFFSET,
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: isLarge ? MODAL_MAX_WIDTH : '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          border: 'none',
          borderRadius: theme.sizing.space2,
          overflow: 'hidden',
          backgroundColor: theme.palette.designSystem.surface.white,
        },
      }}
    >
      {misconception && (
        <>
          <ModalHeaderBar>
            <IconButton
              aria-label={t('misconceptionModal.close')}
              onClick={onClose}
              sx={{ color: 'designSystem.surface.white' }}
            >
              <CloseIcon />
            </IconButton>
          </ModalHeaderBar>

          <ModalBody>
            <Typography
              variant="smallTitle"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {misconception.titleCased}
            </Typography>

            {(misconception.prevalence.supportSummaryLabel ||
              misconception.prevalence.understoodSummaryLabel) && (
              <Stack
                direction={isLarge ? 'row' : 'column'}
                alignItems="flex-start"
                spacing={`${theme.sizing.space2}px`}
              >
                {misconception.prevalence.supportSummaryLabel && (
                  <SupportStatChip>
                    {misconception.prevalence.supportSummaryLabel}
                  </SupportStatChip>
                )}
                {misconception.prevalence.understoodSummaryLabel && (
                  <UnderstoodStatChip>
                    {misconception.prevalence.understoodSummaryLabel}
                  </UnderstoodStatChip>
                )}
              </Stack>
            )}

            <ModalTabs
              value={tab}
              onChange={(unused, next: ModalTabId) => setTab(next)}
            >
              <ModalTab
                value="student-work"
                label={t('misconceptionModal.studentWork')}
              />
              <ModalTab
                value="skill-context"
                label={t('misconceptionModal.skillContext')}
              />
            </ModalTabs>

            {tab === 'student-work' ? (
              <StudentWorkTab studentWork={misconception.studentWork} />
            ) : (
              <SkillContextTab skillContext={misconception.skillContext} />
            )}

            <ModalFooter>
              <CardCta
                isFocus
                disableElevation
                onClick={() => onChooseActivity(misconception.id)}
                sx={{ alignSelf: 'flex-end', minWidth: 200 }}
              >
                {t('misconceptionModal.chooseActivity')}
              </CardCta>
            </ModalFooter>
          </ModalBody>
        </>
      )}
    </Modal>
  );
}
