import React, {useCallback} from 'react';
import { VictoryLabel } from 'victory';
import { useTheme } from '@mui/material/styles';
import check from '../../images/Pickedcheck_white.svg';

interface CustomLabelProps {
  props: {
    x: number;
    y: number;
    datum: any;
    noResponseLabel: string;
    isShortAnswerEnabled: boolean;
  };
};

export default function CustomLabel({props}: CustomLabelProps) {
  const {
    x,
    y,
    datum,
    noResponseLabel,
    isShortAnswerEnabled,
  } = props;

  const theme = useTheme();
  // done to prevent embedding a nested ternary in the render function
  const labelPadding = useCallback(() => {
    if (isShortAnswerEnabled){
      if (datum.answerCorrect)
        return (theme.sizing.mdPadding - theme.sizing.xxSmPadding) * 2;
      return (theme.sizing.mdPadding - theme.sizing.xxSmPadding);
    }
    return theme.sizing.defaultVictoryPadding + theme.sizing.xxSmPadding;
  }, [isShortAnswerEnabled, datum.answerCorrect, theme.sizing.mdPadding, theme.sizing.xxSmPadding, theme.sizing.defaultVictoryPadding]);

  return (
    <g>
      {datum.answerCount !== 0 && isShortAnswerEnabled && (
        <>
          {datum.answerCorrect && (
            <foreignObject x={theme.sizing.mdPadding - theme.sizing.xxSmPadding} y={y - theme.sizing.lgPadding} width={16} height={18}>
              <span>
                <img src={check} alt="correct answer"/>
              </span>
            </foreignObject>
          )} 
          <VictoryLabel
            {...props}
            x={labelPadding()}
            y={y- theme.sizing.labelOffsetResponses}
            dx={0}
            dy={-theme.sizing.barThicknessResponses / 2 - theme.sizing.xxSmPadding}
            textAnchor="start"
            verticalAnchor="end"
            text={datum.answerText}
            style={{
              fontSize: 15,
              fill: 'white',
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
        text={datum.answerCount > 0 ? `${Math.ceil(datum.answerCount)}` : ''}
        style={{
          fontSize: 15,
          fill:
            datum.answerCount === 0 ||
            datum.answerChoice === noResponseLabel ||
            x <= 70
              ? '#FFF'
              : '#384466',
        }}
      />
    </g>
  );
}
