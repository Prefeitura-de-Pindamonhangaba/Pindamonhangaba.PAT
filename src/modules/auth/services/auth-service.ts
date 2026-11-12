import "server-only";
import { createHash } from "node:crypto";
import * as oidc from "openid-client";
import { z } from "zod";
import { getEnv } from "@/shared/lib/env";
import * as sessions from "../repositories/session-repository";

const ADMIN_ROLE = "pat-editor";
let configuration: Promise<oidc.Configuration> | undefined;

function provider() {
  const env = getEnv();
  if (
    !env.KEYCLOAK_ENABLED ||
    !env.KEYCLOAK_CLIENT_ID ||
    !env.KEYCLOAK_CLIENT_SECRET
  ) {
    throw new Error("Acesso institucional desabilitado.");
  }
  configuration ??= oidc
    .discovery(
      new URL(env.KEYCLOAK_ISSUER),
      env.KEYCLOAK_CLIENT_ID,
      env.KEYCLOAK_CLIENT_SECRET,
      undefined,
      {
        execute: [oidc.enableNonRepudiationChecks],
        timeout: 8,
      },
    )
    .catch((error) => {
      configuration = undefined;
      throw error;
    });
  return configuration;
}

export const loginFlow = z.object({
  verifier: z.string().min(43).max(128),
  state: z.string().min(1).max(128),
  nonce: z.string().min(1).max(128),
});

function callbackUrl() {
  return new URL("/auth/retorno", getEnv().APP_URL).href;
}

export async function startLogin() {
  const config = await provider();
  const verifier = oidc.randomPKCECodeVerifier();
  const state = oidc.randomState();
  const nonce = oidc.randomNonce();
  const url = oidc.buildAuthorizationUrl(config, {
    redirect_uri: callbackUrl(),
    response_type: "code",
    scope: "openid",
    code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
    code_challenge_method: "S256",
    state,
    nonce,
  });
  return { url, flow: { verifier, state, nonce } };
}

function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function finishLogin(
  query: string,
  flow: z.infer<typeof loginFlow>,
) {
  const tokens = await oidc.authorizationCodeGrant(
    await provider(),
    new URL(callbackUrl() + query),
    {
      pkceCodeVerifier: flow.verifier,
      expectedState: flow.state,
      expectedNonce: flow.nonce,
      idTokenExpected: true,
    },
  );
  const claims = tokens.claims();
  const roles = z.array(z.string()).safeParse(claims?.pat_roles);
  if (!claims?.sub || !roles.success || !roles.data.includes(ADMIN_ROLE))
    return null;
  const expiresAt = new Date(
    Math.min(claims.exp * 1000, Date.now() + 8 * 60 * 60 * 1000),
  );
  if (expiresAt <= new Date()) return null;
  const token = oidc.randomState();
  await sessions.createSession({
    digest: digest(token),
    subject: claims.sub,
    expiresAt,
  });
  return { token, expiresAt };
}

export async function getEditor(token?: string) {
  if (!getEnv().KEYCLOAK_ENABLED || !token) return undefined;
  return sessions.findSession(digest(token));
}

export async function endSession(token?: string) {
  if (token) await sessions.revokeSession(digest(token));
  if (!getEnv().KEYCLOAK_ENABLED) return getEnv().APP_URL;
  return oidc.buildEndSessionUrl(await provider(), {
    client_id: getEnv().KEYCLOAK_CLIENT_ID!,
    post_logout_redirect_uri: getEnv().APP_URL.href,
  });
}
