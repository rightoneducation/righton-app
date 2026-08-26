import { Font, StyleSheet } from '@react-pdf/renderer';
import { designSystemColors } from '../Theme';

/**
 * The PDF renderer has no DOM, so it cannot read the MUI theme. This mirrors
 * the parts of the design system the document uses — colours come from the same
 * `designSystemColors` object the app does, so a palette change lands in both.
 *
 * Fonts must be registered from real font files: the app's Google Fonts *CSS*
 * import is invisible here, and without these the PDF silently falls back to
 * Helvetica.
 */

/*
 * Served from public/fonts rather than fonts.gstatic.com: those URLs carry a
 * version hash that Google rotates (rubik v28 → v31 broke this), and a 404
 * there surfaces as an uncaught runtime error at export time.
 */
const FONTS = `${process.env.PUBLIC_URL ?? ''}/fonts`;

Font.register({
  family: 'Rubik',
  fonts: [
    { src: `${FONTS}/Rubik-400.ttf`, fontWeight: 400 },
    { src: `${FONTS}/Rubik-500.ttf`, fontWeight: 500 },
    { src: `${FONTS}/Rubik-600.ttf`, fontWeight: 600 },
    { src: `${FONTS}/Rubik-700.ttf`, fontWeight: 700 },
  ],
});

Font.register({
  family: 'Poppins',
  fonts: [
    { src: `${FONTS}/Poppins-400.ttf`, fontWeight: 400 },
    { src: `${FONTS}/Poppins-500.ttf`, fontWeight: 500 },
    { src: `${FONTS}/Poppins-600.ttf`, fontWeight: 600 },
  ],
});

// Long words in student names and equations shouldn't be hyphen-split.
Font.registerHyphenationCallback((word) => [word]);

export const pdfColors = {
  navy: designSystemColors.surface.atlanticNavy,
  deepNavy: designSystemColors.background.navyBlue,
  sky: designSystemColors.surface.skyBlue,
  white: designSystemColors.surface.white,
  offWhite: designSystemColors.background.offWhite,
  grey: designSystemColors.foreground.wildSand,
  neutralGrey: designSystemColors.surface.neutralGray,
  accent: designSystemColors.foreground.accentBlue,
  needsSupport: designSystemColors.status.needsSupport,
  understood: designSystemColors.status.understood,
  prerequisite: designSystemColors.status.prerequisite,
  errorFill: designSystemColors.status.error,
  errorStroke: designSystemColors.status.errorStroke,
  successFill: designSystemColors.status.lightGreen,
  muted: designSystemColors.surface.ashyGray,
};

export const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: 'Rubik',
    fontSize: 10,
    color: pdfColors.navy,
  },
  docTitle: { fontFamily: 'Poppins', fontSize: 18, fontWeight: 600 },
  docSubtitle: { fontFamily: 'Rubik', fontSize: 10, marginTop: 4 },
  sectionTitle: {
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
  },
  blockTitle: { fontFamily: 'Poppins', fontSize: 12, fontWeight: 600 },
  label: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 2,
  },
  body: { fontFamily: 'Rubik', fontSize: 10, lineHeight: 1.4 },
  bodyBold: { fontFamily: 'Rubik', fontSize: 10, fontWeight: 700 },
  small: { fontFamily: 'Rubik', fontSize: 9, lineHeight: 1.4 },
  panel: {
    borderWidth: 1,
    borderColor: pdfColors.navy,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  tonedPanel: { borderRadius: 8, padding: 10, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  col: { flex: 1, minWidth: 0 },
  stepRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 6,
    marginBottom: 2,
  },
  stepChip: {
    backgroundColor: pdfColors.sky,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontSize: 8,
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: pdfColors.navy,
    color: pdfColors.offWhite,
    fontFamily: 'Poppins',
    fontSize: 9,
    fontWeight: 600,
    textAlign: 'center',
    paddingTop: 4,
  },
  pill: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: pdfColors.muted,
    textAlign: 'center',
  },
});
