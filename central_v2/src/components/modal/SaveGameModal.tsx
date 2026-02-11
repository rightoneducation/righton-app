import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Fade,
  Typography,
  styled,
  CircularProgress,
  Tooltip,
  useTheme,
} from '@mui/material';
import { CentralQuestionTemplateInput, IGameTemplate, IQuestionTemplate } from '@righton/networking';
import { TemplateType } from '../../lib/CentralModels';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from '../button/Button';

const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(100%)',
  height: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  maxHeight: '100%',
  maxWidth: '400px',
  background: '#FFF',
  paddingTop: '16px',
  paddingBottom: '16px',
  paddingLeft: '24px',
  paddingRight: '24px',
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  boxSizing: 'border-box',
}));

const DragText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  width: '100%',
  fontSize: '24px',
  lineHeight: '32px',
  fontWeight: 700,
  textAlign: 'center',
}));

const BodyText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik',  
  width: '100%',
  fontSize: '16px',
  fontWeight: 400,
  textAlign: 'center',
}));

const CloseButton = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  cursor: 'pointer',
}));

interface SaveGameModalProps {
  isModalOpen: boolean;
  title: string;
  templateType: TemplateType;
  handlePublishGame?: () => void;
  handleCloseSaveGameModal?: () => void;
  handleSaveDraft?: () => void;
  isCardErrored?: boolean;
  isDraft?: boolean;
  draftQuestion?: CentralQuestionTemplateInput;
  originalQuestion?: CentralQuestionTemplateInput | null;
  draftGame?: IGameTemplate;
  originalGame?: IGameTemplate | null;
  draftQuestionList?: Array<{ questionTemplate: IQuestionTemplate }>;
}

export default function SaveGameModal({
  isModalOpen,
  templateType,
  title,
  handlePublishGame,
  handleCloseSaveGameModal,
  handleSaveDraft,
  isCardErrored,
  isDraft,
  draftQuestion,
  originalQuestion,
  draftGame,
  originalGame,
  draftQuestionList
}: SaveGameModalProps) {
  const theme = useTheme();
  const text = templateType === TemplateType.GAME ? 'Game' : 'Question';

  
  const compareQuestions = useCallback((draft: CentralQuestionTemplateInput, original: CentralQuestionTemplateInput) => {
    return draft.questionCard.title !== original.questionCard.title ||
      draft.questionCard.ccss !== original.questionCard.ccss ||
      draft.questionCard.imageUrl !== original.questionCard.imageUrl ||
      draft.correctCard.answer !== original.correctCard.answer ||
      draft.correctCard.answerSteps !== original.correctCard.answerSteps ||
      draft.incorrectCards.some((card, index) => card.answer !== original.incorrectCards[index].answer) ||
      draft.incorrectCards.some((card, index) => card.explanation !== original.incorrectCards[index].explanation);
  }, []);

  const compareQuestionTemplates = useCallback((draft: IQuestionTemplate, original: IQuestionTemplate) => {
    return (
      draft.id !== original.id ||
      draft.title !== original.title ||
      draft.ccss !== original.ccss ||
      draft.ccssDescription !== original.ccssDescription ||
      draft.imageUrl !== original.imageUrl ||
      draft.publicPrivateType !== original.publicPrivateType ||
      draft.finalPublicPrivateType !== original.finalPublicPrivateType ||
      draft.answerSettings !== original.answerSettings ||
      draft.answerSettings?.answerPrecision !== original.answerSettings?.answerPrecision ||
      (draft.choices?.length ?? 0) !== (original.choices?.length ?? 0) ||
      draft.choices?.some((c, i) => c.text !== original.choices?.[i]?.text || c.reason !== original.choices?.[i]?.reason) ||
      (draft.instructions?.length ?? 0) !== (original.instructions?.length ?? 0) ||
      draft.instructions?.some((inst, i) => inst !== original.instructions?.[i])
    );
  }, []);

  const compareGames = useCallback((draft: IGameTemplate, original: IGameTemplate) => {
    const draftList = draft.questionTemplates ?? null;
    const originalList = original.questionTemplates ?? null;

    const listLengthDiffer = (draftList?.length ?? 0) !== (originalList?.length ?? 0);
    if (listLengthDiffer) return true;

    const draftOrder = draft.questionTemplatesOrder ?? [];
    const originalOrder = original.questionTemplatesOrder ?? [];
    const orderDiffer =
      draftOrder.length !== originalOrder.length ||
      draftOrder.some(
        (item, i) =>
          item.questionTemplateId !== originalOrder[i]?.questionTemplateId ||
          item.index !== originalOrder[i]?.index
      );
    if (orderDiffer) return true;

    const questionTemplatesDiffer =
      draftList?.some((item, index) => {
        const originalItem = originalList?.[index]?.questionTemplate;
        if (originalItem == null) return true;
        return (
          item.questionTemplate.id !== originalItem.id ||
          compareQuestionTemplates(item.questionTemplate, originalItem)
        );
      }) ?? false;
    if (questionTemplatesDiffer) return true;

    return (
      draft.title !== original.title ||
      draft.description !== original.description ||
      draft.imageUrl !== original.imageUrl ||
      draft.publicPrivateType !== original.publicPrivateType ||
      draft.finalPublicPrivateType !== original.finalPublicPrivateType ||
      draft.phaseOneTime !== original.phaseOneTime ||
      draft.phaseTwoTime !== original.phaseTwoTime ||
      draft.domain !== original.domain ||
      draft.cluster !== original.cluster ||
      draft.grade !== original.grade ||
      draft.standard !== original.standard ||
      draft.ccss !== original.ccss ||
      draft.ccssDescription !== original.ccssDescription ||
      draft.questionTemplatesCount !== original.questionTemplatesCount
    );
  }, [compareQuestionTemplates]);

  const contentChanged = useMemo(() => {
    if (!isModalOpen) return false;

    if (templateType === TemplateType.GAME) {
      if (draftGame == null) return false;
      const effectiveDraft: IGameTemplate = draftQuestionList != null
        ? {
            ...draftGame,
            questionTemplates: draftQuestionList.map((item, index) => ({
              questionTemplate: item.questionTemplate,
              gameQuestionId: item.questionTemplate.id ?? `temp-${index}`,
            })),
            questionTemplatesCount: draftQuestionList.length,
            questionTemplatesOrder: draftQuestionList.map((item, index) => ({
              questionTemplateId: item.questionTemplate.id,
              index,
            })),
          }
        : draftGame;
      if (originalGame == null) return true;
      return compareGames(effectiveDraft, originalGame);
    }

    if (originalQuestion == null) return draftQuestion != null;
    return draftQuestion != null && compareQuestions(draftQuestion, originalQuestion);
  }, [isModalOpen, templateType, draftGame, originalGame, draftQuestion, originalQuestion, draftQuestionList, compareGames, compareQuestions]);

  return (
    <Fade
      in={isModalOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <IntegratedContainer elevation={12} style={{ maxWidth: '430px', padding: `${theme.sizing.xLgPadding}px`}}>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
            <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.mdPadding}px` }}>
              {/* eslint-disable-next-line no-nested-ternary */}
              {
              isCardErrored ? 
              (
                <>
                  <DragText> Missing required fields! </DragText>
                  <BodyText> All required input fields need to be completed before you can publish this question. </BodyText>
                </>
              ) :
              (
                <>
                  <DragText> Ready to publish! </DragText>
                  <BodyText> You&apos;re all set. Publish to add it to My Library and make it discoverable if it&apos;s set to public. </BodyText>
                </>
              )}
            <Box style={{ display: 'flex', flexDirection:'column', gap: `${theme.sizing.xSmPadding}px` }}>
              <CentralButton
                buttonType={ButtonType.PUBLISH}
                isEnabled={!isCardErrored}
                onClick={handlePublishGame}
              />
              {title.length > 0 ? (
                <CentralButton
                  buttonType={ButtonType.SAVEDRAFTBLUE}
                  isEnabled={contentChanged ?? false}
                  onClick={handleSaveDraft}
                />
              ): (
                <Tooltip 
                  title='Drafts must include a title'
                  enterTouchDelay={500}
                  enterDelay={500} 
                  enterNextDelay={500} 
                  placement="top" 
                  arrow
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    },
                  }}
                >
                  <span>
                    <CentralButton
                      buttonType={ButtonType.SAVEDRAFTBLUE}
                      isEnabled={false}
                      onClick={handleSaveDraft}
                    />
                  </span>
                </Tooltip>
              )}
              <CentralButton
                buttonType={ButtonType.BACKTOEDIT}
                isEnabled
                onClick={handleCloseSaveGameModal}
              />
              </Box>
            </Box>
        </Box>
      </IntegratedContainer>
    </Fade>
  );
}
