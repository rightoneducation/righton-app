import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import {
  isNullOrUndefined,
  BackendAnswer,
  AnswerFactory,
  IAnswerSettings,
  ITeam,
  GameSessionState,
  AnswerType,
  AnswerPrecision
} from '@righton/networking';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { StorageKeyAnswer} from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import ShortAnswerTextFieldStyled from '../lib/styledcomponents/ShortAnswerTextFieldStyled';

window.katex = katex;

interface OpenAnswerCardProps {
  backendAnswer: BackendAnswer;
  answerSettings: IAnswerSettings | null;
  isSubmitted: boolean;
  isShortAnswerEnabled: boolean;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  questionId: string;
  teamMemberAnswersId: string;
  currentTeam: ITeam  | null;
  handleSubmitAnswer: (result: BackendAnswer) => void;
}

export default function OpenAnswerCard({
  backendAnswer,
  answerSettings,
  isSubmitted,
  isShortAnswerEnabled,
  currentState,
  currentQuestionIndex,
  questionId,
  teamMemberAnswersId,
  currentTeam,
  handleSubmitAnswer,
}: OpenAnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const katexBoxRef = useRef();
  const [isBadInput, setIsBadInput] = useState(false); 
  const [katexAnswer, setKatexAnswer] = useState('');

  const answerType: AnswerType = answerSettings?.answerType ?? AnswerType.STRING;
  const answerPrecision: AnswerPrecision = answerSettings?.answerPrecision as AnswerPrecision;
  const numericAnswerRegex = /^-?[0-9]*(\.[0-9]*)?%?$/; 
  const getAnswerText = (inputAnswerSettings: IAnswerSettings | null) => {
    switch (inputAnswerSettings?.answerType) {
      case AnswerType.STRING:
        return t('gameinprogress.chooseanswer.openanswercardwordanswer');
      case AnswerType.EXPRESSION:
        return t('gameinprogress.chooseanswer.openanswercardexpressionanswer');
      case AnswerType.NUMBER:
        default: 
          switch(inputAnswerSettings?.answerPrecision){
            case (AnswerPrecision.THOUSANDTH):
              return t('gameinprogress.chooseanswer.openanswercardnumberanswer4');
            case (AnswerPrecision.HUNDREDTH):
              return t('gameinprogress.chooseanswer.openanswercardnumberanswer3');
            case (AnswerPrecision.TENTH):
              return t('gameinprogress.chooseanswer.openanswercardnumberanswer2');
            case (AnswerPrecision.WHOLE):
              default:
                return t('gameinprogress.chooseanswer.openanswercardnumberanswer1');
          }
    }
  }
  const answerText = getAnswerText(answerSettings);
  const [editorContents, setEditorContents] = useState<any>(() => // eslint-disable-line @typescript-eslint/no-explicit-any
    backendAnswer.answer?.rawAnswer ?? ''
  );
  const handleEditorContentsChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let currentAnswer = event.target.value;
    let isBadInputDetected = false;
    if (answerSettings?.answerType === AnswerType.NUMBER) {
      isBadInputDetected = !numericAnswerRegex.test(currentAnswer);
      currentAnswer = currentAnswer.replace(/[^0-9.%-]/g, '');
      setIsBadInput(isBadInputDetected);
    }
    
    const extractedAnswer = new BackendAnswer(
      AnswerFactory.createAnswer(currentAnswer, answerType, answerPrecision),
      backendAnswer.isSubmitted,
      isShortAnswerEnabled,
      currentState,
      currentQuestionIndex,
      questionId,
      teamMemberAnswersId,
      currentTeam?.id ?? '',
      currentTeam?.name ?? '',
      currentAnswer,
      false
    );
    window.localStorage.setItem(
      StorageKeyAnswer,
      JSON.stringify(extractedAnswer)
    );
    setEditorContents(currentAnswer);
  };
  
  const handlePresubmit = (currentContents: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const answer = AnswerFactory.createAnswer(currentContents, answerType, answerPrecision);
    answer.normalizeAnswer(currentContents);
    const isCorrect = true;
    const packagedAnswer = new BackendAnswer(
      answer,
      true,
      isShortAnswerEnabled,
      currentState,
      currentQuestionIndex,
      questionId,
      teamMemberAnswersId,
      currentTeam?.id ?? '',
      currentTeam?.name ?? '',
      currentContents,
      isCorrect
    );
    handleSubmitAnswer(packagedAnswer);
  };

   // useEffect to handle KaTeX rendering
   // need this in a useEffect because the katex render conflicts with react state updates (always one step behind)
   useEffect(() => {
    if (answerSettings?.answerType === AnswerType.EXPRESSION && katexBoxRef.current) {
      katex.render(editorContents, katexBoxRef.current, {
        throwOnError: false,
        trust: false
      });
    }
  }, [editorContents, answerSettings?.answerType]);

  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled spacing={2}>
        <Typography
          variant="subtitle1"
          sx={{ width: '100%', textAlign: 'left' }}
        >
          {t('gameinprogress.chooseanswer.openanswercard')}
        </Typography>
        <Box display="inline" style={{ width: '100%' }}>
        <Typography
          variant="body1"
          display="inline"
          sx={{ width: '100%', textAlign: 'left' }}
        >
          {t('gameinprogress.chooseanswer.openanswercarddescription')}
         
        </Typography>
   
        <Typography
            variant="body1"
            display="inline"
            sx={{ width: '100%', textAlign: 'left', fontWeight: 700 }}
          >
            {answerText}
          </Typography>
          </Box>
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
          <ShortAnswerTextFieldStyled
            className="swiper-no-swiping"
            data-testid="gameCode-inputtextfield"
            fullWidth
            variant="filled"
            autoComplete="off"
            multiline
            minRows={2}
            maxRows={2}
            placeholder={t('gameinprogress.chooseanswer.openanswercardplaceholder') ?? ''}
            onChange={handleEditorContentsChange}
            value={editorContents}
            disabled={isSubmitted}
            InputProps={{
              disableUnderline: true,
              style: {
                paddingTop: '9px',
              },
            }}
          />
          { isBadInput
            ? <Typography
                variant="body1"
                sx={{ width: '100%', textAlign: 'center' }}
              >
                  {t('gameinprogress.chooseanswer.openanswercardnumberwarning')}
              </Typography>
            : null
          }
          { answerSettings?.answerType === AnswerType.EXPRESSION &&
            <Box
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16
              }}
            >
              <Typography
              variant="body1"
              sx={{ width: '100%', textAlign: 'left' }}
              >
                {t('gameinprogress.chooseanswer.openanswercardkatexpreview')}
              </Typography>
              <Box
                style={{minHeight: '24px'}}
                ref={katexBoxRef}
              />
            </Box>
          }
          <ButtonSubmitAnswer
            isSelected={
              !isNullOrUndefined(editorContents) && editorContents !== ''
            }
            isSubmitted={isSubmitted}
            isHint={false}
            isShortAnswerEnabled={isShortAnswerEnabled}
            currentState={currentState}
            currentQuestionIndex={currentQuestionIndex}
            handleSubmitAnswer={() =>
              handlePresubmit(editorContents)
            }
            questionId={questionId}
            teamMemberAnswersId={teamMemberAnswersId}
            currentTeam={currentTeam}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}