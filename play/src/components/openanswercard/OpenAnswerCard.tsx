import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import { isNullOrUndefined, IAnswerContent, IAnswerText } from '@righton/networking';
import { evaluate } from 'mathjs';
import nlp from 'compromise';
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

    inputAnswer.answers.forEach((answer) => {
      if (answer.type === AnswerType.FORMULA) {
        quillDelta.push({ insert: { formula: answer.rawText } });
      } else {
        quillDelta.push({ insert: answer.rawText });
      }
    });
    return quillDelta;
  };

  const [editorContents, setEditorContents] = useState<any>(() => insertQuillDelta(answerContent));

  // this function is run onChange of the quill editor
  // it is designed to only pull the data that is req'd to reproduce it on reload
  // full normalization will be performed only on submitting answer
  const extractQuillDelta = (currentContents: any): IAnswerContent => {
    const answer: IAnswerText[] = [];

    currentContents.forEach((op: any) => {
      if(op.insert.formula) {
        answer.push( {
          rawText: op.insert.formula, 
          type: AnswerType.FORMULA
        });
      } else {
        answer.push( {
          rawText: op.insert, 
          type: AnswerType.TEXT
        });
      }
    });
    
    return {answers: answer, isSubmitted} as IAnswerContent;
  };

  // ReactQuill onChange expects four parameters
  const handleEditorContentsChange = (content: any, delta: any, source: any, editor: any) => {
    const currentAnswer = editor.getContents();
    window.localStorage.setItem(StorageKeyAnswer, JSON.stringify({presubmitAnswer: extractQuillDelta(currentAnswer)}));
    setEditorContents(currentAnswer);
   // console.log(currentAnswer);
  };

  // this is the normalization function that is run on submitted answer
  // it formats the data to allow for equality matching on the host side
  const handleNormalizeAnswers = (currentContents: IAnswerText[]): IAnswerText[] => {
   // TODO: remove html tags

    const normalizedAnswers = currentContents.map((answer) => {
      const normalizedAnswer: IAnswerText = {rawText: '', normText: '', type: AnswerType.TEXT};
      // rawText:
      // replaces \n with spaces maintains everything else
      normalizedAnswer.rawText = `${answer.rawText.replace(/\n/g, " ")}`;
      // normText:
      if (answer.type === AnswerType.FORMULA) {
        // removes all spaces
        normalizedAnswer.normText = `${answer.rawText.replace(/(\r\n|\n|\r|" ")/gm, "")}`;
      } else {
        // 2. if there is no formula, scan string for numbers
        //    special characters, math operators outside of formula blow up our number parser and should just be treated as strings
        //    if just numbers found, extract numbers and set it to normalized answer
        const specialChars = /[`$%*()]/;
        const specialCharsCheck = specialChars.test(answer.rawText);
        const detectedNumbers = nlp(answer.rawText).numbers().json();

        if (!specialCharsCheck && detectedNumbers.length > 0) {
          console.log(detectedNumbers);
          // answer.normText = answer.rawText.reduce((acc: number, curr: string) => `${acc}${curr.replace(/\n/g, "")}`, "");
          normalizedAnswer.normText = detectedNumbers.reduce((number: any) => parseFloat(number.number.num));
          normalizedAnswer.type = AnswerType.NUMBER;
        } else {
          // 3. if there is no formula and no numbers
          //    set normalized input to lower case and remove spaces
          normalizedAnswer.normText = answer.rawText.toLowerCase().replace(/(\r\n|\n|\r|" ")/gm, "");
        }
      }
      return normalizedAnswer;
    });

    return normalizedAnswers as IAnswerText[];
  };

  const handleRetrieveAnswer = (currentContents: any) => {
    const extractedAnswer = extractQuillDelta(currentContents);
    const normalizedAnswers = handleNormalizeAnswers(extractedAnswer.answers);
    const submitAnswer: IAnswerContent = {
      answers: normalizedAnswers, 
      isSubmitted: true
    };
    console.log(submitAnswer);
    // handleSubmitAnswer(answer);
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
