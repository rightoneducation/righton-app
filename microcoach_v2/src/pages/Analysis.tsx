import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AppContentRow from '../components/AppContentRow';
import FlowNav, { FlowTabId } from '../components/FlowNav';
import MisconceptionCard from '../components/MisconceptionCard';
import MisconceptionDetailModal from '../components/MisconceptionDetailModal';
import UnderstandSkeleton from '../components/UnderstandSkeleton';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  ResultsBanner,
  CountChip,
  StrongUnderstandingBar,
  ScreenSizeProps,
} from '../lib/styledcomponents/UnderstandStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';
import { useMisconceptions } from '../hooks/useMisconceptions';

export default function Analysis({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isLarge = screenSize === ScreenSize.LARGE;

  const { session, misconceptions, isReady: dataReady } = useMisconceptions();
  const isReady = useAllReady(useI18nReady(), dataReady);

  const [isBannerOpen, setIsBannerOpen] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  if (!isReady) {
    return <UnderstandSkeleton screenSize={screenSize} />;
  }

  const handleViewDetails = (misconceptionId: string) => {
    setSelectedId(misconceptionId);
  };

  const handleChooseActivity = (misconceptionId: string) => {
    // Close before navigating so react-modal runs its own close path and
    // restores #root's aria-hidden, rather than being torn down mid-flight.
    setSelectedId(null);
    navigate(`/analysis/${misconceptionId}/activities`);
  };

  const selectedMisconception =
    misconceptions.find((item) => item.id === selectedId) ?? null;

  const handleTabSelect = (tabId: FlowTabId) => {
    if (tabId === 'prepare') navigate('/myplan');
  };

  const handleAction = () => {
    navigate('/myplan');
  };

  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.space6}px`,
        pt: isLarge ? `${theme.sizing.space8}px` : `${theme.sizing.space6}px`,
        pb: isLarge ? `${theme.sizing.space14}px` : `${theme.sizing.space11}px`,
      }}
    >
      <FlowNav
        screenSize={screenSize}
        activeTabId="understand-act"
        onTabSelect={handleTabSelect}
        onAction={handleAction}
      />

      {isBannerOpen && (
        <ResultsBanner
          elevation={3}
          sx={{ alignSelf: isLarge ? 'center' : 'stretch' }}
        >
          <Typography
            variant="rubikBodyBold"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {t('understand.banner')}
          </Typography>
          <IconButton
            size="small"
            aria-label={t('understand.dismissBanner')}
            onClick={() => setIsBannerOpen(false)}
            sx={{ ml: 'auto', color: 'designSystem.surface.ashyGray' }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </ResultsBanner>
      )}

      <Box>
        <Typography
          variant="appTitle"
          sx={{
            color: 'designSystem.surface.atlanticNavy',
            mb: `${theme.sizing.space2}px`,
          }}
        >
          {t('understand.title')}
        </Typography>

        <Stack
          direction={isLarge ? 'row' : 'column'}
          alignItems={isLarge ? 'center' : 'flex-start'}
          spacing={`${theme.sizing.space2}px`}
        >
          <Typography
            variant="uploadLabel"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {t('understand.subtitle')}
          </Typography>
          <CountChip>
            {t('understand.worksAnalyzed', {
              count: session.studentWorksAnalyzed,
            })}
          </CountChip>
        </Stack>
      </Box>

      <Stack
        direction={isLarge ? 'row' : 'column'}
        spacing={
          isLarge ? `${theme.sizing.space8}px` : `${theme.sizing.space5}px`
        }
        alignItems="stretch"
      >
        {misconceptions.map((misconception) => (
          <Box
            key={misconception.id}
            sx={{
              flex: '1 1 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MisconceptionCard
              misconception={misconception}
              screenSize={screenSize}
              onViewDetails={handleViewDetails}
            />
          </Box>
        ))}
      </Stack>

      <StrongUnderstandingBar elevation={4}>
        <Typography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {t('understand.strongUnderstanding', {
            count: session.studentsWithStrongUnderstanding,
          })}
        </Typography>
      </StrongUnderstandingBar>

      <MisconceptionDetailModal
        misconception={selectedMisconception}
        screenSize={screenSize}
        onClose={() => setSelectedId(null)}
        onChooseActivity={handleChooseActivity}
      />
    </AppContentRow>
  );
}
