import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type {Coordinates} from '../types/presence';

const ensureAndroidLocationPermission = async (): Promise<void> => {
  if (Platform.OS !== 'android') {
    return;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Permission de localisation',
      message: 'L\'application a besoin de votre position pour valider votre présence.',
      buttonPositive: 'Autoriser',
      buttonNegative: 'Refuser',
      buttonNeutral: 'Plus tard',
    },
  );

  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new Error('La permission de localisation a été refusée.');
  }
};

export const LocationService = {
  async getCurrentPosition(): Promise<Coordinates> {
    await ensureAndroidLocationPermission();

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          reject(new Error(error.message || 'Impossible de récupérer la position GPS.'));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );
    });
  },
};
