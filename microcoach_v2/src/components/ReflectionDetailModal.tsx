import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Modal from 'react-modal';
import { IImplementedActivity } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import { CountChip } from '../lib/styledcomponents/ReviewStyledComponents';
import {
  ComparisonBlock,
  ComparisonRow,
  ReflectModalBody,
} from '../lib/styledcomponents/ReflectStyledComponents';
import {
  MODAL_MAX_WIDTH,
  MODAL_TOP_OFFSET,
  ModalHeaderBar,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';

interface ReflectionDetailModalProps {
  activity: IImplementedActivity | null;
  screenSize: ScreenSize;
  onClose: () => void;
}

export default function ReflectionDetailModal({
  activity,
  screenSize,
  onClose,
}: ReflectionDetailModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;
  const improvement = activity
    ? activity.masteryAfter - activity.masteryBefore
    : 0;

  return (
    <Modal
      isOpen={Boolean(activity)}
      onRequestClose={onClose}
      contentLabel={activity ? t('reflect.detailsFor', { title: activity.title }) : ''}
      style={{
        overlay: {
          backgroundColor: theme.palette.designSystem.background.scrim,
          zIndex: theme.zIndex.modal,
          display: 'flex',
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
      {activity && (
        <>
          <ModalHeaderBar>
            <IconButton aria-label={t('reflect.closeDetails')} onClick={onClose} sx={{ color: 'designSystem.surface.white' }}>
              <CloseIcon />
            </IconButton>
          </ModalHeaderBar>
          <ReflectModalBody>
            <Typography variant="headingLg" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {t('reflect.detailsTitle')}
            </Typography>
            <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {activity.title}
            </Typography>
            <CountChip>{activity.skillCode}</CountChip>
            <ComparisonRow screenSize={screenSize}>
              <ComparisonBlock>
                <Typography variant="rubikSubBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                  {t('reflect.before')}
                </Typography>
                <Typography variant="headingLg" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                  {t('reflect.percentCorrect', { percent: activity.masteryBefore })}
                </Typography>
              </ComparisonBlock>
              <ComparisonBlock>
                <Typography variant="rubikSubBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                  {t('reflect.after')}
                </Typography>
                <Typography variant="headingLg" sx={{ color: 'designSystem.surface.green' }}>
                  {t('reflect.percentCorrect', { percent: activity.masteryAfter })}
                </Typography>
              </ComparisonBlock>
            </ComparisonRow>
            <ComparisonBlock>
              <Typography variant="rubikSubBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.improvement')}
              </Typography>
              <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.improvementSummary', { improvement, students: activity.studentsImproved })}
              </Typography>
            </ComparisonBlock>
          </ReflectModalBody>
        </>
      )}
    </Modal>
  );
}
