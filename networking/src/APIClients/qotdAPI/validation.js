export const validateQuestion = (input) => {
    if (!input.options || input.options.length < 2) {
      throw new Error('At least 2 options required');
    }
  
    const correctOptions = input.options.filter(opt => opt.isCorrect);
    if (correctOptions.length !== 1) {
      throw new Error('Exactly one option must be marked correct');
    }
  
    // Additional validations as needed
    if (input.options.some(opt => !opt.text.trim())) {
      throw new Error('Option text cannot be empty');
    }
  };