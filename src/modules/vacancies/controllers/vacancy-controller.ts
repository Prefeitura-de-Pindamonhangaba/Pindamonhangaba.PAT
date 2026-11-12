import { redirect } from "next/navigation";
import { z } from "zod";
import { requireEditor } from "@/modules/auth/controllers/auth-controller";
import { vacancyFilters, vacancyInput } from "../schemas/vacancy-input";
import * as service from "../services/vacancy-service";

type Query = Record<string, string | string[] | undefined>;

export async function publicVacancies(query: Query) {
  const filters = vacancyFilters.parse(query);
  try {
    return {
      filters,
      ...(await service.getVacancyPage(filters)),
      unavailable: false,
    };
  } catch {
    console.error("Falha ao consultar a lista pública de vagas.");
    return {
      filters,
      rows: [],
      updatedAt: undefined,
      hasNext: false,
      unavailable: true,
    };
  }
}

export async function managementPage(query: Query) {
  await requireEditor();
  const id = z.uuid().safeParse(query.editar);
  const listing = await publicVacancies(query);
  const editing = id.success ? await service.findVacancy(id.data) : undefined;
  return {
    ...listing,
    editing,
    missing: query.editar !== undefined && !editing,
  };
}

export async function save(form: FormData) {
  const editor = await requireEditor();
  const input = vacancyInput.safeParse({
    id: form.get("id"),
    occupation: form.get("occupation"),
    openings: form.get("openings"),
    education: form.get("education"),
    experience: form.get("experience"),
    notes: form.get("notes"),
    filled: form.get("filled") === "on",
  });
  if (!input.success) return "Confira os campos e a quantidade de vagas.";
  try {
    const row = await service.saveVacancy(input.data);
    if (!row) return "Esta vaga não está mais disponível para edição.";
    console.info(
      JSON.stringify({
        event: "vacancy.saved",
        subject: editor.subject,
        vacancyId: row.id,
      }),
    );
  } catch {
    console.error("Falha ao gravar vaga.");
    return "Não foi possível salvar a vaga. Tente novamente.";
  }
  redirect("/gestao?resultado=salva");
}

export async function remove(form: FormData) {
  const editor = await requireEditor();
  const id = z.uuid().safeParse(form.get("id"));
  if (!id.success || form.get("confirm") !== "on")
    return "Confirme a exclusão para continuar.";
  try {
    if (await service.deleteVacancy(id.data)) {
      console.info(
        JSON.stringify({
          event: "vacancy.deleted",
          subject: editor.subject,
          vacancyId: id.data,
        }),
      );
    }
  } catch {
    console.error("Falha ao excluir vaga.");
    return "Não foi possível excluir a vaga. Tente novamente.";
  }
  redirect("/gestao?resultado=excluida");
}

export const { readPublicationDate } = service;
