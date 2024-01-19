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
}

export default function HintCard({
  answerHintText,
  isHintSubmitted,
  currentState,
  currentQuestionIndex,
  handleSubmitHint,
  currentTeam
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
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'left' }}
        >
          {t('gameinprogress.chooseanswer.hintcardtitle')}
        </Typography>
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
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
