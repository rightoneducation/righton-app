import React, {  ChangeEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import {
  isNullOrUndefined,
  ITeam,
  IAnswerHint,
  GameSessionState,
} from '@righton/networking';
import { StorageKeyHint } from '../lib/PlayModels';
import ShortAnswerTextFieldStyled from '../lib/styledcomponents/ShortAnswerTextFieldStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';

interface HintProps {
  answerHintText: string;
  isHintSubmitted: boolean;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitHint: (result: IAnswerHint) => void;
  currentTeam: ITeam | null;
  questionId: string;
  teamMemberAnswersId: string;
}

export default function HintCard({
  answerHintText,
  isHintSubmitted,
  currentState,
  currentQuestionIndex,
  handleSubmitHint,
  currentTeam,
  questionId,
  teamMemberAnswersId
}: HintProps) {
  const theme = useTheme();
  const { t } = useTranslation();
 
  const [editorContents, setEditorContents] = useState<string>(() => 
    answerHintText ?? ''
  );
  
  const handleEditorContentsChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {    
    const currentHint = event.target.value;
    window.localStorage.setItem(
      StorageKeyHint,
      JSON.stringify(currentHint)
    );
    setEditorContents(currentHint);
  };

  const handleNormalizeAnswerOnSubmit = () => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const packagedAnswer: IAnswerHint = {
      rawHint: editorContents,
      teamName: currentTeam?.name ?? '',
      isHintSubmitted: true
    } as IAnswerHint;
    handleSubmitHint(packagedAnswer);
  };

  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: 'left' }}
          >
            {t('gameinprogress.chooseanswer.hintcardtitle')}
          </Typography>
          <Box
            sx={{
              width: '58px',
              height: '22px',
              borderRadius: '23px',
              background: isHintSubmitted
                ? 'linear-gradient(180deg, #7BDD61 0%, #22B851 100%)'
                : '#CCCCCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '3px',
              paddingBottom: '3px',
              animation: isHintSubmitted ? 'pillPop 600ms ease-in-out' : 'none',
              '@keyframes pillPop': {
                '0%': { transform: 'scale(1)', opacity: 0.7 },
                '50%': { transform: 'scale(1.2)', opacity: 1 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '20px',
                color: 'white',
                textShadow: '0px 1px 1px rgba(0,0,0,0.15)',
              }}
            >
              +1
            </Typography>
          </Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            gap: '20px',
          }}
        >
          <Box style={{width: '100%'}}>
            <Typography
              variant="body1"
              display="inline"
              sx={{ textAlign: 'left' }}
            >
              {t('gameinprogress.chooseanswer.hintcarddescription')}
            </Typography>
          </Box>
          <ShortAnswerTextFieldStyled
            className="swiper-no-swiping"
            data-testid="gameCode-inputtextfield"
            fullWidth
            variant="filled"
            autoComplete="off"
            multiline
            minRows={2}
            maxRows={2}
            disabled={isHintSubmitted}
            placeholder={t('gameinprogress.chooseanswer.hintcardplaceholder') ?? ''}
            onChange={handleEditorContentsChange}
            value={editorContents}
            InputProps={{
              disableUnderline: true,
              style: {
                paddingTop: '9px',
              },
            }}
          />
          <ButtonSubmitAnswer
            isSelected={
              !isNullOrUndefined(editorContents) && editorContents !== ''
            }
            isSubmitted={isHintSubmitted}
            isHint
            isShortAnswerEnabled={false}
            currentState={currentState}
            currentQuestionIndex={currentQuestionIndex}
            handleSubmitAnswer={handleNormalizeAnswerOnSubmit}
            questionId={questionId}
            teamMemberAnswersId={teamMemberAnswersId}
            currentTeam={currentTeam}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
