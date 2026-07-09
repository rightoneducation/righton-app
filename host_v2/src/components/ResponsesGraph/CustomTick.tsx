import React from 'react';
import { VictoryLabel } from 'victory';
import { Tooltip, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import check from '../../img/Pickedcheck_white.svg';
import noResponse from '../../img/noResponse.svg';

const TooltipBox = styled(Box)({
  whiteSpace: 'pre-line',
  textAlign: 'center',
})

export default function CustomTick(props: any) {
  const { x, y, index, data, correctChoiceIndex, statePosition} = props;
  const theme = useTheme();
  const showCustomTick = index ===  correctChoiceIndex;
  const fillTick = statePosition === 6 && showCustomTick;
  const isNoResponse = index === 0;
  const checkSize = 16;
  return (
    <g>

      {showCustomTick && (
        <Tooltip
          title={
            <TooltipBox>
              This is the {'\n'} correct answer
            </TooltipBox>
          }
          placement="bottom"
          arrow
        >
          <image
            href={check}
            x={x - theme.sizing.mdPadding}
            // center the checkmark on the letter's vertical middle (its VictoryLabel y)
            y={y - checkSize / 2}
            width={checkSize}
            height={checkSize}
          />
        </Tooltip>
      )}
      <VictoryLabel 
        x={x} 
        y={y} 
        text={data[index].multiChoiceCharacter} 
        style={{
          fill: '#FFF',
          fontFamily: 'Poppins',
          fontWeight: '800',
          fontSize: '16px',
        }}
      />
    </g>
  );
}
