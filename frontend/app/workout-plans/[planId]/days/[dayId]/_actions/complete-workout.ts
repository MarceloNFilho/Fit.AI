"use server";

import { updateWorkoutSession } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export async function completeWorkoutAction(
  planId: string,
  dayId: string,
  sessionId: string,
) {
  await updateWorkoutSession(planId, dayId, sessionId, {
    completedAt: dayjs().toISOString(),
  });
  revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
}
