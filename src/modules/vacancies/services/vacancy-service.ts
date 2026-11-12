import * as repository from "../repositories/vacancy-repository";
import type { VacancyFilters } from "../schemas/vacancy-input";

export const {
  findVacancy,
  saveVacancy,
  deleteVacancy,
  updatePublicationDate,
} = repository;

export async function getVacancyPage(filters: VacancyFilters) {
  const pageSize = 20;
  const [rows, updatedAt] = await Promise.all([
    repository.listVacancies(filters, pageSize),
    repository.readPublicationDate(),
  ]);
  return {
    rows: rows.slice(0, pageSize),
    updatedAt,
    hasNext: rows.length > pageSize,
  };
}
export const { readPublicationDate } = repository;
