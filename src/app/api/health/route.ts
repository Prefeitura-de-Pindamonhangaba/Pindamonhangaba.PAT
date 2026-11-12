import { readPublicationDate } from "@/modules/vacancies/controllers/vacancy-controller";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await readPublicationDate();
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "indisponível" }, { status: 503 });
  }
}
