import React from 'react';
import { GameSessionState } from '@righton/networking';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion, easeOut } from "framer-motion";
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import QuestionIndicator from './QuestionIndicator';
import playerIcon from '../img/playerIcon.svg';
import HostPlayerIconContainer from '../lib/styledcomponents/HostPlayerIconContainer';
import { LocalModel } from '../lib/HostModels';
import Timer from './Timer';
import TimerAddButton from '../lib/styledcomponents/TimerAddButton';

interface HeaderContentProps {
    currentState: GameSessionState;
    isCorrect: boolean;
    isIncorrect: boolean;
    totalQuestions?: number;
    currentQuestionIndex?: number;
    statePosition?: number;
    totalTime: number;
    currentTimer: number;
    isPaused: boolean;
    isFinished: boolean;
    scope4: React.RefObject<HTMLDivElement>;
    handleTimerIsFinished: () => void;
    localModel?: LocalModel;

} // eslint-disable-line

export default function HeaderContent({
    currentState,
    totalQuestions,
    currentQuestionIndex,
    statePosition,
    isCorrect,
    isIncorrect,
    totalTime,
    currentTimer,
    isPaused,
    isFinished,
    localModel,
    scope4,
    handleTimerIsFinished,
}: HeaderContentProps) {
    const theme = useTheme(); // eslint-disable-line
    const { t } = useTranslation();

    const stateMap = {
        [GameSessionState.NOT_STARTED]: t('gameinprogress.header.notstarted'),
        [GameSessionState.TEAMS_JOINING]: t('gameinprogress.header.teamsjoining'),
        [GameSessionState.CHOOSE_CORRECT_ANSWER]: t(
            'gameinprogress.header.choosecorrectanswer'
        ),
        [GameSessionState.CHOOSE_TRICKIEST_ANSWER]: t(
            'gameinprogress.header.choosetrickiestanswer'
        ),
        [GameSessionState.PHASE_1_DISCUSS]: t(
            'gameinprogress.header.phase1discuss'
        ),
        [GameSessionState.PHASE_2_DISCUSS]: t(
            'gameinprogress.header.phase2discuss'
        ),
        [GameSessionState.PHASE_2_START]: t('gameinprogress.header.phase2start'),
        [GameSessionState.PHASE_1_RESULTS]: t(
            'gameinprogress.header.phase1results'
        ),
        [GameSessionState.PHASE_2_RESULTS]: t(
            'gameinprogress.header.phase2results'
        ),
        [GameSessionState.FINAL_RESULTS]: t('gameinprogress.header.finalresults'),
        [GameSessionState.FINISHED]: t('gameinprogress.header.finished'),
    };

    const stateCheck = (
        currentStateForCheck: GameSessionState,
        isCorrectForCheck: boolean,
        isIncorrectForCheck: boolean
    ) => {
        if (isCorrectForCheck) return t('gameinprogress.header.correct');
        if (isIncorrectForCheck) return t('gameinprogress.header.incorrect');
        return stateMap[currentStateForCheck];
    };

    const handleTimerAddButtonClick = () => {
        console.log('TimerAddButton clicked!');
    };

    return (
        <HeaderStackContainerStyled>
            
                <Container maxWidth="md">
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <QuestionIndicator
                                totalQuestions={totalQuestions}
                                currentQuestionIndex={currentQuestionIndex}
                                statePosition={statePosition}
                            />
                        </Grid>
                        <Grid item>
                            <HostPlayerIconContainer>
                                <Typography variant="subtitle2">
                                    {t('gamesession.player')}
                                </Typography>
                                <img src={playerIcon} alt="Player Icon" />
                            </HostPlayerIconContainer>
                        </Grid>
                    </Grid>
                    <Grid item style={{ marginTop: `${theme.sizing.smallPadding}px` }}>
                        <Typography variant="h1">
                            {stateCheck(currentState, isCorrect, isIncorrect)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container justifyContent="space-between" alignItems="center" >
                            {(currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
                                currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) &&
                                localModel ? (
                                <Timer
                                    totalTime={totalTime}
                                    currentTimer={currentTimer}
                                    isFinished={isFinished}
                                    isPaused={isPaused}
                                    handleTimerIsFinished={handleTimerIsFinished}
                                    localModel={localModel}
                                />
                            ) : null}
                            <TimerAddButton onClick={handleTimerAddButtonClick}>
                                <Typography variant="subtitle2" style={{ fontSize: '14px' }}>
                                    {t('gamesession.addtime')}
                                </Typography>
                            </TimerAddButton>
                        </Grid>
                    </Grid>
                </Container>
            
        </HeaderStackContainerStyled>
    );
}