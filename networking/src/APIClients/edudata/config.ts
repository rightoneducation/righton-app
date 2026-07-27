// Master on/off switch for the EduData / UpGrade experiment integration.
// While false, the EduData client is never created (eduData stays null), so
// every assign / markExposure / logMetric call across the app becomes a no-op.
// Flip to false to disable the integration.
export const EDUDATA_ENABLED = true;
