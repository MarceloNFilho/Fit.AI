import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { CreateWorkoutPlan } from "../../../application/usecases/CreateWorkoutPlan.js";
import { GetUserTrainData } from "../../../application/usecases/GetUserTrainData.js";
import { GetWorkoutPlans } from "../../../application/usecases/GetWorkoutPlans.js";
import { UpsertUserTrainData } from "../../../application/usecases/UpsertUserTrainData.js";
import { WeekDay } from "../../../domain/enums/WeekDay.js";
import { PrismaUserRepository } from "../../../infrastructure/database/repositories/PrismaUserRepository.js";
import { PrismaWorkoutPlanRepository } from "../../../infrastructure/database/repositories/PrismaWorkoutPlanRepository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const SYSTEM_PROMPT = `
Você é um personal trainer virtual especializado em montagem de planos de treino. Seu tom é amigável, motivador e sua linguagem é simples e acessível — sem jargões técnicos. Seu público principal são pessoas leigas em musculação.

## Fluxo obrigatório

1. **SEMPRE** chame a tool \`getUserTrainData\` antes de qualquer interação com o usuário.
2. Se o resultado for **null** (usuário sem dados cadastrados): em uma única mensagem, peça de forma simples e direta o nome, peso (kg), altura (cm), idade e percentual de gordura corporal. Após receber as respostas, salve com a tool \`updateUserTrainData\` — convertendo o peso de kg para gramas (multiplique por 1000).
3. Se o resultado **não for null** (usuário já tem dados): cumprimente-o pelo nome de forma motivadora.

## Criação de plano de treino

Quando o usuário quiser criar um plano de treino:
- Faça poucas perguntas, simples e diretas: objetivo principal, quantos dias por semana tem disponíveis e se há alguma restrição física ou lesão.
- O plano DEVE conter exatamente 7 dias (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY).
- Dias sem treino: \`isRestDay: true\`, \`exercises: []\`, \`estimatedDurationInSeconds: 0\`.
- Use a tool \`createWorkoutPlan\` para criar o plano.
- Nomes descritivos para cada dia (ex: "Superior A - Peito e Tríceps", "Inferior - Pernas", "Descanso").

## Divisões de treino recomendadas

Escolha a divisão com base nos dias disponíveis por semana:

- **2–3 dias**: Full Body ou ABC (A: Peito+Tríceps, B: Costas+Bíceps, C: Pernas+Ombros)
- **4 dias**: Upper/Lower (cada grupo 2x/semana) ou ABCD (A: Peito+Tríceps, B: Costas+Bíceps, C: Pernas, D: Ombros+Abdômen)
- **5 dias**: PPLUL — Push/Pull/Legs + Upper/Lower (superior 3x, inferior 2x/semana)
- **6 dias**: PPL 2x — Push/Pull/Legs repetido

## Princípios gerais de montagem

- Músculos sinérgicos juntos (peito+tríceps, costas+bíceps)
- Exercícios compostos primeiro, isoladores depois
- 4 a 8 exercícios por sessão
- 3–4 séries por exercício; 8–12 reps (hipertrofia) ou 4–6 reps (força)
- Descanso entre séries: 60–90s (hipertrofia), 2–3min (compostos pesados)
- Evitar treinar o mesmo grupo muscular em dias consecutivos

## Imagens de capa (coverImageUrl)

SEMPRE forneça um \`coverImageUrl\` para cada dia de treino. Escolha com base no foco muscular do dia:

**Dias majoritariamente superiores** (peito, costas, ombros, bíceps, tríceps, push, pull, upper, full body):
- \`https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCO3y8pQ6GBg8iqe9pP2JrHjwd1nfKtVSQskI0v\`
- \`https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCOW3fJmqZe4yoUcwvRPQa8kmFprzNiC30hqftL\`

**Dias majoritariamente inferiores** (pernas, glúteos, quadríceps, posterior, panturrilha, legs, lower):
- \`https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCOgCHaUgNGronCvXmSzAMs1N3KgLdE5yHT6Ykj\`
- \`https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCO85RVu3morROwZk5NPhs1jzH7X8TyEvLUCGxY\`

Alterne entre as duas opções de cada categoria para variar. Dias de descanso usam imagem de superior.

## Estilo de resposta

- Respostas curtas e objetivas.
- Nunca use jargões técnicos desnecessários.
- Seja encorajador e positivo.
`;

export const aiRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/ai",
    schema: {
      tags: ["AI"],
      summary: "Envia mensagens para o personal trainer virtual",
      body: z.object({
        messages: z.array(z.record(z.string(), z.unknown())),
      }),
    },
    handler: async (request, reply) => {
      const session = await authMiddleware(request, reply);
      if (!session) {
        return reply.status(401).send({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const messages = request.body.messages as unknown as UIMessage[];

      const result = streamText({
        model: openai("gpt-4o-mini"),
        system: SYSTEM_PROMPT,
        tools: {
          getUserTrainData: {
            description:
              "Recupera os dados de treino do usuário autenticado (peso, altura, idade, percentual de gordura e nome). Chame sempre antes de qualquer interação com o usuário.",
            inputSchema: z.object({}),
            execute: async () => {
              const userRepository = new PrismaUserRepository();
              const getUserTrainData = new GetUserTrainData(userRepository);
              return getUserTrainData.execute({ userId: session.user.id });
            },
          },
          updateUserTrainData: {
            description:
              "Cria ou atualiza os dados de treino do usuário autenticado. O peso deve ser fornecido em gramas (converta de kg multiplicando por 1000).",
            inputSchema: z.object({
              weightInGrams: z
                .number()
                .min(1)
                .describe("Peso do usuário em gramas (kg × 1000)"),
              heightInCentimeters: z
                .number()
                .min(1)
                .describe("Altura do usuário em centímetros"),
              age: z.number().min(1).describe("Idade do usuário em anos"),
              bodyFatPercentage: z
                .number()
                .min(0)
                .max(100)
                .describe("Percentual de gordura corporal do usuário (0–100)"),
            }),
            execute: async (input) => {
              const userRepository = new PrismaUserRepository();
              const upsertUserTrainData = new UpsertUserTrainData(
                userRepository,
              );
              return upsertUserTrainData.execute({
                userId: session.user.id,
                weightInGrams: input.weightInGrams,
                heightInCentimeters: input.heightInCentimeters,
                age: input.age,
                bodyFatPercentage: input.bodyFatPercentage,
              });
            },
          },
          getWorkoutPlans: {
            description:
              "Obtém os planos de treino para o usuário autenticado.",
            inputSchema: z.object({
              active: z
                .boolean()
                .optional()
                .describe("Filtrar por status ativo"),
            }),
            execute: async (input) => {
              const workoutPlanRepository = new PrismaWorkoutPlanRepository();
              const getWorkoutPlans = new GetWorkoutPlans(
                workoutPlanRepository,
              );
              return getWorkoutPlans.execute({
                userId: session.user.id,
                active: input.active,
              });
            },
          },
          createWorkoutPlan: {
            description:
              "Cria um novo plano de treino para o usuário autenticado. O plano deve conter exatamente 7 dias (de SEGUNDA a DOMINGO). Dias de descanso devem ter isRestDay: true, exercises: [] e estimatedDurationInSeconds: 0.",
            inputSchema: z.object({
              name: z
                .string()
                .trim()
                .min(1)
                .describe("Nome do plano de treino"),
              workoutDays: z.array(
                z.object({
                  name: z
                    .string()
                    .trim()
                    .min(1)
                    .describe("Nome descritivo do dia de treino"),
                  weekDay: z.enum(WeekDay).describe("Dia da semana"),
                  isRestDay: z
                    .boolean()
                    .default(false)
                    .describe("Se este é um dia de descanso"),
                  estimatedDurationInSeconds: z
                    .number()
                    .min(0)
                    .describe(
                      "Duração estimada em segundos (0 para dias de descanso)",
                    ),
                  coverImageUrl: z
                    .string()
                    .url()
                    .nullish()
                    .describe("URL da imagem de capa do dia de treino"),
                  exercises: z
                    .array(
                      z.object({
                        name: z
                          .string()
                          .trim()
                          .min(1)
                          .describe("Nome do exercício"),
                        order: z
                          .number()
                          .min(0)
                          .describe("Ordem do exercício na sessão"),
                        sets: z.number().min(1).describe("Número de séries"),
                        reps: z
                          .number()
                          .min(1)
                          .describe("Número de repetições"),
                        restTimeInSeconds: z
                          .number()
                          .min(0)
                          .describe(
                            "Tempo de descanso entre séries em segundos",
                          ),
                      }),
                    )
                    .describe(
                      "Lista de exercícios (vazia para dias de descanso)",
                    ),
                }),
              ),
            }),
            execute: async (input) => {
              const workoutPlanRepository = new PrismaWorkoutPlanRepository();
              const createWorkoutPlan = new CreateWorkoutPlan(
                workoutPlanRepository,
              );
              return createWorkoutPlan.execute({
                userId: session.user.id,
                name: input.name,
                workoutDays: input.workoutDays,
              });
            },
          },
        },
        stopWhen: stepCountIs(5),
        messages: await convertToModelMessages(messages),
      });

      return result.toUIMessageStreamResponse() as unknown;
    },
  });
};
