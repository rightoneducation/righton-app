import React from 'react';

/**
 * A template's own PDF design (qa2 PDFs): what it puts where the default pages
 * put their generic parts. Templates without one keep the default export
 * (ActivityHandouts' Artifact).
 */
export interface TemplatePdf {
  /** Over the teacher copy's artifact, after How to run. */
  teacherHeading: React.ReactNode;
  teacherArtifact: React.ReactNode;
  /** Everything under the student copy's header. */
  studentBody: React.ReactNode;
  /** The student header's misconception banner; the qa2 student frames drop it. */
  studentShowsMisconception: boolean;
}
