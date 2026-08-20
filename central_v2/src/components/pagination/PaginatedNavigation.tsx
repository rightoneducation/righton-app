import React from 'react';
import { Box, styled, useTheme } from '@mui/material';
import { ScreenSize } from '../../lib/CentralModels';

interface PageButtonProps {
  isActive?: boolean;
}

const NavContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

const NavButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<PageButtonProps>(({ theme, isActive }) => ({
  minWidth: '38px',
  height: '38px',
  padding: '0 10px',
  border: 'none',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  fontFamily: 'Poppins',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  boxSizing: 'border-box',
  backgroundColor: isActive
    ? `${theme.palette.primary.buttonPrimaryDefault}`
    : '#FFFFFF',
  color: isActive ? '#FFFFFF' : `${theme.palette.primary.buttonPrimaryDefault}`,
  '&:hover:not(:disabled)': {
    backgroundColor: isActive
      ? `${theme.palette.primary.buttonPrimaryHover}`
      : 'rgba(0,0,0,0.06)',
  },
  '&:disabled': {
    color: `${theme.palette.primary.buttonPrimaryDisable}`,
    cursor: 'default',
  },
}));

interface PaginatedNavigationProps {
  currentPage: number;
  pageCount: number;
  hasNext: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  screenSize: ScreenSize;
}

/**
 * Page-by-page navigator. Purely presentational: it neither fetches nor holds
 * state. Pages are discovered forward (cursor pagination), so `pageCount` grows
 * as the caller pages past the frontier and `hasNext` stays true while more remain.
 */
export default function PaginatedNavigation({
  currentPage,
  pageCount,
  hasNext,
  isLoading = false,
  onPageChange,
  screenSize,
}: PaginatedNavigationProps) {
  const theme = useTheme();
  if (pageCount <= 1 && !hasNext) return null;
  const isFirst = currentPage === 0;
  const isSmall = screenSize === ScreenSize.SMALL;

  return (
    <NavContainer sx={{ gap: isSmall ? `${theme.sizing.xSmPadding}px` : '8px' }}>
      <NavButton type="button" disabled={isFirst} onClick={() => onPageChange(0)}>
        First
      </NavButton>
      <NavButton
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </NavButton>
      {Array.from({ length: pageCount }).map((_, index) => (
        <NavButton
          type="button"
          key={`page-${index + 1}`}
          isActive={index === currentPage}
          onClick={() => onPageChange(index)}
        >
          {index + 1}
        </NavButton>
      ))}
      <NavButton
        type="button"
        disabled={!hasNext || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </NavButton>
    </NavContainer>
  );
}
