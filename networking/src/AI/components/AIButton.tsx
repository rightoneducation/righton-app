import { ButtonStyled } from './styledcomponents/StyledAIButton';
import { waegenInput } from '../models/AIButtonModels';
import { IAPIClients } from '../../APIClients';

interface AIButtonProps {
  waegenInput?: waegenInput;
  apiClients: IAPIClients;
  handleClickOutput: (outputs: string) => void;
}

export default function AIButton({
  waegenInput,
  apiClients,
  handleClickOutput
}: AIButtonProps) {
  const handleButtonClick = async () => {
    const explanation = await apiClients.AI.waegen(waegenInput);
    handleClickOutput(explanation);
  }

  return (
    <ButtonStyled
      disabled={false}
      onClick={handleButtonClick}
    >
   </ButtonStyled> 
  )
}