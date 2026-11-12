import { and, asc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/shared/lib/db/client";
import { publication, vacancies } from "../models/vacancy-schema";
import type { VacancyFilters, VacancyInput } from "../schemas/vacancy-input";

export async function listVacancies(filters: VacancyFilters, pageSize: number) {
  const term = "%" + filters.q.replace(/[\\%_]/g, "\\$&") + "%";
  return db()
    .select()
    .from(vacancies)
    .where(
      and(
        filters.status === "all"
          ? undefined
          : eq(vacancies.filled, filters.status === "filled"),
        filters.q
          ? or(
              ilike(vacancies.occupation, term),
              ilike(vacancies.education, term),
              ilike(vacancies.experience, term),
              ilike(vacancies.notes, term),
            )
          : undefined,
      ),
    )
    .orderBy(asc(vacancies.occupation), asc(vacancies.id))
    .limit(pageSize + 1)
    .offset((filters.page - 1) * pageSize);
}

export async function findVacancy(id: string) {
  const [vacancy] = await db()
    .select()
    .from(vacancies)
    .where(eq(vacancies.id, id));
  return vacancy;
}

export async function saveVacancy({ id, ...fields }: VacancyInput) {
  const rows = id
    ? await db()
        .update(vacancies)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(vacancies.id, id))
        .returning({ id: vacancies.id })
    : await db()
        .insert(vacancies)
        .values(fields)
        .returning({ id: vacancies.id });
  return rows[0];
}

export async function deleteVacancy(id: string) {
  const rows = await db()
    .delete(vacancies)
    .where(eq(vacancies.id, id))
    .returning({ id: vacancies.id });
  return rows.length > 0;
}

export async function readPublicationDate() {
  const [row] = await db()
    .select()
    .from(publication)
    .where(eq(publication.id, 1));
  return row?.updatedAt;
}
