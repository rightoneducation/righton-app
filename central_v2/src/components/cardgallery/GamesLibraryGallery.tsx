import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { IGameTemplate } from '@righton/networking';
import StyledGameCard from '../cards/GameCard';
import SkeletonGameCard from '../cards/GameCardSkeleton';
import placeHolder from '../../images/placeHolder.svg';
import { ScreenSize } from '../../lib/CentralModels';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import { MostPopularText } from '../../lib/styledcomponents/CardGalleryStyledComponents';

const MAX_CARDS = 12;

interface GamesLibraryGalleryProps {
  screenSize: ScreenSize;
  galleryElements: IGameTemplate[];
  isLoading?: boolean;
  handleView?: (element: IGameTemplate, elements: IGameTemplate[]) => void;
  /** Replaces the static title -- used for the search-results summary. */
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Games-library gallery for the explore games page.
 *
 * Deliberately a separate component from CardGallery: this page has no infinite
 * scroll, so its container must NOT be a scroll container. CardGallery's
 * MostPopularContainer sets overflow: auto + height: 100%, which nests a second
 * scroll region inside the page scroller and makes scrolling stall at the
 * boundary. That container is shared with the library and question tabs, which
 * do page, so it is left alone.
 */
export default function GamesLibraryGallery({
  screenSize,
  galleryElements,
  isLoading = false,
  handleView,
  header = null,
  footer = null,
}: GamesLibraryGalleryProps) {
  const theme = useTheme();
  const centralData = useCentralDataState();
  const favoriteGameTemplateIds =
    centralData.userProfile?.favoriteGameTemplateIds;
  const games = galleryElements.slice(0, MAX_CARDS);

  const handleViewButtonClick = (element: IGameTemplate) => {
    if (handleView) handleView(element, galleryElements);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
        padding:
          screenSize === ScreenSize.SMALL
            ? `${theme.sizing.smPadding}px ${theme.sizing.mdPadding}px`
            : `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
        paddingBottom: '128px',
        gap:
          screenSize === ScreenSize.SMALL
            ? `${theme.sizing.smPadding}px`
            : `${theme.sizing.mdPadding}px`,
        boxSizing: 'border-box',
      }}
    >
      {header ?? (
        <MostPopularText screenSize={screenSize}>Game Library</MostPopularText>
      )}
      <Grid
        container
        spacing={4}
        style={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '2000px',
        }}
      >
        {isLoading
          ? Array.from({ length: MAX_CARDS }).map((_, index) => (
              <Grid item key={`games-library-skeleton-${index}`}> {/* eslint-disable-line */}
                <SkeletonGameCard
                  screenSize={screenSize}
                  isCarousel={false}
                  index={index}
                />
              </Grid>
            ))
          : games.map((game) => (
              <Grid item key={game.id}>
                <StyledGameCard
                  screenSize={screenSize}
                  game={game}
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  image={game.imageUrl || placeHolder}
                  isCarousel={false}
                  isFavorite={
                    favoriteGameTemplateIds?.includes(game.id) || false
                  }
                  handleViewButtonClick={handleViewButtonClick}
                />
              </Grid>
            ))}
      </Grid>
      {footer}
    </Box>
  );
}
