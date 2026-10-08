import React from 'react';
import { IActivityContent, ISpotTheSlipFacilitate } from '../ActivityContentModels';
import { IActivityTemplateCopy } from '../activityTemplates';
import { Translate } from '../activityMarks';

export type PdfAudience = 'teacher' | 'student';

interface ExportActivityPdfArgs {
  audience: PdfAudience;
  content: IActivityContent;
  /** Only Spot the Slip exports so far. */
  facilitate: ISpotTheSlipFacilitate;
  template: IActivityTemplateCopy;
  misconceptionTitle: string;
  t: Translate;
}

/**
 * Renders the teacher or student PDF and hands it to the browser's own viewer
 * in a new tab, which already provides preview, print and save (including
 * Save to Files on iOS).
 *
 * Call it straight from the click handler: the tab is opened before the first
 * await so it survives the pop-up blocker. @react-pdf is heavy, so it only
 * loads on the first export rather than in the main bundle.
 */
export default async function exportActivityPdf({
  audience,
  content,
  facilitate,
  template,
  misconceptionTitle,
  t,
}: ExportActivityPdfArgs): Promise<void> {
  const tab = window.open('', '_blank');

  try {
    const [{ pdf }, { TeacherHandout, StudentHandout }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./ActivityHandouts'),
    ]);
    const handout =
      audience === 'teacher' ? (
        <TeacherHandout
          content={content}
          facilitate={facilitate}
          template={template}
          misconceptionTitle={misconceptionTitle}
          t={t}
        />
      ) : (
        <StudentHandout
          facilitate={facilitate}
          template={template}
          misconceptionTitle={misconceptionTitle}
          t={t}
        />
      );
    const blob = await pdf(handout).toBlob();
    const url = URL.createObjectURL(blob);

    if (tab) {
      tab.location.href = url;
    } else {
      // Pop-up blocked: download instead, so the export still produces something.
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name} (${audience}).pdf`;
      link.click();
    }

    // Released once the tab or download has taken it; Firefox cancels an
    // in-flight download if it is revoked synchronously.
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) {
    tab?.close();
    throw error;
  }
}
