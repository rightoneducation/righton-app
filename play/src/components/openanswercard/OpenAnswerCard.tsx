import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import { isNullOrUndefined } from '@righton/networking';
import * as DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import katex from "katex";
import './ReactQuill.css';
import "katex/dist/katex.min.css";
import { InputObject, InputType } from '../../lib/PlayModels';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from '../ButtonSubmitAnswer';


window.katex = katex;

interface OpenAnswerCardProps {
  answerObject: InputObject;
  isSubmitted: boolean;
  handleSubmitAnswer: (result: InputObject) => void;
}

export default function OpenAnswerCard({
  answerObject,
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
  const quillRef = useRef<ReactQuill>(null);
  const [draftContents, setDraftContents] = useState<string>('');

  useEffect(() => {
    const editor = quillRef.current!.getEditor();
    const quillDelta = {ops: [{insert: ''}]}
    const mockAnswer = [{text: 'asdfsadf', inputType: InputType.TEXT}, {text: '\\sqrt(1/2 + 3/4)', inputType: InputType.FORMULA}, {text: 'asdfasdfsa', inputType: InputType.TEXT}];
    mockAnswer.forEach((answer) => {

    })

    
    editor.setContents(quillDelta);
  }, []);
  console.log(answerObject);
  const normalizeInput = () => {
    const text: string[] = [];
    const format: InputType[] = [];
    const editor = quillRef.current!.getEditor();
    const unprivilegedEditor = quillRef.current!.makeUnprivilegedEditor(editor);
    const quillContents = unprivilegedEditor.getContents();
    console.log(quillContents);
    const sanitizedContents = DOMPurify.sanitize(unprivilegedEditor.getHTML());
    if(quillRef.current) {
      quillContents.ops!.forEach((op:any) => {
        if(op.insert.formula) {
          text.push(op.insert.formula); 
          format.push(InputType.FORMULA);
        } else {
          const normalizeText = op.insert.replace(/(\r\n|\n|\r)/gm, "");
          if (normalizeText !== " ") {
            text.push(normalizeText.toLowerCase());
            format.push(InputType.TEXT);
          }
        }
      });
    }
    return {rawInput: sanitizedContents, normalizedInput: text, inputType: format, isSubmitted: true};
  };

  const handleRetrieveAnswer = () => {
    handleSubmitAnswer(normalizeInput());
  };

  return (
    <BodyCardStyled elevation={10} >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'left' }}>
           Enter your answer
         </Typography> 
        <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '20px'}}>
          <ReactQuill
            theme="snow"
            readOnly={isSubmitted}
            value={draftContents}
            onChange={setDraftContents}
            placeholder="Enter your answer here..."
            modules={modules}
            formats={formats}
            ref={quillRef}
            bounds={`[data-text-editor="name"]`}
            style={{width:'100%', backgroundColor: !isSubmitted ? '' : `${theme.palette.primary.lightGrey}` , borderRadius:'4px'}}
          />
          <ButtonSubmitAnswer
            isSelected={!isNullOrUndefined(draftContents) && draftContents !== ''}
            isSubmitted={isSubmitted}
            handleRetrieveAnswer={handleRetrieveAnswer}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
