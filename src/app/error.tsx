"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container content">
      <h1>Não foi possível carregar a página</h1>
      <div className="actions">
        <button onClick={reset}>Tentar novamente</button>
        <Link href="/">Voltar à lista pública</Link>
      </div>
    </section>
  );
}
