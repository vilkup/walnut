import { ILocation } from '../domain/types/location';

export const validateGeolocation = ({ latitude, longitude }: ILocation) => {
  return (
    latitude != null && longitude != null &&
    !isNaN(latitude) && !isNaN(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};
