import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"), // TODO: do we need this?
    APP: z.enum(["website", "queue-processor", "script"]), // assert env.APP for correct types
    DOCKER_REGISTRY: z
      .string()
      .optional()
      .transform((v) => (v ? v + "/" : "")),
    WORKING_DIR: z.string().default("/tmp/easyshell"),

    ...(process.env.APP === "queue-processor"
      ? {
          DATABASE_URL: z.string().url(),
        }
      : {}),

    ...(process.env.APP === "website"
      ? {
          DATABASE_URL: z.string().url(),

          NEXTAUTH_SECRET: z.string(),
          NEXTAUTH_URL: z.string().url(),

          DISCORD_CLIENT_ID: z.string(),
          DISCORD_CLIENT_SECRET: z.string(),

          GITHUB_CLIENT_ID: z.string(),
          GITHUB_CLIENT_SECRET: z.string(),

          GOOGLE_CLIENT_ID: z.string(),
          GOOGLE_CLIENT_SECRET: z.string(),

          SESSION_MANAGER_URL: z.string().url(),
        }
      : {}),

    ...(process.env.APP === "script"
      ? {
          PARALLEL_LIMIT_BUILD: z
            .string()
            .optional()
            .transform((v) => (v ? parseInt(v) : 5)),
          PARALLEL_LIMIT_PUSH: z
            .string()
            .optional()
            .transform((v) => (v ? parseInt(v) : 5)),
          PARALLEL_LIMIT_TEST: z
            .string()
            .optional()
            .transform((v) => (v ? parseInt(v) : 5)),
        }
      : {}),
  },

  clientPrefix: "NEXT_PUBLIC_",
  client: {},

  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
