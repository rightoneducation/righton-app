// Master on/off switch for the EduData / UpGrade experiment integration.
// While false, the EduData client is never created (eduData stays null), so
// every assign / markExposure / logMetric call across the app becomes a no-op.
// Flip to true to enable the integration.
export const EDUDATA_ENABLED = false;
