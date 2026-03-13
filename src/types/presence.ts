export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type PresenceRecord = {
  id: string;
  timestamp: string;
  userLocation: Coordinates;
  distance: number;
  isValidated: boolean;
  isLate: boolean;
  lateMinutes: number;
  statusMessage: string;
};

export type ReportBucket = {
  totalBadges: number;
  validatedBadges: number;
  lateCount: number;
  lateMinutesTotal: number;
};
