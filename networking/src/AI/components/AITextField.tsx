import { StyledAITextField } from './styledcomponents/StyledAITextField';

interface AITextFieldProps {
  text: string;
  handleUpdateText: (text: string) => void;
}

/**
 * Text field used for editing and display text received from AI-source
 * It is assumed that text and update text will be updating both a locally stored text value and a debounced text value from the central updateText function
 * This is deliberately hoisted outside of this component so that the local state can be readily adjusted
 * @param text = text value displayed in the text field
 * @param handleUpdateText = handler function that will update the text value of the field in both local and debounced state
 */
export default function AITextField ({
  text,
  handleUpdateText
}: AITextFieldProps ) {

  return (
    <StyledAITextField 
      value={text}
      onChange={(e) => handleUpdateText(e.target.value)}
      label="AI Text Field"
      variant="outlined"
      error={text.length > 10}
      helperText={text.length > 10 ? 'Text too long' : ''}
    />
  )
}