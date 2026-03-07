"use client";

import { authClient } from "@/app/_lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="gap-2 text-base font-semibold text-destructive font-inter-tight hover:text-destructive"
    >
      Sair da conta
      <LogOut className="size-4 text-destructive" />
    </Button>
  );
}
