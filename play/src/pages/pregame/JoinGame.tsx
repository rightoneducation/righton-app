import React, { ChangeEvent, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Box, Grid, Typography, Collapse, Fade, Zoom } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { isNameValid } from '../../lib/HelperFunctions';
import { InputPlaceholder } from '../../lib/PlayModels';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import InputTextFieldStyled from '../../lib/styledcomponents/InputTextFieldStyled';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import AvatarSelection from './joingamecontent/AvatarSelection';
import Logo from '../../img/rightOnLogo.svg';
import EnterNameHelp from '../../img/EnterNameHelp.svg';
import EnterNameHelpTriangle from '../../img/EnterNameHelpTriangle.svg';

const StackContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: theme.breakpoints.values.xs,
}));

const PaddedContainer = styled(Box)(({ theme }) => ({
  paddingLeft: `${theme.sizing.smallPadding}px`,
  paddingRight: `${theme.sizing.smallPadding}px`,
}));

const HelpIcon = styled('img')(({ theme }) => ({
  width: `21px`,
  height: '21px',
  paddingRight: `${theme.sizing.smallPadding}px`,
  top: 0,
  right: '16px'
}));

const EnterNameHelpTriangleStyled = styled('img')(({ theme }) => ({
  width: '25px',
  height: '15px',
  backgroundColor: 'rgba(255,255,255,0.2',
  paddingRight: `${theme.sizing.smallPadding}px`,
  top: 0,
  right: '16px'
}));

const SmallDeviceHelpBox = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: `rgba(255,255,255, 0.2)`,
  padding: `${theme.sizing.extraSmallPadding}px`,
  borderRadius: `${theme.sizing.extraSmallPadding}px`,
  boxSizing: 'border-box',
}));

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: '200px',
  },
});

const JoinGameFooter = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '48px',
  paddingTop: '40px'
}));

interface JoinGameBodyProps {
  isSmallDevice: boolean;
  isMedDevice: boolean;
}

const JoinGameBody = styled(Box)<JoinGameBodyProps>(({ theme, isSmallDevice, isMedDevice }) => ({
  paddingTop: '24px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
  width: (!isSmallDevice && !isMedDevice) ? '540px' : `${theme.sizing.pregameMinColumnWidth}px`,
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge,
  gap: '24px'
}));

interface JoinGameProps {
  isSmallDevice: boolean;
  isMedDevice: boolean;
  isShowCodeError: boolean;
  setIsShowCodeError: (value: boolean) => void;
  isShowNameError: boolean;
  setIsShowNameError: (value: boolean) => void;
  isShowNameInvalidError: boolean;
  setIsShowNameInvalidError: (value: boolean) => void;
  shouldShowAvatarSelect: boolean;
  setShouldShowAvatarSelect: (value: boolean) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  handleGameCodeClick: (gameSessionId: string) => Promise<boolean>;
  selectedAvatar: number;
  setSelectedAvatar: (value: number) => void;
  isButtonDisabled: boolean;
  setIsButtonDisabled: (value: boolean) => void;
}

export default function JoinGame({
  isSmallDevice,
  isMedDevice,
  isShowCodeError,
  setIsShowCodeError,
  isShowNameError,
  setIsShowNameError,
  isShowNameInvalidError,
  setIsShowNameInvalidError,
  shouldShowAvatarSelect,
  setShouldShowAvatarSelect,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  handleGameCodeClick,
  selectedAvatar,
  setSelectedAvatar,
  isButtonDisabled,
  setIsButtonDisabled,
}: JoinGameProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [gameCodeValue, setGameCodeValue] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const inputRef = React.useRef<HTMLDivElement>(null);

  // parsing the input value due to mui textfield limitations see: https://mui.com/material-ui/react-text-field/
  const handleGameCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const numericValue = newValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setGameCodeValue(numericValue);
    if (numericValue.length > 0 && firstName.length > 0 && lastName.length > 0){
      setShouldShowAvatarSelect(true);
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleFirstNameChange = (fName: string) => {
    setFirstName(fName);
    if (gameCodeValue.length > 0 && lastName.length > 0 && fName.length > 0){
      setShouldShowAvatarSelect(true);
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleLastNameChange = (lName: string) => {
    setLastName(lName);
    if (gameCodeValue.length > 0 && firstName.length > 0 && lName.length > 0){
      setShouldShowAvatarSelect(true);
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const validateInput = async (inputGameCodeValue: string) => {
    if (isNameValid(firstName) && isNameValid(lastName)){
      try {
        setIsJoining(true);
        await handleGameCodeClick(inputGameCodeValue);
        setIsJoining(false);
      } catch (error) {
        setIsJoining(false);
        if (inputRef.current)
          inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setIsShowNameInvalidError(true);
      if (inputRef.current)
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <BackgroundContainerStyled>
        <img
          style={{
            width: `${theme.sizing.pregameMinColumnWidth}px`,
            height: '118px',
            paddingTop: `${theme.sizing.extraLargePadding}px`,
          }}
          src={Logo}
          alt="Question"
        />
        <JoinGameBody isSmallDevice={isSmallDevice} isMedDevice={isMedDevice} style={{margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div ref={inputRef}/>
          {/* container here to trim the spacing set by parent stack between text and input, typ */}
          <Box sx={{ width: `${theme.sizing.pregameMinColumnWidth}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px'  }}>
            <Typography variant="h2" sx={{ weight: 700, fontSize: '18px', lineHeight: '20px', textAlign: 'center' }}>
              {t('joingame.gamecode.title')}
            </Typography>
            <InputTextFieldStyled
              data-testid="gameCode-inputtextfield"
              fullWidth
              variant="filled"
              autoComplete="off"
              placeholder={InputPlaceholder.GAME_CODE}
              onFocus={() => {setIsShowCodeError(false); setIsShowNameError(false); setIsShowNameInvalidError(false)}}
              onChange={handleGameCodeChange}
              value={gameCodeValue}
              style={{width: '100%', paddingLeft: '40px', paddingRight: '40px', boxSizing: 'border-box'}}
              InputProps={{
                disableUnderline: true,
                inputProps: {
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 4,
                  style: {
                    color: theme.palette.primary.darkBlue,
                    paddingTop: '9px',
                    textAlign: 'center',
                    fontSize: `${theme.typography.h2.fontSize}px`,
                    fontFamily: 'Poppins',
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ width: `${theme.sizing.pregameMinColumnWidth}px`, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box sx={{ width: '100%', display: 'flex'}}>
              <Typography variant="h2" sx={{ width: '100%', weight: 700, fontSize: '18px', lineHeight: '20px', textAlign: 'center', paddingLeft: '37px' }}>
                {t('joingame.playername.title')}
              </Typography>
              {isMedDevice
              ?  <HelpIcon
                    onClick={() => setShowHelp((prev)=>!prev)}
                    src={EnterNameHelp}
                    alt="NameHelp"
                  />
              : <StyledTooltip
                  title={
                    <>
                      <Typography variant="h2" sx={{ weight: 800, fontSize: '18px', lineHeight: '20px', textAlign: 'center', paddingBottom: '8px' }}>
                        Type in both your first and last name to enter the game.
                      </Typography>
                      <Typography variant="body1" sx={{ weight: 200, fontSize: '18px', lineHeight: '20px', textAlign: 'center', color: '#FFF' }}>
                        This will be used to identify you only during the game, and will not be stored.
                      </Typography>
                    </>
                  }
                  TransitionComponent={Zoom}
                  placement="right"
                  arrow
                >
                  <HelpIcon
                    src={EnterNameHelp}
                    alt="NameHelp"
                  />
                </StyledTooltip>
              }
            </Box>
            {isMedDevice &&
            <Collapse in={showHelp} >
              <Box style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0'}}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '14px', boxSizing: 'border-box', gap: 0}}>
                  <EnterNameHelpTriangleStyled src={EnterNameHelpTriangle}/>
                </Box>
                <SmallDeviceHelpBox>
                  <Typography variant="h2" sx={{ weight: 800, fontSize: '18px', lineHeight: '20px', textAlign: 'center', paddingBottom: '8px' }}>
                    Type in both your first and last name to enter the game.
                  </Typography>
                  <Typography variant="body1" sx={{ weight: 200, fontSize: '18px', lineHeight: '20px', textAlign: 'center', color: '#FFF' }}>
                    This will be used to identify you only during the game, and will not be stored.
                  </Typography>
                </SmallDeviceHelpBox>
              </Box>
              </Collapse>
            }
            <Grid container spacing={2} wrap="nowrap">
              <Grid item xs={6}>
                <InputTextFieldStyled
                  data-testid="playername-firstinputtextfield"
                  fullWidth
                  variant="filled"
                  autoComplete="off"
                  placeholder={t('joingame.playername.firstnamedefault') ?? ''}
                  onChange={(event) => handleFirstNameChange(event.target.value)}
                  onFocus={() => {setIsShowCodeError(false); setIsShowNameError(false); setIsShowNameInvalidError(false)}}
                  value={firstName}
                  InputProps={{
                    disableUnderline: true,
                    inputProps: {
                      style: {
                        color: theme.palette.primary.darkBlue,
                        paddingTop: '9px',
                        textAlign: 'center',
                        fontSize: `${theme.typography.h2.fontSize}px`,
                        fontFamily: 'Poppins',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <InputTextFieldStyled
                  data-testid="playername-lastinputtextfield"
                  fullWidth
                  variant="filled"
                  autoComplete="off"
                  placeholder={t('joingame.playername.lastnamedefault') ?? ''}
                  onChange={(event) => handleLastNameChange(event.target.value)}
                  onFocus={() => {setIsShowCodeError(false); setIsShowNameError(false);  setIsShowNameInvalidError(false)}}
                  value={lastName}
                  InputProps={{
                    disableUnderline: true,
                    inputProps: {
                      style: {
                        color: theme.palette.primary.darkBlue,
                        paddingTop: '9px',
                        textAlign: 'center',
                        fontSize: `${theme.typography.h2.fontSize}px`,
                        fontFamily: 'Poppins',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box style={{padding: 0}}>
            <PaddedContainer>
              <Collapse in={isShowCodeError}>
                <Typography
                  variant="h2"
                  sx={{
                    weight: 700,
                    textAlign: 'center',
                    marginBottom: `${theme.sizing.smallPadding}px`,
                  }}
                >
                  {t('joingame.gamecode.error1')}
                </Typography>
                {!isShowNameError ? 
                <Typography variant="h2" sx={{ weight: 700, textAlign: 'center' }}>
                  {t('joingame.gamecode.error2')}
                </Typography>
                :
                 <Typography variant="h2" sx={{ weight: 700, textAlign: 'center' }}>
                  {t('joingame.gamecode.error3')}
                </Typography>
                }
              </Collapse>
            </PaddedContainer>
            <PaddedContainer>
              <Collapse in={isShowNameInvalidError}>
                <Typography
                  data-testid="playername-invalidtext"
                  variant="h2"
                  sx={{     
                    weight: 700,
                    textAlign: 'center',
                    marginBottom: `${theme.sizing.smallPadding}px`,
                  }}
                >
                  Invalid Name Input.
                </Typography>
              </Collapse>
            </PaddedContainer>
          </Box>
          {shouldShowAvatarSelect &&
            <Fade in style={{ transformOrigin: '50% 0 0' }}
              timeout={{appear: 4000, enter: 4000}}
            >
              <div>
                <AvatarSelection isSmallDevice={isSmallDevice} isMedDevice={isMedDevice} selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
              </div>
            </Fade>
          }
        </JoinGameBody>

      <JoinGameFooter>
        <IntroButtonStyled disabled={isJoining || isButtonDisabled} onClick={() => validateInput(gameCodeValue)} style={{ opacity: (isJoining || isButtonDisabled) ? 0.5 : 1 }}>
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            {!isJoining ? t('joingame.gamecode.button') : t('joingame.gamecode.buttonJoining')}
          </Typography>
        </IntroButtonStyled>
      </JoinGameFooter>
    </BackgroundContainerStyled>
  );
}
