import type { UserRepository } from "../../domain/ports/repositories/UserRepository.js";

interface InputDto {
  userId: string;
}

interface OutputDto {
  userId: string;
  userName: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
}

export class GetUserTrainData {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: InputDto): Promise<OutputDto | null> {
    const result = await this.userRepository.findById(dto.userId);

    if (!result) return null;

    return {
      userId: result.userId,
      userName: result.userName,
      weightInGrams: result.weightInGrams,
      heightInCentimeters: result.heightInCentimeters,
      age: result.age,
      bodyFatPercentage: result.bodyFatPercentage,
    };
  }
}
