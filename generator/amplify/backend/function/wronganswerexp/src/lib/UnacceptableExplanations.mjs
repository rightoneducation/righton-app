const UnacceptableExplanation = {
  "UnacceptableExplanation": [
    {
      "question": "A child is raising a flag up a 20-foot flag pole. She starts pulling at a rate of 2 feet per second for 5 seconds, but she starts to get tired and decreases her rate to 1/2 foot per second for the remainder of the time. In total, how many seconds does it take her to raise the flag from the bottom to the top?",
      "correctAnswer": "25",
      "incorrectAnswer": "13.75",
      "unacceptableAnswer": "Students may have attempted a complex averaging of the rates without properly considering the two distinct time periods involved. They possibly tried averaging 2 feet per second and 0.5 feet per second to mistakenly use 1.25 feet per second as the constant rate for the entire 20 feet. This would incorrectly result in (20 feet) / (1.25 feet per second) = 16 seconds. Adding an inconsistency by assuming an arbitrary reduction in time due to 'getting tired,' they might have adjusted down to 13.75 seconds without clear reasoning.",
      "reason": "This explanation doesn't provide a believable way to get 13.75. It instead uses 'getting tired' as a means to reduce a method from an arbitrary 16 to 13.75"
    },
    {
      "question": "A child is raising a flag up a 20-foot flag pole. She starts pulling at a rate of 2 feet per second for 5 seconds, but she starts to get tired and decreases her rate to 1/2 foot per second for the remainder of the time. In total, how many seconds does it take her to raise the flag from the bottom to the top?",
      "correctAnswer": "25",
      "incorrectAnswer": "13.75",
      "unacceptableAnswer": "Students may have attempted a complex averaging of the rates without properly considering the two distinct time periods involved. They possibly tried averaging 2 feet per second and 0.5 feet per second to mistakenly use 1.25 feet per second as the constant rate for the entire 20 feet. This would incorrectly result in (20 feet) / (1.25 feet per second) = 16 seconds. A slight rounding error could lead to an incorrect 13.75 seconds",
      "reason": "This explanation doesn't provide a believable way to get 13.75. It instead uses a rounding error as a means to reduce a method from an arbitrary 16 to 13.75"
    }
  ]
};

export default UnacceptableExplanation;