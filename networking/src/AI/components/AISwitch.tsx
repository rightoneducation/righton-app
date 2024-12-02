import { StyledAISwitch } from './styledcomponents/StyledAISwitch';

interface AISwitchProps {
  switchValue: boolean;
  handleSwitchChange: (value: boolean) => void;
}

/**
 * Switch used for toggling AI on and off
 * @param switchValue = boolean value of the switch
 * @param handleSwitchChange = handler function that will update the switch value
 */
export default function AISwitch({ 
  switchValue,
  handleSwitchChange 
}: AISwitchProps) {
  return (
    <StyledAISwitch 
      defaultChecked
      value={switchValue}
      onChange={(e) => handleSwitchChange(e.target.checked)}
    />
  );
}