import React from 'react';
import { Grid, MenuItem, Divider, Typography, Box, TextField  } from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { IGameTemplate } from '@righton/networking';

import SearchIcon from '../../images/SearchIcon.svg';
import RightOnPlaceHolder from '../../images/RightOnLogo.png';

interface Team {
  name: string;
}

interface SuggestedGamesProps {
  teams: Team[] | null;
  setIsGameSelected: (value: boolean) => void; 
  isGameSelected: boolean
  gameTemplates: IGameTemplate[] | null
}

const GridStyled = styled(Grid)({

  color: 'rgba(255, 255, 255, 1)',
  fontWeight: 'bold',
  fontSize: '72px',
  textAlign: 'center',
  marginTop: '4%',
  // border: '1px solid black',

})

const HrStyled = styled(Divider)({
  
  marginTop: '30px',
  marginBottom: '25px',
  width: '266px',
  height: '1px',
  borderRadius: '1.54px',
  border: '0',
  // borderTop: '1px solid rgba(255, 255, 255, 0.25)',

})

const PStyled = styled(Typography)({

  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'center',
  // margin: 'auto',
  fontSize: '16px',
  // width: '292px',
  // border: '1px solid black',
  width: '100%',
  boxSizing: 'border-box'
})

const MenuItemStyled = styled(Box)({

  // margin: 'auto',
  // marginBottom: '15px',
  borderRadius: '14px',
  width: '100%',
  // height: '62px',

  backgroundColor: 'white',
  cursor: 'default',
  // background: 'rgba(255, 255, 255, 0.25)',
  // color: 'rgba(255, 255, 255, 1)',
  fontSize: '24px',
  display: 'flex',
  alignItems: 'stretch',
  gap: '8px',
  // border: '1px solid yellow',
  justifyContent: 'flex-end'

})

const LeftBox = styled(Box)({
  display: 'flex',
  // border: '1px solid green',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  paddingLeft: '16px',
  paddingRight: '8px',
  paddingTop: '12px',
  paddingBottom: '12px',
  width: '100%',
  // borderRadius: '14px',
  borderTopLeftRadius: '14px', 
  borderBottomLeftRadius: '14px', 
})

const RightBox = styled(Box)({
  display: 'flex',
  // border: '1px solid green',
  alignItems: 'center',
  justifyContent: "center",
  width: '25%',
  backgroundColor: "#C4C4C4",
  borderTopRightRadius: '14px', 
  borderBottomRightRadius: '14px', 
  // border: '1px solid green',
  maxWidth: '110px',
})


const TopBox = styled(Box)({
  display: 'flex',
  // border: '1px solid black',
  flexDirection: 'row',
  width: '100%',
  // flexWrap: 'wrap'
    // flexShrink: 1, // Allow the text to grow to fill the available space
  justifyContent: 'space-between'
})
const TopBoxText1 = styled(Typography)({
  fontSize:"12px",
  fontWeight:700, 
  lineHeight:'18px',
  // border: '1px solid green',
  // width: '100%',
  // flexShrink: 1, // Allow the text to grow to fill the available space
  // flexWrap: 'wrap'
})

const TopBoxText2 = styled(Typography)({
  fontSize:"12px",
  fontWeight:700, 
  lineHeight:'18px',
  // textAlign: 'right',
  color: '#159EFA',
  // width: '100%',
  // border: '1px solid blue',
  flexShrink: 1, // Allow the text to grow to fill the available space

  // fontWeight: 700,
  // color: '#159EFA',
  // textAlign: 'right',
  // marginRight: '15px',
  // width: '90%',
})

const TitleStyled = styled(Typography)({
  fontSize:"14px",
  fontWeight: 700,
  lineHeight: '21px',
  // border: '1px solid black',
  fontFamily: 'Poppins, sans-serif',
  color: '#384466',
  width: '100%'
  // fontWeight: 700,
  // height: '80%',
  // color: '#384466',
  // display: '-webkit-box',
  // WebkitBoxOrient: 'vertical',
  // WebkitLineClamp: 2,
  // overflow: 'hidden',
  // textOverflow: 'ellipsis',
  // maxWidth: '95%',
})

const BoxStyled = styled(Box)({
  margin: 'auto',
  // border: '1px solid black',

})

const SearchStyled = styled(Box)({
  minHeight: '30px',
  // width: '292px',
  height: "36px",
  borderRadius: '18px',
  // border: '2px solid #B1BACB', 
  display: 'flex',
  justifyContent: 'flexStart',
  alignItems:'center',
  background: 'white',
  gap: '4px',
  paddingLeft: '6px',
  // border: '1px solid yellow',
  width: '100%',
  boxSizing: 'border-box'
})

const SearchIconStyled = styled(Box)({
  paddingLeft: '2px',
  marginLeft: '2px',
  height: '32px',
  width: '32px',
  color: '#87B8DB',
  // border: '1px solid blue', 

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

const OuterBoxStyled = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '12px',
  paddingLeft: '12px',
  paddingRight: '12px',
  paddingTop: '16px',
  width: '100%',
  boxSizing: 'border-box'
});


function SuggestedGames ({ teams, setIsGameSelected, isGameSelected, gameTemplates }: SuggestedGamesProps) {
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

    return (
        <OuterBoxStyled>
            <SearchStyled>
              <SearchIconStyled>
                <img src={SearchIcon} alt="Search Icon" />
              </SearchIconStyled>
              <InputInputStyled 
              placeholder = "Search outside suggestions"
              />
            </SearchStyled>
            <BoxStyled>
                <PStyled>Continue your current session with our suggested games:</PStyled>
            </BoxStyled>
            {/* <HrStyled/> */}
            {gameTemplates && gameTemplates.map((gameTemplate) => (
              
                <MenuItemStyled key = {uuidv4()} onClick={()=> setIsGameSelected(!isGameSelected)}>
                  <LeftBox>
                    <TopBox>
                      {gameTemplate.grade === 'Mashup' ? (<TopBoxText1 style={{ fontWeight: 700, color: '#9139F8' }}>Mashup</TopBoxText1>) : null}
                      {renderGradeTypography(gameTemplate)}
                      {/* <TopBoxText1>{gametemplate.grade}</TopBoxText1> */}
                      <TopBoxText2>18 Questions</TopBoxText2>
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
                  <RightBox>
                    <img src={RightOnPlaceHolder} alt="Placeholder"/>
                  </RightBox>
                </MenuItemStyled>
              
            ))}
        </OuterBoxStyled>
    )
}

// const useStyles = makeStyles((theme) => ({
//     studentCount: {
//       color: 'rgba(255, 255, 255, 1)',
//       fontWeight: 'bold',
//       fontSize: '72px',
//       textAlign: 'center',
//       marginTop: '4%',
//     },

//     inSessionDiv: {
//       width: '80px',
//       height: '40px',
//       margin: 'auto',
//     },

//     inSession: {
//       color: 'rgba(255, 255, 255, 1)',
//       textAlign: 'center',
//       margin: 'auto',
//       fontSize: '16px',
//     },

//     studentCards: {
//       margin: 'auto',
//       marginBottom: '15px',
//       borderRadius: '14px',
//       width: '311px',
//       height: '62px',
//       background: 'rgba(255, 255, 255, 0.25)',
//       color: 'rgba(255, 255, 255, 1)',
//       fontSize: '24px',
//     },
//     name: {
//       fontWeight: 'bold',
//     },
//     removeStudent: {
//       color: 'white',
//       fontWeight: 'bold',
//       position: 'absolute',
//       right: '-10px',
//     },
//     hr: {
//       marginTop: '30px',
//       marginBottom: '25px',
//       width: '266px',
//       height: '1px',
//       borderRadius: '1.54px',
//       border: '0',
//       borderTop: '1px solid rgba(255, 255, 255, 0.25)',
//     },
//   }));

export default SuggestedGames;
