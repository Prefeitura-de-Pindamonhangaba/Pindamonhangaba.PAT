"use server";

import {
  publish,
  remove,
  save,
} from "@/modules/vacancies/controllers/vacancy-controller";

export async function saveVacancy(_previous: string, form: FormData) {
  return save(form);
}

export async function removeVacancy(_previous: string, form: FormData) {
  return remove(form);
}

export async function publishVacancies() {
  return publish();
}
