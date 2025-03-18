import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    APP: z.enum(["website", "queue-processor", "script"]), // assert env.APP for correct types

    WORKING_DIR: z.string().default("/tmp/easyshell"),

    ...(process.env.APP === "queue-processor"
      ? {
          DATABASE_URL: z.string().url(),
          DOCKER_REGISTRY: z.string(),
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
  },

  clientPrefix: "NEXT_PUBLIC_",
  client: {},

  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
