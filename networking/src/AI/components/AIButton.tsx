import { ButtonStyled } from './styledcomponents/StyledAIButton';

interface AIButtonProps {
  handleClickOutput: (outputs: string) => void;
}

export default function AIButton({
  handleClickOutput
}: AIButtonProps) {
  const handleButtonClick = () => {
    // do AI stuff
    const outputs = 'ouputsfromAImodels';
    handleClickOutput(outputs);
  }

  return (
    <ButtonStyled
      disabled={false}
      onClick={handleButtonClick}
    >
   </ButtonStyled> 
  )
}