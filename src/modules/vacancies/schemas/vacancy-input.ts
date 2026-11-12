import { z } from "zod";

export const vacancyInput = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  occupation: z.string().trim().min(1).max(200),
  openings: z
    .string()
    .regex(/^\d{1,9}$/)
    .transform(Number)
    .pipe(z.number().int().positive()),
  education: z.string().trim().max(200),
  experience: z.string().trim().max(200),
  notes: z.string().trim().max(1000),
  filled: z.boolean(),
});

export const vacancyFilters = z.object({
  q: z.string().trim().max(100).catch(""),
  status: z.enum(["all", "open", "filled"]).catch("all"),
  page: z.coerce.number().int().min(1).max(100000).catch(1),
});

export type VacancyInput = z.output<typeof vacancyInput>;
export type VacancyFilters = z.output<typeof vacancyFilters>;
