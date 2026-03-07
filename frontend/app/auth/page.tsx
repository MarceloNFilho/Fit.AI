import Image from "next/image";

import { authClient } from "@/app/_lib/auth-client";
import { AuthButton } from "./_components/auth-button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AuthPage = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) {
    redirect("/");
  }

  return (
    <div className="relative h-dvh bg-auth-bg overflow-hidden">
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[402px] max-w-full bg-primary rounded-t-[20px] pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))] px-5 flex flex-col gap-[60px] items-center">
        <div className="flex flex-col gap-6 items-center w-full">
          <p className="text-[32px] leading-[1.05] font-semibold text-primary-foreground text-center w-full font-inter-tight">
            O app que vai transformar a forma como você treina.
          </p>
          <AuthButton />
        </div>
        <p className="text-[12px] leading-[1.4] text-primary-foreground/70 font-inter-tight text-center">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
