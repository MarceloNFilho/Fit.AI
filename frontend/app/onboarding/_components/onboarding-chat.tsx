"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles, ArrowUp } from "lucide-react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const WELCOME_MESSAGES = [
  "Bem-vindo ao FIT.AI! \uD83C\uDF89",
  "O app que vai transformar a forma como voc\u00EA treina. Aqui voc\u00EA monta seu plano de treino personalizado, acompanha sua evolu\u00E7\u00E3o com estat\u00EDsticas detalhadas e conta com uma IA dispon\u00EDvel 24h para te guiar em cada exerc\u00EDcio.",
  "Tudo pensado para voc\u00EA alcan\u00E7ar seus objetivos de forma inteligente e consistente.",
  "Vamos configurar seu perfil?",
];

const chatFormSchema = z.object({
  message: z.string().min(1),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

export function OnboardingChat() {
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
  });

  const messageValue = useWatch({ control: form.control, name: "message" });

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = () => {
    setChatStarted(true);
    sendMessage({ text: "Começar!" });
  };

  const onSubmit = (values: ChatFormValues) => {
    if (!chatStarted) setChatStarted(true);
    sendMessage({ text: values.message });
    form.reset();
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex shrink-0 items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full border border-primary/8 bg-primary/8 p-3">
            <Sparkles className="size-[18px] text-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-inter-tight text-base font-semibold text-foreground">
              Coach AI
            </span>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-online" />
              <span className="font-inter-tight text-xs text-primary">
                Online
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" asChild className="rounded-full font-inter">
          <Link href="/">Acessar FIT.AI</Link>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pb-5">
        <div className="flex flex-col gap-3 pl-5 pr-[60px] pt-5">
          {WELCOME_MESSAGES.map((msg, index) => (
            <div key={index} className="rounded-xl bg-secondary p-3">
              <p className="font-inter-tight text-sm leading-relaxed text-foreground">
                {msg}
              </p>
            </div>
          ))}
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "assistant"
                ? "flex flex-col items-start pl-5 pr-[60px] pt-5"
                : "flex flex-col items-end pl-[60px] pr-5 pt-5"
            }
          >
            <div
              className={
                message.role === "assistant"
                  ? "rounded-xl bg-secondary p-3"
                  : "rounded-xl bg-primary p-3"
              }
            >
              {message.role === "assistant" ? (
                message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <Streamdown
                      key={index}
                      isAnimating={
                        isStreaming &&
                        messages[messages.length - 1]?.id === message.id
                      }
                      className="font-inter-tight text-sm leading-relaxed text-foreground"
                    >
                      {part.text}
                    </Streamdown>
                  ) : null,
                )
              ) : (
                <p className="font-inter-tight text-sm leading-relaxed text-primary-foreground">
                  {message.parts
                    .filter((part) => part.type === "text")
                    .map(
                      (part) => (part as { type: "text"; text: string }).text,
                    )
                    .join("")}
                </p>
              )}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="flex flex-col items-start pl-5 pr-[60px] pt-5">
            <div className="rounded-xl bg-secondary px-3 py-2.5">
              <div className="flex items-center gap-1">
                <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:0ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:300ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:600ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 border-t border-border p-5"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite sua mensagem"
                      className="rounded-full border-border bg-secondary px-4 py-3 font-inter-tight text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!messageValue.trim() || isLoading}
              size="icon"
              className="size-[42px] shrink-0 rounded-full"
            >
              <ArrowUp className="size-5" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
