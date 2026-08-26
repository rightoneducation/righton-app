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

/**
 * Same 38px footprint as NavButton so appearing/disappearing cannot reflow the
 * row. Not a button -- it is decorative and does nothing when clicked.
 */
const Ellipsis = styled(Box)(({ theme }) => ({
  minWidth: '38px',
  height: '38px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Poppins',
  fontSize: '16px',
  fontWeight: 600,
  color: `${theme.palette.primary.buttonPrimaryDisable}`,
  userSelect: 'none',
  boxSizing: 'border-box',
}));

interface PaginatedNavigationProps {
  currentPage: number;
  pageCount: number;
  hasNext: boolean;
  // pages exist beyond the highest one discovered. NOT derivable from hasNext,
  // which is also true simply for standing behind the frontier.
  hasMorePages?: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  screenSize: ScreenSize;
}

/** USWDS caps the number/ellipsis run at seven slots. */
const SLOTS = 7;

/**
 * Builds the number run for USWDS's *unbounded* pagination: page 1 is always
 * present, the current page is always present, nearby pages fill the rest, and
 * a trailing ellipsis stands for "there may be more" for as long as the total
 * is unknown. Once the query is exhausted the trailing ellipsis drops and this
 * degrades to ordinary bounded pagination.
 *
 * Only discovered pages appear -- a cursor cannot jump to a page it has not
 * walked to, so the window is clamped to pageCount and Next is what advances
 * the frontier.
 */
const buildPages = (
  currentPage: number,
  pageCount: number,
  hasMorePages: boolean,
): { pages: number[]; leadingGap: boolean } => {
  const last = pageCount - 1;
  // the trailing ellipsis, when shown, costs one of the seven slots
  const contiguous = SLOTS - (hasMorePages ? 1 : 0);

  // everything fits, or the current page is early enough that an unbroken run
  // from page 1 still reaches it -- no leading gap in either case
  if (last <= contiguous - 1 || currentPage <= contiguous - 2) {
    const end = Math.min(contiguous - 1, last);
    return {
      pages: Array.from({ length: end + 1 }, (_, i) => i),
      leadingGap: false,
    };
  }

  // the windowed run between the ellipses is capped at four, so dropping the
  // trailing ellipsis at the end of the query does not widen it
  const windowSize = 4;
  const end = Math.min(currentPage + 2, last);
  const start = Math.max(end - windowSize + 1, 1);
  return {
    pages: [0, ...Array.from({ length: end - start + 1 }, (_, i) => start + i)],
    leadingGap: true,
  };
};

/**
 * Page-by-page navigator. Purely presentational: it neither fetches nor holds
 * state. Pages are discovered forward (cursor pagination), so `pageCount` grows
 * as the caller pages past the frontier and `hasNext` stays true while more remain.
 */
export default function PaginatedNavigation({
  currentPage,
  pageCount,
  hasNext,
  hasMorePages = false,
  isLoading = false,
  onPageChange,
  screenSize,
}: PaginatedNavigationProps) {
  const theme = useTheme();
  if (pageCount <= 1 && !hasNext) return null;
  const isFirst = currentPage === 0;
  const isSmall = screenSize === ScreenSize.SMALL;
  const { pages, leadingGap } = buildPages(currentPage, pageCount, hasMorePages);

  return (
    <NavContainer sx={{ gap: isSmall ? `${theme.sizing.xSmPadding}px` : '8px' }}>
      <NavButton
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </NavButton>
      {pages.map((page, index) => (
        <React.Fragment key={`page-${page}`}>
          {leadingGap && index === 1 && <Ellipsis aria-hidden>&hellip;</Ellipsis>}
          <NavButton
            type="button"
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </NavButton>
        </React.Fragment>
      ))}
      {hasMorePages && <Ellipsis aria-hidden>&hellip;</Ellipsis>}
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
