export interface Location {
  latitude: number;
  longitude: number;
}

export interface PetPointOfInterest {
  id: string;
  name: string;
  type: "veterinary" | "shelter" | "meetup" | "park" | "store";
  location: Location;
  address: string;
  phone?: string;
  website?: string;
  description: string;
  rating: number;
  isOpen: boolean;
  openHours?: {
    [key: string]: string; // day: hours
  };
  distance?: number; // in kilometers
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface MapState {
  userLocation: UserLocation | null;
  pointsOfInterest: PetPointOfInterest[];
  selectedPoint: PetPointOfInterest | null;
  isLoading: boolean;
  error: string | null;
}
