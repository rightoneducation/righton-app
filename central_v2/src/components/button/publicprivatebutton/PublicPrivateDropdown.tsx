import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  styled, 
  Typography, 
  Menu, 
  MenuItem,
  ListItemText 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublicPrivateType } from '@righton/networking';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface PublicPrivateDropdownProps {
  isDisabled: boolean;
  onHandlePublicPrivateChange?: (value: PublicPrivateType) => void;
  isPublic: boolean;
}

const DropdownContainer = styled(Button)(({ theme }) => ({
  width: '100%',
  minHeight: '36px',
  borderRadius: '8px',
  background: '#FFFFFF',
  border: '1.5px solid #E0E0E0',
  padding: '8px 12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  color: '#384466',
  fontSize: '14px',
  fontFamily: 'Rubik',
  fontWeight: '400',
  '&:hover': {
    background: '#FFFFFF',
    border: '1.5px solid #B0B0B0',
  },
  '&:focus': {
    background: '#FFFFFF',
    border: '1.5px solid #007AFF',
  },
}));

const DropdownText = styled(Typography)({
  fontSize: '14px',
  color: '#384466',
  fontFamily: 'Rubik',
  fontWeight: '400',
});

const StyledMenu = styled(Menu)({
  '& .MuiPaper-root': {
    borderRadius: '8px',
    border: '1.5px solid #E0E0E0',
    background: '#FFFFFF',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '4px',
    minWidth: '144px',
    width: '100%',
  },
});

const StyledMenuItem = styled(MenuItem)({
  padding: '8px 12px',
  '&:hover': {
    background: '#F5F5F5',
  },
  '&.Mui-selected': {
    background: '#E3F2FD',
    '&:hover': {
      background: '#E3F2FD',
    },
  },
});

const StyledListItemText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    color: '#384466',
    fontFamily: 'Rubik',
    fontWeight: '400',
  },
});

export default function PublicPrivateDropdown({
  isDisabled,
  onHandlePublicPrivateChange,
  isPublic,
}: PublicPrivateDropdownProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isDisabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (value: PublicPrivateType) => {
    onHandlePublicPrivateChange?.(value);
    handleClose();
  };

  return (
    <>
      <DropdownContainer
        onClick={handleClick}
        disabled={isDisabled}
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: '16px', color: '#384466' }} />}
      >
        <DropdownText>
          {isPublic ? t('publicPrivateButton.public') : t('publicPrivateButton.private')}
        </DropdownText>
      </DropdownContainer>
      
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            width: anchorEl ? anchorEl.offsetWidth : 'auto',
            minWidth: '144px',
          },
        }}
      >
        <StyledMenuItem
          onClick={() => handleOptionSelect(PublicPrivateType.PUBLIC)}
          selected={isPublic}
        >
          <StyledListItemText primary={t('publicPrivateButton.public')} />
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => handleOptionSelect(PublicPrivateType.PRIVATE)}
          selected={!isPublic}
        >
          <StyledListItemText primary={t('publicPrivateButton.private')} />
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
}
