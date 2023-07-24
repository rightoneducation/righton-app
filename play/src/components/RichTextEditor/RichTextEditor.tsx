import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import katex from "katex";
import './RichTextEditor.css';
import "katex/dist/katex.min.css";
import nlp from 'compromise';
import { create, all } from "mathjs";
import { Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { InputType, InputObject } from '../../lib/PlayModels';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';

window.katex = katex;

interface RichTextEditorProps {
  setResult: (result: string) => void;
  answer: any;
}

export default function RichTextEditor ({
  setResult,
  answer
} : RichTextEditorProps) {
  const modules = {
    toolbar: [
      ['formula']
    ],
  };
  // TODO: rewrite this component so the button is undernearth and the handle input only occurs on the button click
  const formats = [
    'formula'
  ];
  const quillRef = useRef<ReactQuill>(null);
  const [draftContents, setDraftContents] = useState<string>('')
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [contents, setContents] = useState<InputObject>({rawInput: '' , normalizedInput: [''], inputType: [InputType.NULL]});
  const correctAnswer = 'x^2+3x+4';
  const config = {};
  const math = create(all, config);
  // 2x^2-x^2+4x-x+4
  const isAnswerNumeric = (originalAnswer: any) => {
    if (typeof originalAnswer === 'number') 
      return originalAnswer;
    if (typeof originalAnswer === 'string' &&  /^\d*\.?\d+$/.test(originalAnswer)) {
      return parseFloat(originalAnswer);
    }
    return null;
  };

  const findNumbersInString = (input: string, normalizedAnswer: number) => {
    const doc = nlp(input);
    const detectedNumbers = doc.numbers().json();
    const answers: number[] = [];
    detectedNumbers.forEach((number: any) => {
      if (number.number.num)
        answers.push(number.number.num);
    });
    return answers;
  };

  const normalizeInput = () => {
    const text: string[] = [];
    const format: InputType[] = [];
    const editor = quillRef.current!.getEditor();
    const unprivilegedEditor = quillRef.current!.makeUnprivilegedEditor(editor);
    const quillContents = unprivilegedEditor.getContents();
    if(quillRef.current) {
      quillContents.ops!.forEach((op:any) => {
        if(op.insert.formula) {
          text.push(op.insert.formula); 
          format.push(InputType.FORMULA);
        } else {
          const normalizeText = op.insert.replace(/(\r\n|\n|\r)/gm, "");
          if (normalizeText !== " ") {
            text.push(normalizeText);
            format.push(InputType.TEXT);
          }
        }
      });
    }
    return {rawInput: draftContents, normalizedInput: text, inputType: format};
  };

  const checkText = () => {
    const input = normalizeInput();
    // step one: determine if we are looking for a numeric or string answer
    const numericAnswer = isAnswerNumeric(answer);
    // step two: if numeric, check the input for numbers that match the answer
    if (numericAnswer){
      for(let i = 0; i < input.normalizedInput.length; i+=1){
        const numericInput = isAnswerNumeric(input.normalizedInput[i]);
        if (numericInput && numericInput === numericAnswer){
          setResult('Correct!');
          return;
        }
        const numbersFound = findNumbersInString(input.normalizedInput[i], numericAnswer);
        for (let y = 0; y < numbersFound.length; y+=1) {
          if (numbersFound[y] === numericAnswer) {
            setResult('Correct!');
            return;
          }
        }
      }
    } else {
      // step three: if string, could be either a phrase or a formula, so check if there is a formula.
      for (let i = 0; i < input.normalizedInput.length; i+=1){
        console.log(input.normalizedInput[i]);
        if (input.normalizedInput[i].toLowerCase() === answer.toLowerCase()){
          setResult('Correct!');
          return;
        }
        if (input.inputType[i] === InputType.FORMULA){
          try {
            const answerExpression = math.evaluate(answer);
            const inputExpression = math.evaluate(input.normalizedInput[i]);
            if (answerExpression === inputExpression) {
              setResult('Correct!');
              return;
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
    setResult('Incorrect!');
  };

  return (
    <div data-text-editor="name" style={{width: '100%'}}>
      <BodyCardStyled elevation={10} style={{marginBottom: '20px'}}>
        <ReactQuill
          theme="snow"
          value={draftContents}
          onChange={setDraftContents}
          placeholder="Write your answer here..."
          modules={modules}
          formats={formats}
          ref={quillRef}
          bounds={`[data-text-editor="name"]`}
          style={{width:'300px'}}
        />
      </BodyCardStyled>
      <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '20px'}}>
       <IntroButtonStyled
          onClick={() => checkText()}
          style={{
            background: `${theme.palette.primary.highlightGradient}`,
            boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
          }}
        >
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Submit
          </Typography>
        </IntroButtonStyled>
        <IntroButtonStyled
          onClick={() => setResult('')}
        >
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Reset
          </Typography>
        </IntroButtonStyled>
        </Box>
  </div>
  )
}