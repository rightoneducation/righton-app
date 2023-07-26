import React from 'react';
import { VictoryLabel } from 'victory';
import check from '../../images/Pickedcheck.svg';

const CustomTick = ({ x, y, index, text, reversedResponses, correctChoiceIndex, statePosition }) => {
    const showCustomTick = index === reversedResponses.length - 1 - correctChoiceIndex;
    const fillTick = statePosition === 6 && showCustomTick;
    return (
        <g>
            {showCustomTick && (
                <foreignObject x={x - 25} y={y - 9.5} width={16} height={18}>
                    <img src={check} alt={"correct answer"} />
                </foreignObject>
            )}
            <VictoryLabel x={x} y={y} text={text} style={{
                fill: fillTick ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'Poppins',
                fontWeight: '800',
            }} />
        </g>
    );
};

export default CustomTick;
