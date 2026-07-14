import React, {useCallback} from 'react';
import { VictoryLabel } from 'victory';
import { useTheme } from '@mui/material/styles';
import check from '../../img/Pickedcheck_white.svg';

export default function CustomLabel(props: any) {
  const {x, y, datum, noResponseLabel, isShortAnswerEnabled, customBarSelectedWidth, isPrevPhaseResponses} = props;
  const theme = useTheme();
  const finalText = datum.rawAnswer.length > 40 ? `${datum.rawAnswer.substring(0, 40)}...` : datum.rawAnswer;
  const checkSize = 16;
  // done to prevent embedding a nested ternary in the render function
  const labelPadding = useCallback(() => {
    if (isShortAnswerEnabled){
      if (datum.isCorrect)
        return (theme.sizing.mdPadding - theme.sizing.xxSmPadding) * 2;
      return (theme.sizing.mdPadding - theme.sizing.xxSmPadding);
    }
    return theme.sizing.defaultVictoryPadding + theme.sizing.xxSmPadding;
  }, [isShortAnswerEnabled, datum.isCorrect, theme.sizing.mdPadding, theme.sizing.xxSmPadding, theme.sizing.defaultVictoryPadding]);
  return (
    <g style={{maxWidth: '100%'}}>
      {datum.count !== 0 && isShortAnswerEnabled && (
        <>
          {datum.isCorrect && (
            <image
              href={check}
              x={theme.sizing.mdPadding - theme.sizing.xxSmPadding}
              // vertically center the checkmark on the adjacent label's middle:
              // y - lgPadding was the old top edge; add half the box so the
              // image's own middle (y + height/2) lands on the letter's middle.
              y={y - theme.sizing.lgPadding + (18 - checkSize) / 2}
              width={checkSize}
              height={checkSize}
            />
          )}
          <VictoryLabel
            {...props}
            x={labelPadding()}
            y={y- theme.sizing.labelOffsetResponses}
            dx={0}
            dy={-theme.sizing.barThicknessResponses / 2 - theme.sizing.xxSmPadding}
            textAnchor="start"
            verticalAnchor="end"
            text={finalText}
            style={{
              fontSize: 15,
              fill: 'white',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: customBarSelectedWidth
            }}
          />
        </>
      )}
      <VictoryLabel
        {...props}
        x={x > 70 ? x - theme.sizing.labelOffsetResponses : x + (theme.sizing.mdPadding - theme.sizing.xxSmPadding)}
        y={y}
        textAnchor="end"
        verticalAnchor="middle"
        text={datum.count > 0 ? `${Math.ceil(datum.count)}` : ''}
        style={{
          fontSize: 15,
          fill:
            datum.count === 0 ||
            datum.multiChoiceCharacter === noResponseLabel ||
            x <= 70 ||
            isPrevPhaseResponses
              ? '#FFF'
              : '#384466',
        }}
      />
    </g>
  );
}
