import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PlayedQuestionBox, UnplayedQuestionBox, CurrentQuestionIndicator, CurrentQuestionBoxPhase2 } from '../lib/styledcomponents/QuestionIndicatorComponents';
import QuestionIndicatorContainer from '../lib/styledcomponents/QuestionIndicatorContainer';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';

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
    // const theme = useTheme(); // eslint-disable-line
    // const { t } = useTranslation();
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
        <HeaderStackContainerStyled>
            <QuestionIndicatorContainer>
                {indicators}
            </QuestionIndicatorContainer>
        </HeaderStackContainerStyled>
    );
}