import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Modal from 'react-modal';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IQuestionStat } from '../api/Models/IMicroCoachSession';
import { ScreenSize } from '../lib/MicroCoachModels';
import StudentResponsesTab, { flaggedOptionKeys } from './StudentResponsesTab';
import RelatedSkillsTab from './RelatedSkillsTab';
import { CardBadge } from '../lib/styledcomponents/UnderstandStyledComponents';
import {
  MODAL_MAX_HEIGHT,
  MODAL_MAX_WIDTH,
  MODAL_TOP_OFFSET,
  ModalBody,
  ModalCtaButton,
  ModalFooter,
  ModalHeaderBar,
  ModalHeading,
  ModalTab,
  ModalTabs,
  TabGroup,
  TabPanel,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';

type ModalTabId = 'student-responses' | 'related-skills';

/** Which misconception is open, and whether it was opened from its evidence. */
export interface MisconceptionDetailSelection {
  id: string;
  fromEvidence: boolean;
}

interface DetailContentProps {
  misconception: IMicroCoachMisconception;
  questionStats: IQuestionStat[];
  showNames: boolean;
  screenSize: ScreenSize;
  onClose: () => void;
  onChooseActivity: (misconceptionId: string) => void;
}

/**
 * The modal's contents. Keyed by the caller on misconception + open mode, so
 * each open starts on Student Responses with names shown or hidden afresh.
 */
function DetailContent({
  misconception,
  questionStats,
  showNames,
  screenSize,
  onClose,
  onChooseActivity,
}: DetailContentProps) {
  const { t } = useTranslation();
  const [tab, setTab] = React.useState<ModalTabId>('student-responses');
  const { isRecommendedFocus } = misconception;

  return (
    <>
      <ModalHeaderBar>
        <Typography
          variant="bodyLg"
          component="h2"
          sx={{ color: 'designSystem.background.cream' }}
        >
          {t('misconceptionModal.title')}
        </Typography>
        <IconButton
          aria-label={t('misconceptionModal.close')}
          onClick={onClose}
          sx={{ color: 'designSystem.background.cream' }}
        >
          <CloseIcon />
        </IconButton>
      </ModalHeaderBar>

      <ModalBody>
        <ModalHeading>
          <CardBadge isFocus={isRecommendedFocus}>
            {t(isRecommendedFocus ? 'review.recommendedFocus' : 'review.additional')}
          </CardBadge>
          <Typography
            variant="headingLg"
            component="h3"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {misconception.titleCased}
          </Typography>
        </ModalHeading>

        <TabGroup>
          <ModalTabs
            variant="fullWidth"
            value={tab}
            onChange={(unused, next: ModalTabId) => setTab(next)}
          >
            <ModalTab
              value="student-responses"
              label={t('misconceptionModal.studentResponses')}
              id="misconception-tab-student-responses"
              aria-controls="misconception-panel"
            />
            <ModalTab
              value="related-skills"
              label={t('misconceptionModal.relatedSkills')}
              id="misconception-tab-related-skills"
              aria-controls="misconception-panel"
            />
          </ModalTabs>

          {/* Keyed on the tab so switching tabs starts the scroll at the top. */}
          <TabPanel
            key={tab}
            id="misconception-panel"
            role="tabpanel"
            aria-labelledby={`misconception-tab-${tab}`}
            tabIndex={0}
          >
            {tab === 'student-responses' ? (
              <StudentResponsesTab
                misconception={misconception}
                questionStats={questionStats}
                screenSize={screenSize}
                initialOpenKeys={showNames ? flaggedOptionKeys(misconception) : []}
              />
            ) : (
              <RelatedSkillsTab
                skillContext={misconception.skillContext}
                screenSize={screenSize}
              />
            )}
          </TabPanel>
        </TabGroup>

        <ModalFooter>
          <ModalCtaButton disableElevation onClick={() => onChooseActivity(misconception.id)}>
            {t('misconceptionModal.chooseActivity')}
          </ModalCtaButton>
        </ModalFooter>
      </ModalBody>
    </>
  );
}

interface MisconceptionDetailModalProps {
  misconception: IMicroCoachMisconception | null;
  // Opened from the card's response evidence: the cited options start with
  // their students shown (Figma: Details 2). View details starts collapsed.
  showNames: boolean;
  questionStats: IQuestionStat[];
  screenSize: ScreenSize;
  onClose: () => void;
  onChooseActivity: (misconceptionId: string) => void;
}

export default function MisconceptionDetailModal({
  misconception,
  showNames,
  questionStats,
  screenSize,
  onClose,
  onChooseActivity,
}: MisconceptionDetailModalProps) {
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;

  // The Modal stays mounted and is driven by isOpen rather than being unmounted
  // on close: react-modal restores the app element's aria-hidden in its own
  // close path, and unmounting it mid-flight leaves #root hidden from
  // screen readers. Only its contents remount per open.
  return (
    <Modal
      isOpen={Boolean(misconception)}
      onRequestClose={onClose}
      contentLabel={misconception?.titleCased ?? ''}
      style={{
        overlay: {
          backgroundColor: theme.palette.designSystem.background.scrim,
          zIndex: theme.zIndex.modal,
          display: 'flex',
          // Pinned below the top of the screen rather than centred, so the
          // modal's position doesn't shift between tabs.
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: theme.sizing.space4,
          paddingTop: isLarge ? MODAL_TOP_OFFSET : theme.sizing.space4,
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: isLarge ? MODAL_MAX_WIDTH : '100%',
          // A fixed frame: the same height on both tabs, the panel scrolls.
          height: '100%',
          maxHeight: MODAL_MAX_HEIGHT,
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
        <DetailContent
          key={`${misconception.id}:${showNames}`}
          misconception={misconception}
          questionStats={questionStats}
          showNames={showNames}
          screenSize={screenSize}
          onClose={onClose}
          onChooseActivity={onChooseActivity}
        />
      )}
    </Modal>
  );
}
