"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authClient } from "@/app/_lib/auth-client";

export const AuthButton = () => {
  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
    if (error) {
      console.error("Login error:", JSON.stringify(error, null, 2), error);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="bg-auth-surface text-auth-surface-text hover:bg-auth-surface/90 rounded-full px-6 h-[38px] gap-2 font-semibold text-sm border-transparent font-inter"
    >
      <div className="relative size-4 shrink-0">
        <Image src="/google-icon.svg" alt="Google" fill />
      </div>
      Fazer login com Google
    </Button>
  );
};
