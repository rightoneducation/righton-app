import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { 
  Paper,
  Typography,
  Box,
  Button
} from "@material-ui/core";
import { isNullOrUndefined } from '@righton/networking';
// import * as DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import katex from "katex";
import './ReactQuill.css';
import "katex/dist/katex.min.css";
import { AnswerObject, AnswerType, StorageKey, LocalModel } from '../../lib/HostModels';
import { fetchLocalData } from '../../lib/HelperFunctions';

window.katex = katex;

interface OpenAnswerCardProps {
  answerObject: AnswerObject;
  handleSubmitAnswer: (result: AnswerObject) => void;
}

export default function OpenAnswerCard({
  answerObject,
  handleSubmitAnswer,
}: OpenAnswerCardProps) {
  const classes = useStyles();
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
  const insertQuillDelta = (inputAnswer: AnswerObject) => {
    const quillDelta: any = [];

    // inputAnswer.answerTexts.forEach((input, index) => {
    //   if (inputAnswer.answerTypes[index] === AnswerType.FORMULA) {
    //     quillDelta.push({ insert: { formula: input } });
    //   } else {
    //     quillDelta.push({ insert: input });
    //   }
    // });
    return quillDelta;
  };

  const [editorContents, setEditorContents] = useState<any>(() => insertQuillDelta(answerObject));

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
    
    return {answerTexts: text, answerTypes: format};
  };
  // ReactQuill onChange expects four parameters
  const handleEditorContentsChange = (content: any, delta: any, source: any, editor: any) => {
    const currentAnswer = editor.getContents();
    const storageObject: LocalModel = {
      ...fetchLocalData(),
      presubmitAnswer: extractQuillDelta(currentAnswer),
    };
    window.localStorage.setItem(StorageKey, JSON.stringify(storageObject));
    setEditorContents(currentAnswer);
  }

  const handleRetrieveAnswer = (currentContents: any) => {
    const answer = extractQuillDelta(currentContents);
    handleSubmitAnswer(answer);
  };

  return (
    <Paper className={classes.background} elevation={10}>
      <Box className={classes.bodyCardContainerStyled}>
        <Typography className={classes.title}>
           Enter your answer
         </Typography> 
        <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '20px'}}>
          <ReactQuill
            theme="snow"
            value={editorContents}
            onChange={handleEditorContentsChange}
            placeholder="Enter your answer here..."
            modules={modules}
            formats={formats}
            bounds={`[data-text-editor="name"]`}
            style={{width:'100%', backgroundColor: '#FFF', borderRadius:'4px'}}
          />
            <Button 
            style={{width: '100%', backgroundColor: '#6082B6', color: '#000', borderRadius: '4px', boxShadow: '2px 5px 5px #D3D3D3'}}
             onClick={() => handleRetrieveAnswer(editorContents)
            }>
            Submit Answer
            </Button>
        </Box>
      </Box>
    </Paper>
  );
}

const useStyles = makeStyles(({
  background: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    padding: `16px`,
    backgroundColor: '#FFF', 
    boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.40)',
    gap:16,
    margin: '5%' // will be removed when upgraded 
  },
  title: {
    fontSize: '24px',
    lineHeight: '38px',
    color: '#000000',
    fontWeight: 700,
    width: '100%', 
    textAlign: 'left',
  },
  bodyCardContainerStyled: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
}));
