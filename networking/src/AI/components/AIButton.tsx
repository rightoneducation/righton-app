import { ButtonStyled } from './styledcomponents/StyledAIButton';
import { AIButtonType, WaegenInput, aiButtonContentMap } from '../models/AIButtonModels';
import { IAPIClients } from '../../APIClients';

interface AIButtonProps {
  waegenInput?: WaegenInput;
  type: AIButtonType;
  apiClients: IAPIClients;
  handleClickOutput: (outputs: string) => void;
}

export function AIButton({
  waegenInput,
  type,
  apiClients,
  handleClickOutput
}: AIButtonProps) {
  const IconComponent = aiButtonContentMap[type].icon;
  const handleButtonClick = async () => {
    const explanation = await apiClients.AI.waegen(waegenInput);
    console.log(explanation);
    handleClickOutput(explanation);
  }
  console.log(waegenInput);
  return (
    <ButtonStyled
      disabled={false}
      onClick={handleButtonClick}
    >
      {IconComponent && 
        <IconComponent />
      }
   </ButtonStyled> 
  )
}