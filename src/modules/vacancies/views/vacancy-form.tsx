"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Vacancy } from "../models/vacancy-schema";

type FormAction = (previous: string, data: FormData) => Promise<string>;

export function VacancyForm({
  vacancy,
  closeHref,
  save,
  remove,
}: {
  vacancy?: Vacancy;
  closeHref: string;
  save: FormAction;
  remove: FormAction;
}) {
  const [saveError, saveAction, saving] = useActionState(save, "");
  const [deleteError, deleteAction, deleting] = useActionState(remove, "");
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function close() {
    if (!saving && !deleting) router.replace(closeHref, { scroll: false });
  }

  return (
    <dialog
      className="vacancy-dialog"
      ref={dialog}
      aria-labelledby="vacancy-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <h2 id="vacancy-dialog-title">{vacancy ? "Editar vaga" : "Nova vaga"}</h2>
      <form action={saveAction} className="editor">
        <input type="hidden" name="id" value={vacancy?.id ?? ""} />
        <label>
          Ocupação
          <input
            name="occupation"
            required
            maxLength={200}
            defaultValue={vacancy?.occupation}
          />
        </label>
        <label>
          Quantidade
          <input
            type="number"
            name="openings"
            required
            min={1}
            max={999999999}
            defaultValue={vacancy?.openings ?? 1}
          />
        </label>
        <label>
          Escolaridade
          <input
            name="education"
            maxLength={200}
            defaultValue={vacancy?.education}
          />
        </label>
        <label>
          Experiência
          <input
            name="experience"
            maxLength={200}
            defaultValue={vacancy?.experience}
          />
        </label>
        <label className="wide">
          Observações
          <textarea
            name="notes"
            rows={3}
            maxLength={1000}
            defaultValue={vacancy?.notes}
          />
        </label>
        <label className="check wide">
          <input
            type="checkbox"
            name="filled"
            defaultChecked={vacancy?.filled}
          />{" "}
          Vaga preenchida
        </label>
        {saveError && (
          <p className="notice wide" role="alert">
            {saveError}
          </p>
        )}
        <div className="actions wide">
          <button disabled={saving}>
            {saving ? "Salvando…" : "Salvar vaga"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={close}
            disabled={saving || deleting}
          >
            Cancelar
          </button>
        </div>
      </form>
      {vacancy && (
        <details className="delete">
          <summary>Excluir vaga</summary>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={vacancy.id} />
            <label className="check">
              <input name="confirm" type="checkbox" required /> Confirmo a
              exclusão desta vaga.
            </label>
            {deleteError && <p role="alert">{deleteError}</p>}
            <button className="danger" disabled={deleting}>
              Excluir definitivamente
            </button>
          </form>
        </details>
      )}
    </dialog>
  );
}
