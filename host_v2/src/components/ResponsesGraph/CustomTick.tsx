import React from 'react';
import { VictoryLabel } from 'victory';
import { Tooltip, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import check from '../../img/Pickedcheck.svg';
import noResponse from '../../img/noResponse.svg';

const TooltipBox = styled(Box)({
  whiteSpace: 'pre-line',
  textAlign: 'center',
})

export default function CustomTick(props: any) {
  const { x, y, index, text, correctChoiceIndex, statePosition } = props;
  const theme = useTheme();
  const showCustomTick = index ===  correctChoiceIndex;
  const fillTick = statePosition === 6 && showCustomTick;
  const isNoResponse = index === 0;
  console.log(text);
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
      <VictoryLabel 
        x={x} 
        y={y} 
        text={text} 
        style={{
          fill: fillTick ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'Poppins',
          fontWeight: '800',
          fontSize: '16px',
        }}
      />
    </g>
  );
}
