import React, { useState, useCallback, useEffect } from 'react';
import { Box, InputAdornment, styled, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { GradeTarget } from '@righton/networking';
import SearchIcon from '../../images/search.svg';
import { ScreenSize, GameQuestionType } from '../../lib/CentralModels';
import {
  encodeBrowseQuery,
  emptyBrowseQuery,
} from '../../lib/browseQueryParams';
import LauncherGradesMenu from './LauncherGradesMenu';

/**
 * TEMPORARY -- front-page only. See
 * ~/.claude/plans/alright-next-bit-of-inherited-bachman.md
 *
 * The title screens kept a search + grade filter from before Browse existed.
 * Rather than wire them to a second live query, this bar is a launcher: it
 * looks like searchbar/SearchBar (minus the sort menu, which the front page
 * never showed) and on commit navigates to Browse with the user's intent in the
 * URL. Duplicated rather than adding props to SearchBar, which has six
 * consumers. Delete this folder to remove the feature.
 */

interface LauncherStyleProps {
  screenSize?: ScreenSize;
  searchTerms?: string;
}

const SearchBarContainer = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'screenSize' && prop !== 'searchTerms',
})<LauncherStyleProps>(({ screenSize, searchTerms, theme }) => ({
  width: '100%',
  flexGrow: 1,
  margin: '0',
  backgroundColor: '#FFFFFF',
  height: '44px',
  borderRadius: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px 0px`,
  '& .MuiOutlinedInput-root': {
    height: '100%',
    padding: '0 12px',
    boxSizing: 'border-box',
    borderRadius: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.xSmPadding}px 0px`,
    borderColor:
      searchTerms && searchTerms.length === 0
        ? 'none'
        : theme.palette.primary.darkGrey,
    borderStyle: searchTerms && searchTerms.length === 0 ? 'none' : 'solid',
    borderWidth: searchTerms && searchTerms.length === 0 ? '0px' : '2px',
    '& fieldset': { border: 'none' },
    '& .MuiInputBase-input': {
      padding: 0,
      whiteSpace: screenSize !== ScreenSize.SMALL ? 'nowrap' : 'normal',
      height: screenSize !== ScreenSize.SMALL ? '44px' : '16px',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '&::placeholder': {
        color: `${theme.palette.primary.extraDarkBlue}`,
        fontWeight: 400,
        fontFamily: 'Rubik',
        fontSize: `${theme.sizing.smPadding}px`,
      },
    },
  },
}));

const SearchAndFilterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<LauncherStyleProps>(({ theme }) => ({
  height: '88px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${theme.sizing.mdPadding}px ${theme.sizing.lgPadding}px`,
  gap: '16px',
  boxSizing: 'border-box',
}));

/** matches BrowseTemplates' search debounce, so the two feel the same */
const LAUNCH_DELAY = 800;
/** one character plus a pause should not pull the user off the front page */
const MIN_LAUNCH_LENGTH = 2;

interface ExploreLauncherBarProps {
  screenSize?: ScreenSize;
  browseTarget: GameQuestionType;
}

export default function ExploreLauncherBar({
  screenSize,
  browseTarget,
}: ExploreLauncherBarProps) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [grades, setGrades] = useState<GradeTarget[]>([]);

  const isQuestions = browseTarget === GameQuestionType.QUESTION;
  const browsePath = isQuestions ? '/browse/question' : '/browse/game';

  // push (not replace) so Back returns the user to the front page
  const launch = (search: string, nextGrades: GradeTarget[]) => {
    const params = encodeBrowseQuery(
      { ...emptyBrowseQuery(browseTarget), search, grades: nextGrades },
      browseTarget,
    );
    const queryString = params.toString();
    navigate(queryString ? `${browsePath}?${queryString}` : browsePath);
  };

  /**
   * Stable across renders -- `launch` is handed in as an argument rather than
   * closed over, the same shape BrowseTemplates uses for debouncedSearch. A new
   * debounced function per render would give every keystroke its own timer.
   */
  const debouncedLaunch = useCallback( // eslint-disable-line
    debounce(
      (
        search: string,
        nextGrades: GradeTarget[],
        go: (s: string, g: GradeTarget[]) => void,
      ) => go(search, nextGrades),
      LAUNCH_DELAY,
    ),
    [],
  );

  // launch() unmounts this component; a timer still pending afterwards would
  // fire a second navigation from a dead component
  useEffect(() => () => debouncedLaunch.cancel(), [debouncedLaunch]);

  const handleSearchInput = (value: string) => {
    setSearchText(value);
    if (value.trim().length < MIN_LAUNCH_LENGTH) {
      // backspacing below the threshold cancels a launch already scheduled
      debouncedLaunch.cancel();
      return;
    }
    debouncedLaunch(value, grades, launch);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    debouncedLaunch.cancel();
    launch(searchText, grades);
  };

  let placeholder = 'Search by topics, standards, or games...';
  if (screenSize === ScreenSize.SMALL)
    placeholder = isQuestions ? 'Search Questions' : 'Search Games';
  else if (isQuestions)
    placeholder = 'Search by topics, standards, or questions...';

  return (
    <SearchAndFilterContainer screenSize={screenSize}>
      <Box style={{ display: 'flex', width: '100%' }}>
        <LauncherGradesMenu
          screenSize={screenSize ?? ScreenSize.SMALL}
          selectedGrades={grades}
          onGradesChange={setGrades}
          onCommit={(nextGrades) => {
            // click-away fires with an unchanged empty selection too; only a
            // real choice should pull the user off the front page
            if (nextGrades.length === 0) return;
            debouncedLaunch.cancel();
            launch(searchText, nextGrades);
          }}
        />
        <SearchBarContainer
          maxRows={1}
          screenSize={screenSize}
          placeholder={placeholder}
          variant="outlined"
          value={searchText}
          searchTerms={searchText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleSearchInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={SearchIcon} alt="Search Icon" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </SearchAndFilterContainer>
  );
}
