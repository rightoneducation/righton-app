import React, { useState, useCallback } from 'react';
import { CircularProgress, Grid, MenuItem, Divider, Typography, Box, TextField  } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IGameTemplate, ITeam, CloudFrontDistributionUrl } from '@righton/networking';
import { StartEndGameScrollBoxStyled } from '../../lib/styledcomponents/layout/ScrollBoxStyled';
import SearchIcon from '../../images/SearchIcon.svg';
import RightOnPlaceHolder from '../../images/RightOnLogo.png';

const PStyled = styled(Typography)({
  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'center',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box'
})

const MenuItemStyled = styled(Box)(({isSelected}) => ({
  border: `${isSelected ? '4px solid  #0094FF' : '0px solid transparent'}`,
  padding: `${isSelected ? '0px' : '4px'}`,
  borderRadius: '14px',
  width: '100%',
  backgroundColor: 'white',
  cursor: 'default',
  fontSize: '24px',
  display: 'flex',
  alignItems: 'stretch',
  gap: '8px',
  justifyContent: 'flex-end',
  boxSizing: 'border-box',
  overflow: 'hidden',
  minHeight: '110px',
}))

const LeftBox = styled(Box)(({isSelected}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  paddingLeft: '16px',
  paddingRight: '8px',
  paddingTop: '12px',
  paddingBottom: '12px',
  width: '100%',
  objectFit: 'cover',
}))

const RightBox = styled('img')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: "center",
  backgroundColor: "#C4C4C4",
  maxWidth: '110px',
  objectFit: 'cover',
  boxSizing: 'border-box',
  margin: '-4px',
})


const TopBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between'
})
const TopBoxText1 = styled(Typography)({
  fontSize:"12px",
  fontWeight:700, 
  lineHeight:'18px',
})

const TopBoxText2 = styled(Typography)({
  fontSize:"12px",
  fontWeight:700, 
  lineHeight:'18px',
  color: '#159EFA',
  flexShrink: 1,
})

const TitleStyled = styled(Typography)({
  fontSize:"14px",
  fontWeight: 700,
  lineHeight: '21px',
  fontFamily: 'Poppins, sans-serif',
  color: '#384466',
  width: '100%',
  wordWrap: 'break-word', whiteSpace: "normal", 
  textOverflow: "ellipsis",
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
  overflow: 'hidden',
})

const BoxStyled = styled(Box)({
  margin: 'auto',
})

const SearchStyled = styled(Box)({
  minHeight: '30px',
  height: "36px",
  borderRadius: '18px',
  display: 'flex',
  justifyContent: 'flexStart',
  alignItems:'center',
  background: 'white',
  gap: '4px',
  paddingLeft: '6px',
  width: '100%',
  boxSizing: 'border-box'
})

const SearchIconStyled = styled(Box)({
  paddingLeft: '2px',
  marginLeft: '2px',
  height: '32px',
  width: '32px',
  color: '#87B8DB',
})

const InputInputStyled = styled(TextField)({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-root': {
      '& fieldset': {
        border: 'none', 
      },
  },
});

const StyledGameContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box'
});

interface SuggestedGamesProps {
  gameTemplates: IGameTemplate[];
  teams: ITeam[] | null;
  selectedSuggestedGame: string | null;
  setSelectedSuggestedGame: (value: string) => void;
  searchText: string;
  handleUpdateSearchText: (value: string) => void;
}

function SuggestedGames ({ 
  gameTemplates,
  teams, 
  selectedSuggestedGame,
  setSelectedSuggestedGame, 
  searchText,
  handleUpdateSearchText,
}: SuggestedGamesProps) {
    const theme = useTheme();
    const renderGradeTypography = (gametemplate: IGameTemplate) => {
      const { grade, domain, cluster, standard } = gametemplate;
  
      if (grade === 'Mashup') {
        return <TopBoxText1 style={{ fontWeight: 700, color: '#9139F8' }}>Mashup</TopBoxText1>;
      }
      if (grade === 'Misc' && domain === 'Misc') {
        return <TopBoxText1 style={{ fontWeight: 700, color: '#9139F8' }}>Misc.</TopBoxText1>;
      }
      if (grade === 'Misc') {
        return <TopBoxText1 style={{ fontWeight: 700, color: '#9139F8' }}>{`${domain}`}</TopBoxText1>;
      }
      if (grade && domain) {
        const clusterCombined = cluster ? `.${cluster}` : '';
        const standardCombined = standard ? `.${standard}` : '';
        const domainCombined = domain ? `.${domain}` : '';
        return (
          <TopBoxText1 style={{ fontWeight: 700, color: '#9139F8' }}>
            {`${grade}${domainCombined}${clusterCombined}${standardCombined}`}
          </TopBoxText1>
        );
      }
      return null;
    };
    console.log(gameTemplates);
    return (
        <StartEndGameScrollBoxStyled>
            <SearchStyled>
              <SearchIconStyled>
                <img src={SearchIcon} alt="Search Icon" />
              </SearchIconStyled>
              <InputInputStyled 
                placeholder = "Search outside suggestions"
                value={searchText}
                onChange={(e: any) => handleUpdateSearchText(e.target.value)}
              />
            </SearchStyled>
            <BoxStyled>
                <PStyled>Continue your current session with our suggested games:</PStyled>
            </BoxStyled>
            {gameTemplates.length === 0 && 
              <>
                <CircularProgress style={{color:`${theme.palette.primary.circularProgress}`}}/>
                <Typography variant='h4' color={`${theme.palette.primary.main}`}>
                  Suggested games are loading ...
                </Typography>
              </>
            }
            <StyledGameContainer>
            {gameTemplates.length > 0 && gameTemplates.map((gameTemplate) => (
                <MenuItemStyled isSelected={gameTemplate.id === selectedSuggestedGame} key={uuidv4()} onClick={() => setSelectedSuggestedGame(gameTemplate.id)}>
                  <LeftBox isSelected={gameTemplate.id === selectedSuggestedGame}>
                    <TopBox>
                      {gameTemplate.grade === 'Mashup' ? (<TopBoxText1 style={{ fontWeight: 700, color: '#9139F8' }}>Mashup</TopBoxText1>) : null}
                      {renderGradeTypography(gameTemplate)}
                      <TopBoxText2>{gameTemplate.questionTemplates && gameTemplate.questionTemplates?.length > 1 ? `${gameTemplate.questionTemplates?.length} questions` : `${gameTemplate.questionTemplates?.length} question`}</TopBoxText2>
                    </TopBox>
                    <TitleStyled>{gameTemplate.title}</TitleStyled>
                    <Box style ={{width: '100%'}}>
                      <Typography style ={{fontSize:"12px", fontWeight:"500", 
                        wordWrap: 'break-word', whiteSpace: "normal", 
                        textOverflow: "ellipsis",
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',}} >
                        {gameTemplate.description}
                      </Typography>    
                    </Box>
                  </LeftBox>
                  {gameTemplate.imageUrl ? <RightBox src={`${CloudFrontDistributionUrl}${gameTemplate.imageUrl}`} alt="Game Template" /> :
                  <RightBox src={RightOnPlaceHolder} alt="Placeholder"/>}
                </MenuItemStyled>
            ))}
            </StyledGameContainer>
        </StartEndGameScrollBoxStyled>
    )
}
export default SuggestedGames;
