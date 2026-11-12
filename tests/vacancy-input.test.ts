import { describe, expect, test } from "bun:test";
import {
  vacancyFilters,
  vacancyInput,
} from "../src/modules/vacancies/schemas/vacancy-input";

const valid = {
  id: "",
  occupation: "  Auxiliar  ",
  openings: "2",
  education: "",
  experience: "",
  notes: "",
  filled: false,
};

describe("cadastro de vagas", () => {
  test("normaliza ocupação e converte quantidade", () => {
    expect(vacancyInput.parse(valid)).toMatchObject({
      occupation: "Auxiliar",
      openings: 2,
    });
  });
  test.each(["0", "-1", "1.5", "1e2", "1000000000"])(
    "rejeita quantidade inválida %s",
    (openings) => {
      expect(vacancyInput.safeParse({ ...valid, openings }).success).toBe(
        false,
      );
    },
  );
  test("rejeita identificador inválido e ocupação em branco", () => {
    expect(vacancyInput.safeParse({ ...valid, id: "1" }).success).toBe(false);
    expect(vacancyInput.safeParse({ ...valid, occupation: "  " }).success).toBe(
      false,
    );
  });
  test("normaliza filtros enviados em formato inválido", () => {
    expect(
      vacancyFilters.parse({ q: ["a", "b"], status: "outro", page: "-1" }),
    ).toEqual({ q: "", status: "all", page: 1 });
  });
});
