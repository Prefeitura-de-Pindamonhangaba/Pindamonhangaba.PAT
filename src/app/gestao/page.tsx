import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { devAuthBypassEnabled, managementEnabled } from "@/shared/lib/env";
import { managementPage } from "@/modules/vacancies/controllers/vacancy-controller";
import { VacancyForm } from "@/modules/vacancies/views/vacancy-form";
import { VacancyList } from "@/modules/vacancies/views/vacancy-list";
import { removeVacancy, saveVacancy } from "./actions";
import { signOut } from "./auth-actions";
import { currentEditor } from "@/modules/auth/controllers/auth-controller";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gestão de vagas" };

export default async function Management({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!managementEnabled()) notFound();
  if (!(await currentEditor())) {
    if ((await cookies()).has("pat_session")) redirect("/auth/entrar");
    return (
      <div className="container content">
        <section className="hero hero-inner">
          <div>
            <h1>Gestão de vagas</h1>
            <p>
              Entre com sua conta institucional para gerenciar as vagas do PAT.
            </p>
          </div>
          <a className="button hero-action" href="/auth/entrar">
            Entrar com Keycloak
          </a>
        </section>
      </div>
    );
  }
  const query = await searchParams;
  const data = await managementPage(query);
  const params = new URLSearchParams();
  if (data.filters.q) params.set("q", data.filters.q);
  if (data.filters.status !== "all") params.set("status", data.filters.status);
  if (data.filters.page > 1) params.set("page", String(data.filters.page));
  const listHref = params.size ? "/gestao?" + params : "/gestao";
  const result = query.resultado;
  const message =
    result === "salva"
      ? "Vaga salva."
      : result === "excluida"
        ? "Vaga excluída."
        : "";
  return (
    <div className="container content">
      <div className="heading hero hero-inner">
        <div>
          <Link href="/">Voltar à lista pública</Link>
          <h1>Gestão de vagas</h1>
        </div>
        {devAuthBypassEnabled() ? (
          <p>Acesso local de desenvolvimento</p>
        ) : (
          <form action={signOut}>
            <button className="secondary">Sair</button>
          </form>
        )}
      </div>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {data.missing && (
        <p className="notice" role="alert">
          Vaga não encontrada. <Link href={listHref}>Voltar à gestão</Link>
        </p>
      )}
      <VacancyList {...data} management />
      {!data.missing && (data.editing || query.nova === "1") && (
        <VacancyForm
          key={data.editing?.id ?? "new"}
          vacancy={data.editing}
          closeHref={listHref}
          save={saveVacancy}
          remove={removeVacancy}
        />
      )}
    </div>
  );
}
