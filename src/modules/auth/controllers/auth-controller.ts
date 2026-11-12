import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { devAuthBypassEnabled, getEnv } from "@/shared/lib/env";
import {
  endSession,
  finishLogin,
  getEditor,
  loginFlow,
  startLogin,
} from "../services/auth-service";

const SESSION = "pat_session";
const FLOW = "pat_oidc";
function cookieOptions() {
  return {
    httpOnly: true,
    secure: getEnv().APP_URL.protocol === "https:",
    sameSite: "lax" as const,
    path: "/",
  };
}

function loginError() {
  return NextResponse.redirect(
    new URL("/?acesso=indisponivel", getEnv().APP_URL),
  );
}

export async function login() {
  if (!getEnv().KEYCLOAK_ENABLED) return loginError();
  try {
    const { url, flow } = await startLogin();
    const response = NextResponse.redirect(url);
    response.cookies.set(FLOW, JSON.stringify(flow), {
      ...cookieOptions(),
      maxAge: 600,
    });
    return response;
  } catch {
    console.error("Falha ao iniciar o login institucional do PAT.");
    return loginError();
  }
}

export async function callback(request: NextRequest) {
  let response = loginError();
  try {
    const flow = loginFlow.parse(
      JSON.parse(request.cookies.get(FLOW)?.value ?? "null"),
    );
    const session = await finishLogin(request.nextUrl.search, flow);
    if (session) {
      response = NextResponse.redirect(new URL("/gestao", getEnv().APP_URL));
      response.cookies.set(SESSION, session.token, {
        ...cookieOptions(),
        expires: session.expiresAt,
      });
    }
  } catch {
    console.error("Falha ao concluir o login institucional do PAT.");
  }
  response.cookies.set(FLOW, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}

export async function currentEditor() {
  if (devAuthBypassEnabled()) return { subject: "local-development" };
  return getEditor((await cookies()).get(SESSION)?.value);
}

export async function requireEditor() {
  const editor = await currentEditor();
  if (!editor) redirect("/");
  return editor;
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION)?.value;
  const url = await endSession(token).catch(() => {
    console.error("Falha ao finalizar a sessão institucional do PAT.");
    return new URL("/?acesso=saida", getEnv().APP_URL);
  });
  jar.set(SESSION, "", { ...cookieOptions(), maxAge: 0 });
  redirect(url.href);
}
