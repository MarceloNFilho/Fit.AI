import type {
  UpsertUserTrainDataInput,
  UserRepository,
  UserTrainData,
} from "../../../domain/ports/repositories/UserRepository.js";
import { prisma } from "../prisma.js";

export class PrismaUserRepository implements UserRepository {
  async findById(userId: string): Promise<UserTrainData | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        weightInGrams: true,
        heightInCentimeters: true,
        age: true,
        bodyFatPercentage: true,
      },
    });

    if (
      !user ||
      user.weightInGrams == null ||
      user.heightInCentimeters == null ||
      user.age == null ||
      user.bodyFatPercentage == null
    ) {
      return null;
    }

    return {
      userId: user.id,
      userName: user.name,
      weightInGrams: user.weightInGrams,
      heightInCentimeters: user.heightInCentimeters,
      age: user.age,
      bodyFatPercentage: user.bodyFatPercentage,
    };
  }

  async upsertTrainData(
    data: UpsertUserTrainDataInput,
  ): Promise<UserTrainData> {
    const user = await prisma.user.update({
      where: { id: data.userId },
      data: {
        weightInGrams: data.weightInGrams,
        heightInCentimeters: data.heightInCentimeters,
        age: data.age,
        bodyFatPercentage: data.bodyFatPercentage,
      },
      select: {
        id: true,
        name: true,
        weightInGrams: true,
        heightInCentimeters: true,
        age: true,
        bodyFatPercentage: true,
      },
    });

    return {
      userId: user.id,
      userName: user.name,
      weightInGrams: user.weightInGrams!,
      heightInCentimeters: user.heightInCentimeters!,
      age: user.age!,
      bodyFatPercentage: user.bodyFatPercentage!,
    };
  }
}
