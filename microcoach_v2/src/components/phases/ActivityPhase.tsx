import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { IActivityContent } from '../../lib/PipelineModels';
import IncorrectWorkedExamples from '../activities/IncorrectWorkedExamples';
import FavoriteNo from '../activities/FavoriteNo';
import CompareTheThinking from '../activities/CompareTheThinking';
import MultipleRepresentations from '../activities/MultipleRepresentations';
import MathHospital from '../activities/MathHospital';
import {
  ViewToggle,
  ViewToggleOption,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IActivityContent | null;
}

export default function ActivityPhase({ content }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isTeacherView, setIsTeacherView] = React.useState(true);

  if (!content) {
    return (
      <Typography
        variant="smallBodyText"
        sx={{ color: 'designSystem.surface.ashyGray' }}
      >
        {t('activityDetail.noContent')}
      </Typography>
    );
  }

  const supportsToggle =
    content.type === 'INCORRECT_WORKED_EXAMPLES' ||
    content.type === 'COMPARE_THE_THINKING';

  // Closed set — every activity type the pipeline can emit has a component.
  const body = (() => {
    switch (content.type) {
      case 'INCORRECT_WORKED_EXAMPLES':
        return (
          <IncorrectWorkedExamples
            content={content}
            isTeacherView={isTeacherView}
          />
        );
      case 'FAVORITE_NO':
        return <FavoriteNo content={content} />;
      case 'COMPARE_THE_THINKING':
        return (
          <CompareTheThinking content={content} isTeacherView={isTeacherView} />
        );
      case 'MULTIPLE_REPRESENTATIONS':
        return <MultipleRepresentations content={content} />;
      case 'MATH_HOSPITAL':
        return <MathHospital content={content} />;
      default:
        return null;
    }
  })();

  const subtitle =
    'subtitle' in content ? (content.subtitle as string) : undefined;

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack spacing={`${theme.sizing.space0}px`} sx={{ minWidth: 0 }}>
          <Typography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {content.title}
          </Typography>
          {subtitle && (
            <Typography
              variant="microLabel"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>

        {supportsToggle && (
          <ViewToggle>
            <ViewToggleOption
              isActive={isTeacherView}
              onClick={() => setIsTeacherView(true)}
            >
              {t('activityDetail.teacherView')}
            </ViewToggleOption>
            <ViewToggleOption
              isActive={!isTeacherView}
              onClick={() => setIsTeacherView(false)}
            >
              {t('activityDetail.studentView')}
            </ViewToggleOption>
          </ViewToggle>
        )}
      </Stack>

      {body}
    </Stack>
  );
}
