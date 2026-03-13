import type {PresenceRecord, ReportBucket} from '../types/presence';

const two = (value: number): string => value.toString().padStart(2, '0');

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()} à ${two(
    date.getHours(),
  )}:${two(date.getMinutes())}`;
};

export const getLateMinutes = (
  date: Date,
  thresholdHour: number,
  thresholdMinute: number,
): number => {
  const threshold = new Date(date);
  threshold.setHours(thresholdHour, thresholdMinute, 0, 0);

  const deltaMs = date.getTime() - threshold.getTime();
  return deltaMs > 0 ? Math.floor(deltaMs / 60000) : 0;
};

const isInSameWeek = (date: Date, now: Date): boolean => {
  const current = new Date(now);
  const currentDay = current.getDay() === 0 ? 7 : current.getDay();
  const weekStart = new Date(current);
  weekStart.setDate(current.getDate() - (currentDay - 1));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return date >= weekStart && date < weekEnd;
};

const isInSameMonth = (date: Date, now: Date): boolean => {
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const createBucket = (records: PresenceRecord[]): ReportBucket => ({
  totalBadges: records.length,
  validatedBadges: records.filter(record => record.isValidated).length,
  lateCount: records.filter(record => record.isValidated && record.isLate).length,
  lateMinutesTotal: records
    .filter(record => record.isValidated && record.isLate)
    .reduce((sum, record) => sum + record.lateMinutes, 0),
});

export const buildWeeklyReport = (records: PresenceRecord[]): ReportBucket => {
  const now = new Date();
  return createBucket(records.filter(record => isInSameWeek(new Date(record.timestamp), now)));
};

export const buildMonthlyReport = (records: PresenceRecord[]): ReportBucket => {
  const now = new Date();
  return createBucket(records.filter(record => isInSameMonth(new Date(record.timestamp), now)));
};
