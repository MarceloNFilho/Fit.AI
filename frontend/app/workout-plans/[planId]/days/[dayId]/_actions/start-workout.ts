"use server";

import { startWorkoutSession } from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function startWorkoutAction(planId: string, dayId: string) {
  await startWorkoutSession(planId, dayId);
  revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
}
