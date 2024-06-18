import React from 'react';
import { VictoryLabel } from 'victory';
import { Tooltip, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import check from '../../images/Pickedcheck.svg';
import noResponse from '../../images/noResponse.svg';

const StyledVictoryLabel = styled(VictoryLabel, {
  shouldForwardProp: (prop) => prop !== 'fillTick',
})(({fillTick}) => ({
  fill: fillTick ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)',
  fontFamily: 'Poppins',
  fontWeight: '800',
  fontSize: '16px',
}));

const TooltipBox = styled(Box)({
  whiteSpace: 'pre-line',
  textAlign: 'center',
})

interface CustomTickProps {
    x: number;
    y: number;
    index: number;
    text: string;
    correctChoiceIndex: number;
    statePosition: number;
};

export default function CustomTick({
  x,
  y,
  index,
  text,
  correctChoiceIndex,
  statePosition,
}: CustomTickProps) {
  const theme = useTheme();
  const showCustomTick = index ===  correctChoiceIndex;
  const fillTick = statePosition === 6 && showCustomTick;
  const isNoResponse = index === 0;

  return (
    <g>
      {showCustomTick && (
        <foreignObject
          x={x - theme.sizing.mdPadding}
          y={y - theme.sizing.mdPadding / 2.5}
          width={16}
          height={18}
        >
          <Tooltip
            title={
              <TooltipBox>
                This is the {'\n'} correct answer
              </TooltipBox>
            }
            placement="bottom"
            arrow
          >
            <span>
              <img src={check} alt="correct answer" />
            </span>
          </Tooltip>
        </foreignObject>
      )}
      {isNoResponse ? (
        <foreignObject x={x - 1} y={y - theme.sizing.smPadding} width={16} height={32}>
          <Tooltip
            title={
              <TooltipBox>
                Players who {'\n'} have not responded
              </TooltipBox>
            }
            placement="bottom"
            arrow
          >
            <span>
              <img src={noResponse} alt="no response" />
            </span>
          </Tooltip>
        </foreignObject>
      ) : (
        <StyledVictoryLabel x={x} y={y} text={text} fillTick={fillTick}/>
      )}
    </g>
  );
}
