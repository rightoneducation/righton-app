import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IosShareIcon from '@mui/icons-material/IosShare';
import { IActivityContent } from '../../lib/ActivityContentModels';
import { IActivityTemplateCopy } from '../../lib/activityTemplates';
import exportActivityPdf, { PdfAudience } from '../../lib/pdf/exportActivityPdf';
import {
  ExampleTile,
  ExampleTiles,
  ExamplesToolbar,
  ExportButton,
  PagerButton,
  PagerRow,
  ScreenSizeProps,
  ToggleGroup,
  ViewPillOption,
  ViewPillToggle,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';

/*
 * The parts every Facilitate artifact panel shares (all five template frames
 * draw them the same way): the artifact title with the Teacher / Student view
 * toggle, its note and the PDF export; and, for the templates with a set of
 * examples, the example tiles and the Prev / Next pager.
 */

export interface ArtifactPanelProps extends ScreenSizeProps {
  content: IActivityContent;
  template: IActivityTemplateCopy;
  misconceptionTitle: string;
}

export interface ArtifactView {
  isTeacher: boolean;
  setAudience: (audience: PdfAudience) => void;
  isExporting: boolean;
  handleExport: () => Promise<void>;
}

/** The view toggle's state and the export for the view it is on. */
export function useArtifactView({
  content,
  template,
  misconceptionTitle,
}: Omit<ArtifactPanelProps, 'screenSize'>): ArtifactView {
  const { t } = useTranslation();
  const [audience, setAudience] = React.useState<PdfAudience>('teacher');
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportActivityPdf({ audience, content, template, misconceptionTitle, t });
    } finally {
      setIsExporting(false);
    }
  };

  return { isTeacher: audience === 'teacher', setAudience, isExporting, handleExport };
}

export function ArtifactHeader({
  titleId,
  title,
  view,
}: {
  titleId: string;
  title: string;
  view: ArtifactView;
}) {
  const { t } = useTranslation();
  const { isTeacher, setAudience, isExporting, handleExport } = view;

  let exportLabel = t('activityFlow.facilitate.exportStudent');
  if (isExporting) exportLabel = t('activityFlow.facilitate.exporting');
  else if (isTeacher) exportLabel = t('activityFlow.facilitate.exportTeacher');

  return (
    <>
      <Typography id={titleId} variant="headingMd" component="h2">
        {title}
      </Typography>
      <ExamplesToolbar>
        <ToggleGroup>
          <ViewPillToggle role="group" aria-label={t('activityFlow.facilitate.viewLabel')}>
            <ViewPillOption
              isActive={isTeacher}
              aria-pressed={isTeacher}
              onClick={() => setAudience('teacher')}
            >
              {t('activityFlow.facilitate.teacherView')}
            </ViewPillOption>
            <ViewPillOption
              isActive={!isTeacher}
              aria-pressed={!isTeacher}
              onClick={() => setAudience('student')}
            >
              {t('activityFlow.facilitate.studentView')}
            </ViewPillOption>
          </ViewPillToggle>
          <Typography variant="microLabel">{t('activityFlow.facilitate.viewNote')}</Typography>
        </ToggleGroup>
        <ExportButton
          disableElevation
          disabled={isExporting}
          endIcon={<IosShareIcon />}
          onClick={handleExport}
        >
          {exportLabel}
        </ExportButton>
      </ExamplesToolbar>
    </>
  );
}

/** One tile per example; picking one shows it in full below. */
export function ExamplePicker({
  count,
  index,
  onSelect,
  renderTile,
  screenSize,
}: ScreenSizeProps & {
  count: number;
  index: number;
  onSelect: (index: number) => void;
  renderTile: (index: number) => React.ReactNode;
}) {
  return (
    <ExampleTiles screenSize={screenSize}>
      {Array.from({ length: count }, (unused, tileIndex) => (
        <ExampleTile
          // Tiles are positional: example N is always tile N.
          // eslint-disable-next-line react/no-array-index-key
          key={tileIndex}
          isSelected={tileIndex === index}
          aria-pressed={tileIndex === index}
          onClick={() => onSelect(tileIndex)}
        >
          {renderTile(tileIndex)}
        </ExampleTile>
      ))}
    </ExampleTiles>
  );
}

/** "Example 2 of 3", over the example shown in full. */
export function ExampleOfHeading({ index, count }: { index: number; count: number }) {
  const { t } = useTranslation();
  return (
    <Typography variant="headingMdBold" component="h3">
      {t('activityFlow.facilitate.exampleLabel', { number: index + 1 })}
      <Typography component="span" variant="headingMd" sx={{ fontWeight: 400 }}>
        {` ${t('activityFlow.facilitate.ofTotal', { total: count })}`}
      </Typography>
    </Typography>
  );
}

export function ExamplePager({
  index,
  count,
  onChange,
}: {
  index: number;
  count: number;
  onChange: (index: number) => void;
}) {
  const { t } = useTranslation();
  if (count < 2) return null;
  return (
    <PagerRow>
      <PagerButton
        startIcon={<ArrowBackIcon />}
        disabled={index === 0}
        onClick={() => onChange(Math.max(index - 1, 0))}
      >
        {t('activityFlow.facilitate.prev')}
      </PagerButton>
      <PagerButton
        endIcon={<ArrowForwardIcon />}
        disabled={index === count - 1}
        onClick={() => onChange(Math.min(index + 1, count - 1))}
      >
        {t('activityFlow.facilitate.next')}
      </PagerButton>
    </PagerRow>
  );
}
