import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import { isNullOrUndefined, IAnswerContent } from '@righton/networking';
import * as DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import katex from "katex";
import './ReactQuill.css';
import "katex/dist/katex.min.css";
import { AnswerType, StorageKeyAnswer, LocalModel } from '../../lib/PlayModels';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from '../ButtonSubmitAnswer';

window.katex = katex;

interface OpenAnswerCardProps {
  answerContent: IAnswerContent;
  isSubmitted: boolean;
  handleSubmitAnswer: (result: IAnswerContent) => void;
}

export default function OpenAnswerCard({
  answerContent,
  isSubmitted,
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
  const insertQuillDelta = (inputAnswer: IAnswerContent) => {
    const quillDelta: any = [];
    inputAnswer.answerTexts.forEach((input, index) => {
      if (inputAnswer.answerTypes[index] === AnswerType.FORMULA) {
        quillDelta.push({ insert: { formula: input } });
      } else {
        quillDelta.push({ insert: input });
      }
    });
    return quillDelta;
  };

  const [editorContents, setEditorContents] = useState<any>(() => insertQuillDelta(answerContent));

  const extractQuillDelta = (currentContents: any) => {
    const text: string[] = [];
    const format: AnswerType[] = [];

    currentContents.forEach((op: any) => {
      if(op.insert.formula) {
        text.push(op.insert.formula); 
        format.push(AnswerType.FORMULA);
      } else {
        const normalizeText = op.insert.replace(/(\r\n|\n|\r)/gm, "");
        if (normalizeText !== " ") {
          text.push(normalizeText.toLowerCase());
          format.push(AnswerType.TEXT);
        }
      }
    });
    
    return {answerTexts: text, answerTypes: format, isSubmitted};
  };

  // ReactQuill onChange expects four parameters
  const handleEditorContentsChange = (content: any, delta: any, source: any, editor: any) => {
    const currentAnswer = editor.getContents();
    window.localStorage.setItem(StorageKeyAnswer, JSON.stringify({presubmitAnswer: extractQuillDelta(currentAnswer)}));
    setEditorContents(currentAnswer);
  };

  const handleRetrieveAnswer = (currentContents: any) => {
    const answer = extractQuillDelta(currentContents);
    answer.isSubmitted = true;
    console.log(answer);
    handleSubmitAnswer(answer);
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
            handleSubmitAnswer={() => handleRetrieveAnswer(editorContents)}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
