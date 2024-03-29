import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { IQuestion } from '@righton/networking';

interface GameCardProps {
  questions: IQuestion[];
  title: string;
}

const CardStyled = styled(Card)({
    height: '95px',
    width: '311px',
    borderRadius: '18px',
    margin: 'auto',
})

const TypographyCCSS = styled(Typography)({
    fontWeight: '700',
    color: 'rgba(155, 169, 208, 1)',
    fontFamily: 'Poppins',
    fontStyle: 'Bold',
    fontSize: '12px',
    lineHeight: '18px',
    textAlign: 'left',
    marginTop: '7px',
})

const TypographyQuestion = styled(Typography)({
    fontWeight: 'bold',
    color: 'rgba(155, 169, 208, 1)',
    textAlign: 'right',
    fontFamily: 'Poppins',
    fontStyle: 'Bold',
    fontSize: '12px',
    lineHeight: '100%',
    marginTop: '7px',
    marginRight: '-120%',
})

const TypographyGameTitle = styled(Typography)({
  color: 'rgba(56, 68, 102, 1)',
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontWeight: 'bold',
  lineHeight: '21px',
  verticalAlign: 'Top',
  marginTop: '7px',
  fontStyle: 'normal',
})

const gameCCSS = '7. RP. A. 3';

function GameCard({ questions, title }: GameCardProps) {
  return (
    <Grid container item xs={12}>
      <CardStyled>
        <CardContent>
          <Grid container>
            <Grid container item xs={8}>
              <Grid item xs={7}>
                <TypographyCCSS>{gameCCSS}</TypographyCCSS>
              </Grid>
              <Grid item xs={5}>
                <TypographyQuestion>
                  {`${questions ? questions.length : 0} question`}
                </TypographyQuestion>
              </Grid>
              <Grid item xs={12}>
                <TypographyGameTitle gutterBottom>{title}</TypographyGameTitle>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardStyled>
    </Grid>
  );
}

export default GameCard;
