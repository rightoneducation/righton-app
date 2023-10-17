import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import { isNullOrUndefined, ITeamAnswerContent, INormAnswer, GameSessionState } from '@righton/networking';
import { evaluate } from 'mathjs';
import * as DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import katex from "katex";
import './ReactQuill.css';
import "katex/dist/katex.min.css";
import { handleNormalizeAnswers } from '../../lib/HelperFunctions';
import { AnswerType, StorageKeyAnswer, LocalModel } from '../../lib/PlayModels';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from '../ButtonSubmitAnswer';

window.katex = katex;

interface OpenAnswerCardProps {
  answerContent: ITeamAnswerContent;
  isSubmitted: boolean;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitAnswer: (result: ITeamAnswerContent) => void;
}

export default function OpenAnswerCard({
  answerContent,
  isSubmitted,
  currentState,
  currentQuestionIndex,
  handleSubmitAnswer,
}: OpenAnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const modules = {
    toolbar: [
      ['formula']
    ],
  };
  const formats = [
    'formula'
  ];

  // these two functions isolate the quill data structure (delta) from the rest of the app
  // this allows for the use of a different editor in the future by just adjusting the parsing in these functions
  const insertQuillDelta = (inputAnswer: ITeamAnswerContent) => {
    return inputAnswer.rawAnswer ?? [];
  };

  const [editorContents, setEditorContents] = useState<any>(() => insertQuillDelta(answerContent));

  // ReactQuill onChange expects four parameters
  const handleEditorContentsChange = (content: any, delta: any, source: any, editor: any) => {
    const currentAnswer = editor.getContents();
    const extractedAnswer: ITeamAnswerContent = {
      rawAnswer: currentAnswer,
      currentState,
      currentQuestionIndex
    };
    window.localStorage.setItem(StorageKeyAnswer, JSON.stringify(extractedAnswer));
    setEditorContents(currentAnswer);
  };

  const handleNormalizeAnswerOnSubmit = (currentContents: any) => {
    const normalizedAnswers =  handleNormalizeAnswers(currentContents);
    const packagedAnswer: ITeamAnswerContent = {
      rawAnswer: currentContents,
      normAnswer: normalizedAnswers,
      currentState,
      currentQuestionIndex,
    } as ITeamAnswerContent;
    handleSubmitAnswer(packagedAnswer);
  };

  return (
    <BodyCardStyled elevation={10} >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'left' }}>
          {t('gameinprogress.chooseanswer.openanswercard')}
         </Typography> 
        <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '20px'}}>
          <ReactQuill
            theme="snow"
            readOnly={isSubmitted}
            value={editorContents}
            onChange={handleEditorContentsChange}
            placeholder={t('gameinprogress.chooseanswer.openanswercardplaceholder') ?? ''}
            modules={modules}
            formats={formats}
            bounds={`[data-text-editor="name"]`}
            style={{width:'100%', backgroundColor: !isSubmitted ? '' : `${theme.palette.primary.lightGrey}` , borderRadius:'4px'}}
          />
          <ButtonSubmitAnswer
            isSelected={!isNullOrUndefined(editorContents) && editorContents !== ''}
            isSubmitted={isSubmitted}
            currentState={currentState}
            currentQuestionIndex={currentQuestionIndex}
            handleSubmitAnswer={() => handleNormalizeAnswerOnSubmit(editorContents)}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
