// import React from 'react';
// import { Typography, Box } from '@mui/material';
// import { useTheme, styled } from '@mui/material/styles';
// import { v4 as uuidv4 } from 'uuid';
// import { useTranslation } from 'react-i18next';
// import {
//     IQuestion,
//   } from '@righton/networking';
// import QuestionCard from './QuestionCard';
// import ScrollBoxStyled from '../lib/styledcomponents/layout/ScrollBoxStyled';

// interface QuestionListProps {
//   questions: IQuestion[];
// }
// // interface IQuestion {
// //     questionText: string;
// //     questionUrl: string;
// //     // Add other properties as needed
// //   }

// const BoxStyled = styled(Box)({
//     padding: '16px 12px 16px 12px',
//     // width: '316px',
//     width: '100%',
//     margin: 'auto',
//   })

// export default function QuestionList({ questions }: QuestionListProps) {
//   const theme = useTheme();
//   const { t } = useTranslation();

//   return (
//     <BoxStyled>
//       {questions.map((question, index) => (
//         <Box
//           key={uuidv4()}
//           sx={{
//             marginBottom: theme.spacing(2),
//             borderBottom: `1px solid ${theme.palette.divider}`,
//             paddingBottom: theme.spacing(2),
//             width: '100%',
//             margin: 'auto',
//                   }}
//         >
//           <Typography variant="h2" sx={{ textAlign: 'center', marginBottom: theme.spacing(1) }}>
//             {t('gameinprogress.discussanswer.question')} {index + 1}
//           </Typography>
//           <QuestionCard
//             questionText={question.text}
//             imageUrl={question.imageUrl}
//           />
//         </Box>
//       ))}
//     </BoxStyled>
//   );
// }
// export {}; 

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { IQuestion } from '@righton/networking';
import QuestionCard from './QuestionCard';
import TitleQuestionCard from './TitleQuestionCard';
import ScrollBoxStyled from '../lib/styledcomponents/layout/ScrollBoxStyled';

interface QuestionListProps {
  questions: IQuestion[];
}

const BoxStyled = styled(Box)({
  width: '90%',
  // alignItems: 'center',
  boxSizing: 'border-box',
  margin: 'auto',
});

export default function QuestionList({ questions }: QuestionListProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollBoxStyled>
        <BoxStyled key={uuidv4()}>
          <Box
            sx={{
              marginBottom: theme.spacing(2),
              borderBottom: `1px solid ${theme.palette.divider}`,
              paddingBottom: theme.spacing(2),
              width: '100%',
            }}
          >
        <TitleQuestionCard
        />          
    </Box>
        </BoxStyled>
      {questions.map((question, index) => (
        <BoxStyled key={uuidv4()}>
          <Box
            sx={{
              marginBottom: theme.spacing(2),
              borderBottom: `1px solid ${theme.palette.divider}`,
              paddingBottom: theme.spacing(2),
              width: '100%',
            }}
          >
            <QuestionCard
              questionText={question.text}
              imageUrl={question.imageUrl}
              index = {index}
                          />
          </Box>
        </BoxStyled>
      ))}
    </ScrollBoxStyled>
  );
}
