import React, {useCallback} from 'react';
import { VictoryLabel } from 'victory';
import check from '../../images/Pickedcheck_white.svg';

export default function CustomLabel(props) {
  const {
    x,
    y,
    datum,
    barThickness,
    labelOffset,
    xSmallPadding,
    mediumLargePadding,
    xLargePadding,
    defaultVictoryPadding,
    noResponseLabel,
    isShortAnswerEnabled,
  } = props;
  // done to prevent embedding a nested ternary in the render function
  const labelPadding = useCallback(() => {
    if (isShortAnswerEnabled){
      if (datum.answerCorrect)
        return mediumLargePadding * 2;
      return mediumLargePadding;
    }
    return defaultVictoryPadding + xSmallPadding;
  }, [isShortAnswerEnabled, datum.answerCorrect, mediumLargePadding, defaultVictoryPadding, xSmallPadding]); 

  return (
    <g>
      {datum.answerCount !== 0 && isShortAnswerEnabled && (
        <>
          {datum.answerCorrect && (
            <foreignObject x={mediumLargePadding} y={y - xLargePadding} width={16} height={18}>
              <span>
                <img src={check} alt="correct answer"/>
              </span>
            </foreignObject>
          )} 
          <VictoryLabel
            {...props}
            x={labelPadding()}
            y={y- labelOffset}
            dx={0}
            dy={-barThickness / 2 - xSmallPadding}
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
        x={x > 70 ? x - labelOffset : x + mediumLargePadding}
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
