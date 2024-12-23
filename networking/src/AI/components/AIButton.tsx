import { ButtonStyled } from './styledcomponents/StyledAIButton';
import { AIButtonType, waegenInput, aiButtonContentMap } from '../models/AIButtonModels';
import { IAPIClients } from '../../APIClients';

interface AIButtonProps {
  waegenInput?: waegenInput;
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
  console.log(waegenInput);
  const IconComponent = aiButtonContentMap[type].icon;
  const placeholderInput = {
      "question": "A child is raising a flag up a 20-foot flag pole. She starts pulling at a rate of 2 feet per second for 5 seconds, but she starts to get tired and decreases her rate to 1/2 foot per second for the remainder of the time. In total, how many seconds does it take her to raise the flag from the bottom to the top?",
      "correctAnswer": "25",
      "wrongAnswer": "20",
      "discardedExplanations": ""
  }
  const handleButtonClick = async () => {
    const explanation = await apiClients.AI.waegen(placeholderInput);
    console.log(explanation);
    handleClickOutput(explanation);
  }
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