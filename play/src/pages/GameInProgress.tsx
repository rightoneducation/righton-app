import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Stack, Box, Container, Paper} from '@mui/material';
import { GameSessionState, ITeam } from '@righton/networking';
import HeaderContent from '../components/HeaderContent';
import FooterContent from '../components/FooterContent';
import Theme from '../lib/Theme';

const StackContainer = styled(Stack)({
  height: '100vh',
  width: '100vw',
});

const HeaderStackItem = styled(Stack)(
  ({ theme }) => ({
    paddingTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
    background: theme.palette.primary.mainGradient,
    border: 'none',
    width: '100vw',
    height: '68px',
  })
);

const BodyStackItem = styled(Stack)({
  position: 'relative',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  border: 'none',
});

const BodyBoxUpper = styled(Box)(
  ({ theme }) => ({
    height: '120px',
    width: '100vw',
    background: theme.palette.primary.mainGradient,
    boxShadow: '0px 10px 10px rgba(0, 141, 239, 0.25)',
    zIndex: 1,
  })
);

const BodyBoxLower = styled(Box)(
  ({ theme }) => ({
    flex: 1,
    width: '100vw',
    backgroundColor: theme.palette.primary.main,
    zIndex: 0,
  })
);

const BodyColumnContainer = styled(Container)({
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '40px',
    marginRight: '40px',
    zIndex: 2,
});

const BodyCard = styled(Paper)(
  ({ theme }) => ({
    height: '400px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '24px',
  })
);

const FooterStackItem = styled(Stack)(
  ({theme}) => ({
    paddingBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    height: '60px',
    width: '100vw',
    border: 'none',
  })
);

interface GameInProgressProps {
  teams?: ITeam[];
  id: string;
  currentState: GameSessionState;
  teamAvatar: number;
}

export default function GameInProgress({
  teams,
  id,
  currentState,
  teamAvatar,
}: GameInProgressProps) {
  const [gameSessionState, setCurrentState] = React.useState(currentState); // eslint-disable-line @typescript-eslint/no-unused-vars
  const currentTeam = teams ? teams?.find((team) => team.id === id) : undefined;

  const handleTimerIsFinished = () => {
    console.debug('finished');
  };

  return (
      <StackContainer direction="column" alignItems="center" justifyContent="space-between" >
        <HeaderStackItem>
            <HeaderContent
              currentState={gameSessionState}
              isCorrect={false}
              isIncorrect={false}
              totalTime={15}
              isPaused={false}
              isFinished={false}
              handleTimerIsFinished={handleTimerIsFinished}
            />
        </HeaderStackItem>
        <BodyStackItem>
          <BodyBoxUpper />
          <BodyBoxLower />
          <BodyColumnContainer maxWidth="sm">
            <Typography variant='h2' sx={{marginTop: '16px', marginBottom: '12px'}}> Body Header </Typography>
            <BodyCard elevation={3}>
              <Typography variant='h4'> Card Area </Typography> 
            </BodyCard>
          </BodyColumnContainer>
        </BodyStackItem>
        <FooterStackItem>
            <FooterContent
              avatar={teamAvatar}
              teamName={currentTeam ? currentTeam.name : 'Team One'}
              newPoints={10}
              score={120}
            />
        </FooterStackItem>
      </StackContainer>
  );
}

GameInProgress.defaultProps = {
  teams: null,
};
