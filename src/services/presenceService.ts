import {APP_CONFIG} from '../config/appConfig';
import {LocationService} from './locationService';
import {PresenceStorage} from '../storage/presenceStorage';
import {getDistanceInMeters} from '../utils/distance';
import {getLateMinutes} from '../utils/date';
import type {PresenceRecord} from '../types/presence';

const buildId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const PresenceService = {
  async checkPresence(): Promise<PresenceRecord> {
    const userLocation = await LocationService.getCurrentPosition();
    const distance = getDistanceInMeters(userLocation, APP_CONFIG.companyLocation);
    const now = new Date();

    const isValidated = distance <= APP_CONFIG.allowedPresenceRadiusMeters;
    const lateMinutes = isValidated
      ? getLateMinutes(now, APP_CONFIG.lateThresholdHour, APP_CONFIG.lateThresholdMinute)
      : 0;
    const isLate = isValidated && lateMinutes > 0;

    const statusMessage = !isValidated
      ? `Présence refusée : vous êtes à ${distance} m du point de badge.`
      : isLate
        ? `Présence validée avec retard (${lateMinutes} min).`
        : 'Présence validée à temps.';

    const record: PresenceRecord = {
      id: buildId(),
      timestamp: now.toISOString(),
      userLocation,
      distance,
      isValidated,
      isLate,
      lateMinutes,
      statusMessage,
    };

    await PresenceStorage.save(record);
    return record;
  },

  async getRecords(): Promise<PresenceRecord[]> {
    return PresenceStorage.getAll();
  },

  async clearRecords(): Promise<void> {
    await PresenceStorage.clear();
  },
};
