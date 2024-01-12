import React from 'react';
import { PlayedQuestionBox, UnplayedQuestionBox, CurrentQuestionIndicator, CurrentQuestionBoxPhase2 } from '../lib/styledcomponents/QuestionIndicatorComponents';
import QuestionIndicatorContainer from '../lib/styledcomponents/QuestionIndicatorContainer';

interface QuestionIndicatorProps {
    totalQuestions?: number;
    currentQuestionIndex?: number;
    statePosition?: number;
} // eslint-disable-line

export default function QuestionIndicator({
    totalQuestions,
    currentQuestionIndex,
    statePosition,
}: QuestionIndicatorProps) {
    const indicators = Array.from({ length: totalQuestions ?? 0 }, (_, index) => {
        if (index < currentQuestionIndex!) {
            return <PlayedQuestionBox key={index}>{index + 1}</PlayedQuestionBox>;
        }
        if (index > currentQuestionIndex!) {
            return <UnplayedQuestionBox key={index}>{index + 1}</UnplayedQuestionBox>;
        }
        if (statePosition! < 5) {
            return <CurrentQuestionIndicator key={index}>{index + 1}</CurrentQuestionIndicator>;
        }
        return <CurrentQuestionBoxPhase2 key={index}>{index + 1}</CurrentQuestionBoxPhase2>;
    });

    return (
        <QuestionIndicatorContainer>
            {indicators}
        </QuestionIndicatorContainer>
    );
}