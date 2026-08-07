export function getAdminSystemStatus(env: Record<string, string | undefined>) {
  const googleSheets = Boolean(env.GOOGLE_APPS_SCRIPT_URL && (env.ADMIN_DATA_SHARED_SECRET || env.LEADS_SHARED_SECRET));
  const lineOA = Boolean(env.LINE_CHANNEL_ACCESS_TOKEN && env.LINE_TARGET_ID);
  return { googleSheets, lineOA, login: true, imageUploads: true };
}
