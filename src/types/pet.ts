export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  size: "small" | "medium" | "large";
  gender: "male" | "female";
  location: string;
  photos: string[];
  description: string;
  personality: string[];
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  energy: "low" | "medium" | "high";
}

export interface SwipeAction {
  petId: string;
  action: "like" | "dislike";
  timestamp: Date;
}
