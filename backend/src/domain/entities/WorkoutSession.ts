export interface WorkoutSession {
  id: string;
  workoutDayId: string;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
