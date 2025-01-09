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
          const regenExplanation = await apiClients.AI.waegen(regenInput);
          handleClickOutput(regenExplanation);
        }
        break;
      }
      case AIButtonType.WAE_GEN:
      default: {
        if (waegenInput && handleClickOutput){
          const explanation = await apiClients.AI.waegen(waegenInput);
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