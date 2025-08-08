import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { StyledFlexBox } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';
import blueMonsterSideWays from '../../images/blueMonsterSideways.svg';
import blueMonstersInverse from '../../images/blueMonstersInverse.svg';
import greenMonstersDiagonal from '../../images/greenMonstersDiaganol.svg';
import pinkMonstersDiagonal from '../../images/pinkMonstersDiagonal.svg';
import redMonster from '../../images/red-monster.svg';
import yellowMonster from '../../images/yellowMonsterInCorner.svg';

interface IValueCards {
  screenSize: ScreenSize;
}

const ourValues = [
  {
    title: 'Trust and open communication',
    subText: 'Seeking to understand, then be understood',
    img: blueMonstersInverse,
    textBgColor: '#394A99',
    imgBgColor: '#2B3873',
  },
  {
    title: 'Positive culture of error',
    subText: 'Learning from mistakes, iterating, and improving',
    img: redMonster,
    textBgColor: '#991019',
    imgBgColor: '#800D15',
  },
  {
    title: 'Gratitude',
    subText: 'Keeping a grateful mindset through ups and downs',
    img: pinkMonstersDiagonal,
    textBgColor: '#712773',
    imgBgColor: '#581F59',
  },
  {
    title: 'Humble perseverance',
    subText: 'Falling down seven times, getting up eight',
    img: yellowMonster,
    textBgColor: '#B2315E',
    imgBgColor: '#992A51',
  },
  {
    title: 'Rising together',
    subText: 'Lifting ourselves up by lifting others',
    img: greenMonstersDiagonal,
    textBgColor: '#2B6573',
    imgBgColor: '#214F59',
  },
  {
    title: "Beginner's mindset",
    subText: 'Embarking on all journeys with an open mind',
    img: blueMonsterSideWays,
    textBgColor: '#34448C',
    imgBgColor: '#2C3975',
  },
];

export default function ValueCards({ screenSize }: IValueCards) {
  return (
    <StyledFlexBox
      gap={48}
      direction={screenSize === ScreenSize.LARGE ? 'row' : 'column'}
      align="center"
      justify="center"
      sx={{
        flexWrap: 'wrap',
        whiteSpace: 'wrap',
        maxWidth: `calc((355px * 3) + (48px * 2))`,
      }}
    >
      {ourValues.map(({ title, subText, img, imgBgColor, textBgColor }, i) => (
        <StyledFlexBox key={title} direction="row" gap={0}>
          {/* Image */}
          <StyledFlexBox
            sx={{
              backgroundColor: imgBgColor,
              width: '100%',
              borderTopLeftRadius: '24px',
              borderBottomLeftRadius: '24px',
            }}
          >
            <Box
              sx={{ borderRadius: '24px' }}
              width="160px"
              height="160px"
              component="img"
              src={img}
              alt={title}
            />
          </StyledFlexBox>

          {/* Content */}
          <StyledFlexBox
            justify="center"
            width="195px"
            height="160px"
            gap={7}
            sx={{
              borderTopRightRadius: '24px',
              borderBottomRightRadius: '24px',
              minWidth: '195px',
              padding: '13px 13px 32px 13px',
              backgroundColor: textBgColor,
            }}
          >
            <Typography
              sx={{ color: '#fff' }}
              fontFamily="Roboto"
              fontSize="19px"
              lineHeight="19px"
              fontWeight={700}
            >
              {title}
            </Typography>
            <Typography
              sx={{ color: '#fff' }}
              fontFamily="Roboto"
              fontSize="14px"
              lineHeight="17px"
              fontWeight={400}
            >
              {subText}
            </Typography>
          </StyledFlexBox>
        </StyledFlexBox>
      ))}
    </StyledFlexBox>
  );
}
