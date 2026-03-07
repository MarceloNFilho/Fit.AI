"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startWorkoutAction } from "../_actions/start-workout";

interface StartWorkoutButtonProps {
  planId: string;
  dayId: string;
}

export function StartWorkoutButton({ planId, dayId }: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await startWorkoutAction(planId, dayId);
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full px-4 py-2 text-sm font-semibold font-inter-tight"
    >
      {isPending ? "Iniciando..." : "Iniciar Treino"}
    </Button>
  );
}
