export interface UserTrainData {
  userId: string;
  userName: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
}

export interface UpsertUserTrainDataInput {
  userId: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
}

export interface UserRepository {
  findById(userId: string): Promise<UserTrainData | null>;
  upsertTrainData(data: UpsertUserTrainDataInput): Promise<UserTrainData>;
}
