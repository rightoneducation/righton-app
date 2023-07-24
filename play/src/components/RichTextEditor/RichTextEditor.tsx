import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import katex from "katex";
import './RichTextEditor.css';
import "katex/dist/katex.min.css";
import { Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { InputType, InputObject } from '../../lib/PlayModels';
import IntroButtonStyled from '../../lib/styledcomponents/IntroButtonStyled';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';

window.katex = katex;

interface RichTextEditorProps {
  setResult: (result: InputObject) => void;
}

export default function RichTextEditor ({
  setResult
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
            text.push(normalizeText.toLowerCase());
            format.push(InputType.TEXT);
          }
        }
      });
    }
    return {rawInput: draftContents, normalizedInput: text, inputType: format};
  };

  return (
    <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '20px'}}>
        <ReactQuill
          theme="snow"
          value={draftContents}
          onChange={setDraftContents}
          placeholder="Enter your answer here..."
          modules={modules}
          formats={formats}
          ref={quillRef}
          bounds={`[data-text-editor="name"]`}
          style={{width:'300px', color: 'black'}}
        />
       <IntroButtonStyled
          onClick={() => setResult(normalizeInput())}
          style={{
            background: `${theme.palette.primary.highlightGradient}`,
            boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
          }}
        >
          <Typography variant="h2" sx={{ textAlign: 'center' }}>
            Submit Answer
          </Typography>
        </IntroButtonStyled>
  </Box>
  )
}