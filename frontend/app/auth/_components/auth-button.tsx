"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/app/_lib/auth-client";

export const AuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
    if (error) {
      console.error("Login error:", JSON.stringify(error, null, 2), error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="bg-auth-surface text-auth-surface-text hover:bg-auth-surface/90 rounded-full px-6 h-[38px] gap-2 font-semibold text-sm border-transparent font-inter"
    >
      {isLoading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        <div className="relative size-4 shrink-0">
          <Image src="/google-icon.svg" alt="Google" fill />
        </div>
      )}
      Fazer login com Google
    </Button>
  );
};
