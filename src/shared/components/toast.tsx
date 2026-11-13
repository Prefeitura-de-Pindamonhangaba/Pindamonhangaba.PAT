"use client";

import { useState } from "react";

export function Toast({
  message,
  kind = "error",
  inDialog = false,
}: {
  message: string;
  kind?: "error" | "success";
  inDialog?: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={inDialog ? "toast toast-inline wide" : "toast"}>
      <p role={kind === "error" ? "alert" : "status"}>{message}</p>
      <button
        type="button"
        className="secondary"
        onClick={() => setDismissed(true)}
      >
        Fechar
      </button>
    </div>
  );
}
