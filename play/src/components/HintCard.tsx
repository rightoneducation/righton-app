import React, {  ChangeEvent, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import {
  isNullOrUndefined,
  IAPIClients,
  ITeam,
  IAnswerHint,
  GameSessionState,
} from '@righton/networking';
import { StorageKeyHint, StorageKeyEduDataAssignment } from '../lib/PlayModels';

const EDUDATA_ASSIGNMENT_TTL_MS = 2 * 60 * 60 * 1000;
const EDUDATA_SITE = 'hintcard';
const EDUDATA_TARGET = 'hintcardtext';

interface CachedAssignment {
  questionIndex: number;
  state: GameSessionState;
  site: string;
  target: string;
  conditionCode: string;
  conditionValue: string;
  ts: number;
}

const readCachedAssignment = (
  questionIndex: number,
  state: GameSessionState,
): CachedAssignment | null => {
  try {
    const raw = window.localStorage.getItem(StorageKeyEduDataAssignment);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedAssignment;
    const fresh = Date.now() - (cached.ts ?? 0) < EDUDATA_ASSIGNMENT_TTL_MS;
    const matches =
      cached.questionIndex === questionIndex &&
      cached.state === state &&
      cached.site === EDUDATA_SITE &&
      cached.target === EDUDATA_TARGET;
    return fresh && matches ? cached : null;
  } catch {
    return null;
  }
};
import ShortAnswerTextFieldStyled from '../lib/styledcomponents/ShortAnswerTextFieldStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';

interface HintProps {
  apiClients: IAPIClients;
  answerHintText: string;
  isHintSubmitted: boolean;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitHint: (result: IAnswerHint) => void;
  currentTeam: ITeam | null;
  questionId: string;
  teamMemberAnswersId: string;
}

export default function HintCard({
  apiClients,
  answerHintText,
  isHintSubmitted,
  currentState,
  currentQuestionIndex,
  handleSubmitHint,
  currentTeam,
  questionId,
  teamMemberAnswersId
}: HintProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [condition, setCondition] = useState(
    () => readCachedAssignment(currentQuestionIndex, currentState)?.conditionValue ?? 'default',
  );

  // UPGRADE INTEGRATION START
  useEffect(() => {
    console.log('herestart');
    // Cache hit on rejoin/refresh: keep the variant consistent and skip both
    // the network call and re-marking exposure (already marked pre-rejoin).
    const cached = readCachedAssignment(currentQuestionIndex, currentState);
    if (cached) {
      setCondition(cached.conditionValue);
      console.log('hereend');
      return;
    }
    apiClients.eduData?.getConditionObj(EDUDATA_SITE, EDUDATA_TARGET).then(response => {
      if (response) {
        setCondition(response.conditionValue);
        try {
          window.localStorage.setItem(
            StorageKeyEduDataAssignment,
            JSON.stringify({
              questionIndex: currentQuestionIndex,
              state: currentState,
              site: EDUDATA_SITE,
              target: EDUDATA_TARGET,
              conditionCode: response.conditionCode,
              conditionValue: response.conditionValue,
              ts: Date.now(),
            } as CachedAssignment),
          );
        } catch {
          // localStorage full / disabled — assignment continuity degrades gracefully
        }
        apiClients.eduData?.markExposure(EDUDATA_SITE, EDUDATA_TARGET, response.conditionCode).catch(() => {});
      }
    });
    console.log('hereend');
  }, [apiClients.eduData, currentQuestionIndex, currentState]);

  // UPGRADE INTEGRATION END
  const [editorContents, setEditorContents] = useState<string>(() => 
    answerHintText ?? ''
  );
  
  const handleEditorContentsChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {    
    const currentHint = event.target.value;
    window.localStorage.setItem(
      StorageKeyHint,
      JSON.stringify(currentHint)
    );
    setEditorContents(currentHint);
  };

  const handleNormalizeAnswerOnSubmit = () => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const packagedAnswer: IAnswerHint = {
      rawHint: editorContents,
      teamName: currentTeam?.name ?? '',
      isHintSubmitted: true
    } as IAnswerHint;
    // UPGRADE INTEGRATION START
    apiClients.eduData?.logMetric('hintSubmitted', 1); 
    // UPGRADE INTEGRATION END
    handleSubmitHint(packagedAnswer);
  };

  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: 'left' }}
          >
            {t('gameinprogress.chooseanswer.hintcardtitle')}
          </Typography>
          <Box
            sx={{
              width: '58px',
              height: '22px',
              borderRadius: '23px',
              background: isHintSubmitted
                ? 'linear-gradient(180deg, #7BDD61 0%, #22B851 100%)'
                : '#CCCCCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '3px',
              paddingBottom: '3px',
              animation: isHintSubmitted ? 'pillPop 600ms ease-in-out' : 'none',
              '@keyframes pillPop': {
                '0%': { transform: 'scale(1)', opacity: 0.7 },
                '50%': { transform: 'scale(1.2)', opacity: 1 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '20px',
                color: 'white',
                textShadow: '0px 1px 1px rgba(0,0,0,0.15)',
              }}
            >
              +1
            </Typography>
          </Box>
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
          <Box style={{width: '100%'}}>
            <Typography
              variant="body1"
              display="inline"
              sx={{ textAlign: 'left' }}
            >
              {/* UPGRADE INTEGRATION START */}
              { (condition === 'default' || condition === 'upgrade1')
                ? t('gameinprogress.chooseanswer.hintcarddescriptiondefault')
                : t('gameinprogress.chooseanswer.hintcarddescriptionupgrade')
              }
              {/* UPGRADE INTEGRATION END */}
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
            disabled={isHintSubmitted}
            placeholder={t('gameinprogress.chooseanswer.hintcardplaceholder') ?? ''}
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
            questionId={questionId}
            teamMemberAnswersId={teamMemberAnswersId}
            currentTeam={currentTeam}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
