"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
    if (error) {
      console.error("Login error:", JSON.stringify(error, null, 2), error);
    }
  };

  if (isPending || session) return null;

  return (
    <div className="relative min-h-screen bg-auth-bg overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <Image
          alt=""
          src="/login-bg.png"
          fill
          className="object-contain object-center scale-150"
          priority
        />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[48px] w-[85px] h-[38px]">
        <Image src="/fit-ai-logo.svg" alt="FIT.AI" fill />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[402px] max-w-full bg-brand rounded-t-[20px] pt-12 pb-10 px-5 flex flex-col gap-[60px] items-center">
        <div className="flex flex-col gap-6 items-center w-full">
          <p className="text-[32px] leading-[1.05] font-semibold text-primary-foreground text-center w-full font-inter-tight">
            O app que vai transformar a forma como você treina.
          </p>
          <Button
            onClick={handleGoogleLogin}
            className="bg-auth-surface text-auth-surface-text hover:bg-auth-surface/90 rounded-full px-6 h-[38px] gap-2 font-semibold text-sm border-transparent font-inter"
          >
            <div className="relative size-4 shrink-0">
              <Image src="/google-icon.svg" alt="Google" fill />
            </div>
            Fazer login com Google
          </Button>
        </div>
        <p className="text-[12px] leading-[1.4] text-primary-foreground/70 font-inter-tight text-center">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
