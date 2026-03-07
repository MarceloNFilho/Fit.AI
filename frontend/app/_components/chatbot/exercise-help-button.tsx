"use client";

import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatParams } from "./use-chat-params";

interface ExerciseHelpButtonProps {
  exerciseName: string;
}

export function ExerciseHelpButton({ exerciseName }: ExerciseHelpButtonProps) {
  const { openChat } = useChatParams();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground"
      onClick={() =>
        openChat(`Como executar o exercício ${exerciseName} corretamente?`)
      }
    >
      <CircleHelp className="size-5" />
    </Button>
  );
}
