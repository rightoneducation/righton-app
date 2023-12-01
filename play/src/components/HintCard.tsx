import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import {
  isNullOrUndefined,
  ITeamAnswerContent,
  ITeam,
  ITeamAnswerHint,
  GameSessionState,
} from '@righton/networking';
import { StorageKeyHint } from '../lib/PlayModels';
import ShortAnswerTextFieldStyled from '../lib/styledcomponents/ShortAnswerTextFieldStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';

interface HintProps {
  answerHint: ITeamAnswerHint;
  isHintSubmitted: boolean;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitHint: (result: ITeamAnswerHint) => void;
  currentTeam: ITeam | null;
}

export default function HintCard({
  answerHint,
  isHintSubmitted,
  currentState,
  currentQuestionIndex,
  handleSubmitHint,
  currentTeam
}: HintProps) {
  const theme = useTheme();
  const { t } = useTranslation();
 
  const [editorContents, setEditorContents] = useState<any>(() => // eslint-disable-line @typescript-eslint/no-explicit-any
    answerHint
  );
  const [editorObject, setEditorObject] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  // ReactQuill onChange expects four parameters
  const handleEditorContentsChange = (
    content: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    delta: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    source: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    editor: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
    const currentAnswer = editor.getContents();
    const extractedAnswer: ITeamAnswerHint = {
      delta: editor.getContents(),
      rawHint: editor.getText(),
      teamName: currentTeam?.name ?? '',
      isHintSubmitted: false
    };
    window.localStorage.setItem(
      StorageKeyHint,
      JSON.stringify(extractedAnswer)
    );
    setEditorObject(editor);
    setEditorContents(currentAnswer);
  };

  const handleNormalizeAnswerOnSubmit = () => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const hintArray = editorObject.getText().replace(/(\r\n|\n|\r|" ")/gm, '').split(" ").filter((word: string) => word !== "");
    const normHint = removeStopwords(hintArray);

    const packagedAnswer: ITeamAnswerHint = {
      delta: editorObject.getContents(),
      rawHint: editorObject.getText()
        .toLowerCase()
        .replace(/(\r\n|\n|\r|" ")/gm, '')
        .trim(),
      normHint,
      teamName: currentTeam?.name ?? '',
      isHintSubmitted: true
    } as ITeamAnswerHint;
    handleSubmitHint(packagedAnswer);
  };

  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled >
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'left' }}
        >
          {t('gameinprogress.chooseanswer.hintcard')}
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
            placeholder={t('gameinprogress.chooseanswer.hinttext') ?? ''}
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
