import Link from "next/link";
import { managementEnabled } from "@/shared/lib/env";
import { publicVacancies } from "@/modules/vacancies/controllers/vacancy-controller";
import { PublicationDate } from "@/modules/vacancies/views/publication-date";
import { VacancyList } from "@/modules/vacancies/views/vacancy-list";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const data = await publicVacancies(query);
  const enabled = managementEnabled();
  return (
    <>
      <div className="container content">
        <section className="hero hero-inner" aria-labelledby="page-title">
          <div>
            <h1 id="page-title">
              Vagas de emprego<span aria-hidden="true">.</span>
            </h1>
            <p>
              Consulte as oportunidades divulgadas pelo PAT de Pindamonhangaba.
            </p>
          </div>
          {enabled && (
            <Link className="button hero-action" href="/gestao">
              Área de gestão
            </Link>
          )}
        </section>
        {query.acesso === "indisponivel" && (
          <p className="notice" role="alert">
            O acesso institucional não pôde ser concluído. Verifique sua
            permissão e tente novamente.
          </p>
        )}
        {query.acesso === "saida" && (
          <p className="notice" role="alert">
            A sessão do navegador foi encerrada. Não foi possível confirmar a
            saída no Keycloak.
          </p>
        )}
        <PublicationDate date={data.updatedAt} />
        <VacancyList {...data} />
      </div>
    </>
  );
}
