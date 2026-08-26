import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import HelpIcon from '@mui/icons-material/Help';

const HelpFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.sizing.space6,
  right: theme.sizing.space5,
  zIndex: theme.zIndex.fab,
  gap: theme.sizing.space1,
  paddingLeft: theme.sizing.space4,
  paddingRight: theme.sizing.space4,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.lightBlue,
  },
}));

interface NeedHelpButtonProps {
  onClick?: () => void;
}

export default function NeedHelpButton({ onClick }: NeedHelpButtonProps) {
  const { t } = useTranslation();

  return (
    <HelpFab variant="extended" onClick={onClick}>
      {t('common.needHelp')}
      <HelpIcon fontSize="small" />
    </HelpFab>
  );
}
