import React from 'react';
import { VictoryLabel } from 'victory';
import check from '../../images/Pickedcheck.svg';

const isOpenEnded = true;

const CustomLabel = (props) => {
  const { statePosition, x, y, datum, barThickness, labelOffset, xSmallPadding, mediumLargePadding, defaultVictoryPadding, noResponseLabel, index, reversedResponses, correctChoiceIndex } = props;
  const showCustomTick = index === reversedResponses.length - 1 - correctChoiceIndex;
  return (
    <g>
      {datum.answerCount !== 0 &&
        <>
          {(showCustomTick && isOpenEnded && statePosition < 6) && (
            <foreignObject x={10} y={y-32} width={16} height={18}>
              <span>
              <img src={check} alt="correct answer"/>
            </span>
            </foreignObject>
          )}
          <VictoryLabel
            {...props}
            x={
              isOpenEnded
                ? showCustomTick
                  ? statePosition < 6
                    ? 32
                    : defaultVictoryPadding + xSmallPadding
                  : statePosition < 6
                  ? 10
                  : defaultVictoryPadding + xSmallPadding
                : defaultVictoryPadding + xSmallPadding
            }                      
            y={y - labelOffset}
            dx={0}
            dy={(-barThickness / 2) - xSmallPadding}
            textAnchor="start"
            verticalAnchor="end"
            text={`${datum.answerText}`}
            style={{
              fontSize: 15,
              fill: 'white',
            }}
          />
        </>
      }
      <VictoryLabel
        {...props}
        x={x > 70 ? x - labelOffset : x + mediumLargePadding}
        y={y}
        textAnchor="end"
        verticalAnchor="middle"
        text={datum.answerCount > 0 ? `${datum.answerCount}` : ''}
        style={{
          fontSize: 15,
          fill: datum.answerCount === 0 || datum.answerChoice === noResponseLabel || x <= 70 ? '#FFF' : '#384466',
        }}
      />
    </g>
  );
};

export default CustomLabel;