import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PAT Pindamonhangaba",
    template: "%s | PAT Pindamonhangaba",
  },
  description:
    "Consulte as vagas do Posto de Atendimento ao Trabalhador de Pindamonhangaba.",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip" href="#conteudo">
          Ir para o conteúdo
        </a>
        <header className="masthead">
          <div className="institutional-ribbon">
            <div className="container">Prefeitura de Pindamonhangaba</div>
          </div>
          <div className="container masthead-inner">
            <Link
              className="brand"
              href="/"
              aria-label="PAT Pindamonhangaba — início"
            >
              <Image
                src="/brand/prefeitura-pindamonhangaba.svg"
                alt="Prefeitura de Pindamonhangaba"
                width={280}
                height={118}
                priority
                unoptimized
              />
            </Link>
            <div className="institutional-department">
              <strong>Posto de Atendimento ao Trabalhador</strong>
              <span>PAT Pindamonhangaba</span>
            </div>
          </div>
        </header>
        <main id="conteudo">{children}</main>
        <footer>
          <div className="container footer-content">
            <strong>
              PAT Pindamonhangaba<span aria-hidden="true">.</span>
            </strong>
            <span>Prefeitura de Pindamonhangaba</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
