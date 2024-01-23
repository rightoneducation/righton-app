import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Card, CardContent, Typography } from '@mui/material';



interface GameCardProps {
    questions: string[] | null;
    title: string;
}

const CardStyled = styled(Card)(({ theme }) => ({
    height: '95px',
    width: '311px',
    borderRadius: '18px',
    margin: 'auto',
}))

const TypographyCCSS = styled(Typography)(({ theme }) => ({
    fontWeight: '700',
    color: 'rgba(155, 169, 208, 1)',
    textAlign: 'right',
    fontFamily: 'Poppins',
    fontStyle: 'Bold',
    fontSize: '12px',
    lineHeight: '18px',
   // lineHeight: '100%',
  //  textAlign: 'left',
    marginTop: '7px',
}))

const TypographyQuestion = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: 'rgba(155, 169, 208, 1)',
    textAlign: 'right',
    fontFamily: 'Poppins',
    fontStyle: 'Bold',
    fontSize: '12px',
    lineHeight: '18px',
   // lineHeight: '100%',
    marginTop: '7px',
    marginRight: '-120%',
}))

const TypographyGameTitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(56, 68, 102, 1)',
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontWeight: 'bold',
  lineHeight: '21px',
//  lineHeight: '100%',
  verticalAlign: 'Top',
  marginTop: '7px',
  fontStyle: 'normal',
}))

const gameCCSS = '7. RP. A. 3';

function GameCard ({questions, title }: GameCardProps) {
    return (
        <Grid container item xs = {12}>
            <CardStyled>
                <CardContent>
                    <Grid container>
                        <Grid container item xs = {8}>
                            <Grid item xs={7}>
                                <TypographyCCSS>{gameCCSS}</TypographyCCSS>                                
                            </Grid>
                            <Grid item xs={5}>
                                <TypographyQuestion>
                                    {`${questions ? questions.length :0} question`}
                                </TypographyQuestion>
                            </Grid>
                            <Grid item xs = {12}>
                                <TypographyGameTitle gutterBottom>
                                    {title}
                                </TypographyGameTitle>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardStyled>
        </Grid>
    )
}

// const useStyles = makeStyles((theme : Theme) => ({
//   gameCard: {
//     height: '95px',
//     width: '311px',
//     borderRadius: '18px',
//     margin: 'auto',
//   },

//   gameTitle: {
//     color: 'rgba(56, 68, 102, 1)',
//     fontFamily: 'Poppins',
//     fontSize: '14px',
//     fontWeight: 'bold',
//     lineHeight: '21px',
//   //  lineHeight: '100%',
//     verticalAlign: 'Top',
//     marginTop: '7px',
//     fontStyle: 'normal',
//   },

//   questionCount: {
//     fontWeight: 'bold',
//     color: 'rgba(155, 169, 208, 1)',
//     textAlign: 'right',
//     fontFamily: 'Poppins',
//     fontStyle: 'Bold',
//     fontSize: '12px',
//     lineHeight: '18px',
//    // lineHeight: '100%',
//     marginTop: '7px',
//     marginRight: '-120%',
//   },

//   ccss: {
//     fontWeight: '700',
//     color: 'rgba(155, 169, 208, 1)',
//     textAlign: 'right',
//     fontFamily: 'Poppins',
//     fontStyle: 'Bold',
//     fontSize: '12px',
//     lineHeight: '18px',
//    // lineHeight: '100%',
//   //  textAlign: 'left',
//     marginTop: '7px',
//   },
// }));

export default GameCard;
