import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// icons for the avatar select screen
interface GamePlayButtonStyledProps {
  animate: boolean;
}

// gameplay button
// Extend the Button component with styled-components, applying the animation conditionally
export const GamePlayButtonStyled = styled(Button, {shouldForwardProp: (prop) => prop != 'animate'})<GamePlayButtonStyledProps>(({ theme, animate }) => ({
  minWidth: '180px', // per figma
  height: '26px',
  borderRadius: '22px',
  color: 'white',
  textTransform: 'none',
  marginTop: '20px',
  background: `linear-gradient(90deg, #159EFA 0%, #19e2fb 100%)`,
  backgroundSize: '200% 200%', // Required for gradient animation
  boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
  '&:hover': {
    background: `linear-gradient(90deg, #159EFA 0%, #19e2fb 100%)`,
  },
  animation: animate ? 'gradientAnimation 3s ease infinite' : 'none', // Apply the animation conditionally
  "@keyframes gradientAnimation": {
    "0%": { backgroundPosition: "0% 50%" },
    "25%": { backgroundPosition: "100% 50%" },
    "50%": { backgroundPosition: "0% 50%" },
    "75%": { backgroundPosition: "0% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));

export const GamePlayButtonStyledDisabled = styled(GamePlayButtonStyled)(
  ({ theme, animate }) => ({
    background: `#CFCFCF`,
    color: 'white',
    boxShadow: 'none',
    '&:hover': {
      background: `#CFCFCF`,
    }
  })
);

export const AnswerExplanationButtonStyled = styled(GamePlayButtonStyled)(
  ({ theme, animate }) => ({
    minWidth: '40px',
    width: '40px',
    height: '40px'
  })
)

export const PromptSubmitButtonStyled = styled(GamePlayButtonStyled)(
  ({ theme, animate }) => ({
    minWidth: '70px',
    width: '70px',
    height: '30px'
  })
)