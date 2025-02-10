import { ButtonStyled, RegenButtonStyled, RegenButtonTextStyled } from './styledcomponents/StyledAIButton';
import { AIButtonType, WaegenInput, RegenInput, aiButtonContentMap } from '../models/AIButtonModels';
import { IAPIClients } from '../../APIClients';

interface AIButtonProps {
  waegenInput?: WaegenInput;
  regenInput?: RegenInput;
  type: AIButtonType;
  apiClients: IAPIClients;
  handleClickOutput?: (outputs: string) => void;
  handleAIEnabled?: (isAIEnabled: boolean) => void;
}

export function AIButton({
  waegenInput,
  regenInput,
  type,
  apiClients,
  handleClickOutput,
  handleAIEnabled
}: AIButtonProps) {
  const IconComponent = aiButtonContentMap[type].icon;
  const handleButtonClick = async () => {
    switch(type){
      case AIButtonType.WAE_REGEN: {
        if (handleAIEnabled){
          handleAIEnabled(true);
        }
        break;
      }
      case AIButtonType.WAE_REGENSUBMIT: {
        if (regenInput && handleClickOutput){
          console.log('regenInput', regenInput);
          const regenExplanation = await apiClients.AI.waeregen(regenInput);
          handleClickOutput(regenExplanation);
        }
        break;
      }
      case AIButtonType.WAE_GEN:
      default: {
        console.log('sup');
        console.log(waegenInput);
        if (waegenInput && handleClickOutput){
          if (waegenInput.question.length === 0 || waegenInput.correctAnswer.length === 0 || waegenInput.wrongAnswer.length === 0){
            console.log('bad');
            handleClickOutput('ERROR');
            break;
          }
          console.log('sup2');
          const explanation = await apiClients.AI.waegen(waegenInput);
          console.log('explanation');
          handleClickOutput(explanation);
        }
        break;
      }
    };
  }
  return (
    <>
    { type === AIButtonType.WAE_REGENSUBMIT
      ? <RegenButtonStyled
          disabled={false}
          onClick={handleButtonClick}
        >
          <RegenButtonTextStyled>
            Submit
          </RegenButtonTextStyled>
        </RegenButtonStyled>
      : <ButtonStyled
          disabled={false}
          onClick={handleButtonClick}
        >
          {IconComponent && 
            <IconComponent />
          }
        </ButtonStyled> 
    }
   </>
  )
}