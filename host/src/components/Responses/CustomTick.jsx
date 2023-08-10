import React from 'react';
import { VictoryLabel } from 'victory';
import check from '../../images/Pickedcheck.svg';
import { Tooltip } from '@material-ui/core';

const CustomTick = ({ x, y, index, text, reversedResponses, correctChoiceIndex, statePosition, largePadding }) => {
    const showCustomTick = index === reversedResponses.length - 1 - correctChoiceIndex;
    const fillTick = statePosition === 6 && showCustomTick;

    const isFirstLabel = index === 0;
    const isFirstLabelTooltip = isFirstLabel ? "Players who have not responded" : null;

    return (
        <g>
            {showCustomTick && (
                <foreignObject x={x - largePadding} y={y - largePadding/2.5} width={16} height={18}>
                    <Tooltip title="This is the correct answer" placement="top">
                        <img src={check} alt="correct answer" />
                    </Tooltip>
                </foreignObject>
            )}
            <VictoryLabel x={x} y={y} text={text} style={{
                fill: fillTick ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'Poppins',
                fontWeight: '800',
                fontSize: '16px'
            }}>
                {isFirstLabel && (
                    <Tooltip title={isFirstLabelTooltip} placement="top">
                        <span>{text}</span>
                    </Tooltip>
                )}
            </VictoryLabel>
        </g>
    );
};

export default CustomTick;

