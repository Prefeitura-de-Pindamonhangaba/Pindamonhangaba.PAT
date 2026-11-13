import { z } from "zod";

const ISSUER = "https://sso.pindamonhangaba.sp.gov.br/realms/pindamonhangaba";
const LOOPBACK = ["localhost", "127.0.0.1", "[::1]"];
const schema = z
  .object({
    DEV_SKIP_AUTH: z.enum(["true", "false"]).default("false"),
    ALLOW_LOCAL_HTTP: z.enum(["true", "false"]).default("false"),
    APP_URL: z
      .url()
      .transform((value) => new URL(value))
      .refine(
        (url) =>
          !url.username &&
          !url.password &&
          url.pathname === "/" &&
          !url.search &&
          !url.hash &&
          (url.protocol === "https:" ||
            (url.protocol === "http:" && LOOPBACK.includes(url.hostname))),
        "Informe uma origem HTTPS ou HTTP em loopback.",
      ),
    DATABASE_URL: z
      .url()
      .refine((value) => /^postgres(?:ql)?:\/\//.test(value)),
    KEYCLOAK_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    KEYCLOAK_ISSUER: z.literal(ISSUER).default(ISSUER),
    KEYCLOAK_CLIENT_ID: z.string().optional(),
    KEYCLOAK_CLIENT_SECRET: z.string().optional(),
  })
  .superRefine((env, context) => {
    if (env.APP_URL.protocol === "http:" && env.ALLOW_LOCAL_HTTP !== "true") {
      context.addIssue({
        code: "custom",
        path: ["APP_URL"],
        message: "HTTPS obrigatório.",
      });
    }
    if (!env.KEYCLOAK_ENABLED) return;
    for (const field of [
      "KEYCLOAK_CLIENT_ID",
      "KEYCLOAK_CLIENT_SECRET",
    ] as const) {
      if (!env[field]?.trim())
        context.addIssue({
          code: "custom",
          path: [field],
          message: "Obrigatório para o Keycloak.",
        });
    }
  });

let configuration: z.infer<typeof schema> | undefined;
export function getEnv() {
  if (configuration) return configuration;
  const result = schema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      "Configuração inválida: " +
        result.error.issues.map((issue) => issue.path.join(".")).join(", "),
    );
  }
  return (configuration = result.data);
}

export function devAuthBypassEnabled() {
  if (process.env.NODE_ENV !== "development") return false;
  const env = getEnv();
  return (
    env.DEV_SKIP_AUTH === "true" &&
    LOOPBACK.includes(env.APP_URL.hostname) &&
    LOOPBACK.includes(new URL(env.DATABASE_URL).hostname)
  );
}

export function managementEnabled() {
  return getEnv().KEYCLOAK_ENABLED || devAuthBypassEnabled();
}
