"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { completeWorkoutAction } from "../_actions/complete-workout";

interface CompleteWorkoutButtonProps {
  planId: string;
  dayId: string;
  sessionId: string;
}

export function CompleteWorkoutButton({
  planId,
  dayId,
  sessionId,
}: CompleteWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await completeWorkoutAction(planId, dayId, sessionId);
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
      className="w-full rounded-full py-3 text-sm font-semibold text-foreground font-inter-tight"
    >
      {isPending ? "Concluindo..." : "Marcar como concluído"}
    </Button>
  );
}
