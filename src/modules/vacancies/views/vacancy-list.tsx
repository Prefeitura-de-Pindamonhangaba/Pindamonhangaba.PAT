import Link from "next/link";
import type { Vacancy } from "../models/vacancy-schema";
import type { VacancyFilters } from "../schemas/vacancy-input";

type Props = {
  rows: Vacancy[];
  filters: VacancyFilters;
  hasNext: boolean;
  unavailable: boolean;
  management?: boolean;
};

export function VacancyList({
  rows,
  filters,
  hasNext,
  unavailable,
  management = false,
}: Props) {
  const path = management ? "/gestao" : "/";
  function pageUrl(
    page: number,
    action?: { nova: string } | { editar: string },
  ) {
    return (
      path +
      "?" +
      new URLSearchParams({
        q: filters.q,
        status: filters.status,
        page: String(page),
        ...action,
      })
    );
  }
  return (
    <section aria-labelledby="vagas-titulo">
      <div className="list-heading">
        <h2 id="vagas-titulo">
          {management ? "Vagas cadastradas" : "Lista de vagas"}
        </h2>
        {management && !unavailable && (
          <Link
            className="button"
            scroll={false}
            href={pageUrl(filters.page, { nova: "1" })}
          >
            Nova vaga
          </Link>
        )}
      </div>
      <form className="filters" action={path}>
        <label>
          Buscar vaga
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            maxLength={100}
            placeholder="Ocupação, escolaridade ou experiência"
          />
        </label>
        <label>
          Situação
          <select name="status" defaultValue={filters.status}>
            <option value="all">Todas</option>
            <option value="open">Disponíveis</option>
            <option value="filled">Preenchidas</option>
          </select>
        </label>
        <button type="submit">Buscar</button>
      </form>
      {unavailable ? (
        <p role="alert" className="notice">
          A lista está temporariamente indisponível. Tente novamente mais tarde.
        </p>
      ) : rows.length ? (
        <div
          className="table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Tabela de vagas"
        >
          <table>
            <thead>
              <tr>
                {[
                  "Ocupação",
                  "Vagas",
                  "Escolaridade",
                  "Experiência",
                  "Observações",
                  "Situação",
                ].map((label) => (
                  <th key={label} scope="col">
                    {label}
                  </th>
                ))}
                {management && <th scope="col">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.occupation}</th>
                  <td>{row.openings}</td>
                  <td>{row.education || "—"}</td>
                  <td>{row.experience || "—"}</td>
                  <td>{row.notes || "—"}</td>
                  <td>
                    <span className={row.filled ? "status" : "status open"}>
                      {row.filled ? "Preenchida" : "Disponível"}
                    </span>
                  </td>
                  {management && (
                    <td>
                      <Link
                        className="button secondary"
                        scroll={false}
                        href={pageUrl(filters.page, { editar: row.id })}
                        aria-label={"Editar " + row.occupation}
                      >
                        Editar
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="notice">Nenhuma vaga encontrada.</p>
      )}
      {!unavailable && (hasNext || filters.page > 1) && (
        <nav className="pagination" aria-label="Paginação das vagas">
          {filters.page > 1 && (
            <Link href={pageUrl(filters.page - 1)}>Anterior</Link>
          )}
          <span>Página {filters.page}</span>
          {hasNext && <Link href={pageUrl(filters.page + 1)}>Próxima</Link>}
        </nav>
      )}
    </section>
  );
}
