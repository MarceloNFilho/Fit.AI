export interface WorkoutExercise {
  id: string;
  name: string;
  order: number;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
  workoutDayId: string;
  createdAt: Date;
  updatedAt: Date;
}
