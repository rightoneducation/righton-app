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
import { removeStopwords, eng, fra } from 'stopword';
import ReactQuill from 'react-quill';
import katex from 'katex';
import './ReactQuill.css';
import 'katex/dist/katex.min.css';
import { StorageKeyHint } from '../../lib/PlayModels';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from '../ButtonSubmitAnswer';

window.katex = katex;

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
  const modules = {
    toolbar: false,
  };
  const formats = [''];
  // these two functions isolate the quill data structure (delta) from the rest of the app
  // this allows for the use of a different editor in the future by just adjusting the parsing in these functions
  const insertQuillDelta = (inputHint: ITeamAnswerHint) => {
    return inputHint.delta ?? [];
  };

  const [editorContents, setEditorContents] = useState<any>(() => // eslint-disable-line @typescript-eslint/no-explicit-any
    insertQuillDelta(answerHint)
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
          {t('gameinprogress.chooseanswer.Hintcard')}
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
              {t('gameinprogress.chooseanswer.Hinttext')}
            </Typography>
          </Box>
          <ReactQuill
            className="swiper-no-swiping"
            theme="snow"
            readOnly={isHintSubmitted}
            value={editorContents}
            onChange={handleEditorContentsChange}
            placeholder={
              t('gameinprogress.chooseanswer.Hintplaceholder') ?? ''
            }
            modules={modules}
            formats={formats}
            bounds={`[data-text-editor="name"]`}
            style={{
              width: '100%',
              height: '188px',
              backgroundColor: !isHintSubmitted
                ? ''
                : `${theme.palette.primary.lightGrey}`,
              borderRadius: '4px',
            }}
          />
          <ButtonSubmitAnswer
            isSelected={
              !isNullOrUndefined(editorContents) && editorContents !== ''
            }
            isSubmitted={isHintSubmitted}
            isHint
            currentState={currentState}
            currentQuestionIndex={currentQuestionIndex}
            handleSubmitAnswer={handleNormalizeAnswerOnSubmit}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
