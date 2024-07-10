import { sortMistakes } from '../components/FeaturedMistakes';


jest.mock('@righton/networking', () => {
  return {
    AnswerType: Object.freeze({
      NUMBER: 0,
      STRING: 1,
      EXPRESSION: 2,
      MULTICHOICE: 3
    }),
    AnswerPrecision: Object.freeze({
      WHOLE: 0,
      TENTH: 1,
      HUNDREDTH: 2,
      THOUSANDTH: 3
    })
  };
});

import { AnswerType, AnswerPrecision } from '@righton/networking';
const setSelectedMistakes = jest.fn();

test('test sorting of 3 numbers of equal popularity', () => {
  const shortAnswerResponses = [
    {
      rawAnswer: '2', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '1', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '3', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: true
    }
  ];
  const totalAnswers = 3;
  const sortedMistakes = [
    {
      answer: '1', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 33, 
      isSelected: true
    }, 
    {
      answer: '2', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 33, 
      isSelected: true
    },  
    {
      answer: '3', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 33, 
      isSelected: true
    }
  ];
  expect(sortMistakes(shortAnswerResponses, totalAnswers, true, 3, setSelectedMistakes)).toStrictEqual(sortedMistakes);
});

test('test sorting of answers that begin with 0 and 1 (test case #1 from slack) and have equal popularity', () => {
  const shortAnswerResponses = [
    {
      rawAnswer: '27', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 29, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '0', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '1', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: true
    },
    {
      rawAnswer: '100', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '25', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '888', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: false
    },
  ];
  const totalAnswers = 100;
  const sortedMistakes = [
    {
      answer: '27', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 29, 
      isSelected: true
    }, 
    {
      answer: '0', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: true
    },  
    {
      answer: '1', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: true
    },
    {
      answer: '25', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: false
    },
    {
      answer: '100', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: false
    },
    {
      answer: '888',
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE, 
      percent: 14, 
      isSelected: false
    }
  ];
  expect(sortMistakes(shortAnswerResponses, totalAnswers, true, 3, setSelectedMistakes)).toStrictEqual(sortedMistakes);
});

test('test sorting of answers that begin with 0 and 1 (test case #2 from slack) and have equal popularity', () => {
  const shortAnswerResponses = [
    {
      rawAnswer: '6', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 29, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '1001', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '2', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: true
    },
    {
      rawAnswer: '23', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '500', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '777', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 14, 
      isSelectedMistake: false
    },
  ];
  const totalAnswers = 100;
  const sortedMistakes = [
    {
      answer: '6', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 29, 
      isSelected: true
    },  
    {
      answer: '2', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: true
    },
    {
      answer: '23', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: true
    },
    {
      answer: '500', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: false
    },
    {
      answer: '777', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: false
    },
    {
      answer: '1001', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 14, 
      isSelected: true
    }
  ];
  expect(sortMistakes(shortAnswerResponses, totalAnswers, true, 3, setSelectedMistakes)).toStrictEqual(sortedMistakes);
});

test('test sorting of answers that end with hanging zeros and have equal popularity', () => {
  const shortAnswerResponses = [
    {
      rawAnswer: '4', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '2', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 2, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '4.0', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: true
    },
    {
      rawAnswer: '2.0', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '5', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '5.0',
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH, 
      count: 1, 
      isSelectedMistake: false
    },
    ,
    {
      rawAnswer: '6', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: false
    },
  ];
  const totalAnswers = 8;
  const sortedMistakes = [
    {
      answer: '2', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 25, 
      isSelected: true
    },  
    {
      answer: '2.0', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: true
    },
    {
      answer: '4', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13,
      isSelected: true
    },
    {
      answer: '4.0', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: true
    },
    {
      answer: '5', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13, 
      isSelected: false
    },
    {
      answer: '5.0', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: false
    }
    ,
    {
      answer: '6', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13, 
      isSelected: false
    }
  ];
  expect(sortMistakes(shortAnswerResponses, totalAnswers, true, 3, setSelectedMistakes)).toStrictEqual(sortedMistakes);
});


test('test sorting of answers that are percentages and have equal popularity', () => {
  const shortAnswerResponses = [
    {
      rawAnswer: '4%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '2%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 2, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '4.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: true
    },
    {
      rawAnswer: '2.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '1001%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '5.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '6%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: false
    },
  ];
  const totalAnswers = 8;
  const sortedMistakes = [
    {
      answer: '2%',
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE, 
      percent: 25, 
      isSelected: true
    },  
    {
      answer: '2.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: true
    },
    {
      answer: '4%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13,
      isSelected: true
    },
    {
      answer: '4.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: true
    },
    {
      answer: '5.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: false
    }
    ,
    {
      answer: '6%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13, 
      isSelected: false
    },
    {
      answer: '1001%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13, 
      isSelected: false
    },
  ];
  expect(sortMistakes(shortAnswerResponses, totalAnswers, true, 3, setSelectedMistakes)).toStrictEqual(sortedMistakes);
});

test('test sorting of percentage answers that are a mix of decimals precisions and have equal popularity', () => {
  const shortAnswerResponses = [
    {
      rawAnswer: '4.001%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.THOUSANDTH,
      count: 1, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '2%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: '4.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: true
    },
    {
      rawAnswer: '2.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '1001.000%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.THOUSANDTH,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '0.5%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: '1.05%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.HUNDREDTH,
      count: 1, 
      isSelectedMistake: false
    },
  ];
  const totalAnswers = 8;
  const sortedMistakes = [
    {
      answer: '0.5%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: true
    },
    {
      answer: '1.05%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.HUNDREDTH,
      percent: 13, 
      isSelected: true
    },
    {
      answer: '2%',
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.WHOLE, 
      percent: 13, 
      isSelected: true
    },  
    {
      answer: '2.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: false
    },
    {
      answer: '4.0%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.TENTH,
      percent: 13, 
      isSelected: true
    },
    {
      answer: '4.001%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.THOUSANDTH,
      percent: 13,
      isSelected: true
    },
    {
      answer: '1001.000%', 
      answerType: AnswerType.NUMBER,
      answerPrecision: AnswerPrecision.THOUSANDTH,
      percent: 13, 
      isSelected: false
    },
  ];
  expect(sortMistakes(shortAnswerResponses, totalAnswers, true, 3, setSelectedMistakes)).toStrictEqual(sortedMistakes);
});


test('test sorting of answers that are string and have equal popularity', () => {
  const shortAnswerResponses = [
    {
      rawAnswer: 'zebra', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 2, 
      isSelectedMistake: true
    }, 
    {
      rawAnswer: 'giraffe', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: 'penguin', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 2, 
      isSelectedMistake: true
    },
    {
      rawAnswer: 'monkey', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 1, 
      isSelectedMistake: false
    },
    {
      rawAnswer: 'aardvark', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      count: 2, 
      isSelectedMistake: true
    }
  ];
  const totalAnswers = 8;
  const sortedMistakes = [
    {
      answer: 'aardvark', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 25, 
      isSelected: true
    },  
    {
      answer: 'penguin', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 25, 
      isSelected: true
    },
    {
      answer: 'zebra', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 25,
      isSelected: true
    },
    {
      answer: 'giraffe', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13, 
      isSelected: false
    },
    {
      answer: 'monkey', 
      answerType: AnswerType.STRING,
      answerPrecision: AnswerPrecision.WHOLE,
      percent: 13, 
      isSelected: false
    }
  ];
  expect(sortMistakes(shortAnswerResponses, totalAnswers, true, 3, setSelectedMistakes)).toStrictEqual(sortedMistakes);
});
