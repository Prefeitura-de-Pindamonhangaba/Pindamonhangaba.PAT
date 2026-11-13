# PAT Pindamonhangaba

O Posto de Atendimento ao Trabalhador publica vagas de emprego para consulta sem cadastro. A equipe do PAT pode cadastrar, editar, sinalizar vagas preenchidas, e excluir registros. A data exibida na lista pública acompanha a última alteração das vagas.

O projeto utiliza Next.js App Router, TypeScript strict, Bun, PostgreSQL, Drizzle ORM, Zod e Keycloak institucional. A organização segue MVC modular em `src/modules`, com roteamento em `src/app` e infraestrutura em `src/shared`.

## Desenvolvimento local

1. Instale Bun e PostgreSQL ou use o Docker Compose conforme as instruções abaixo.
2. Copie `.env.example` para `.env`. Configure `DATABASE_URL` com um banco PostgreSQL exclusivo para o PAT.
3. Execute:

   ```sh
   bun install --frozen-lockfile
   bun run db:migrate
   bun run dev
   ```

Abra http://localhost:3000. O banco recém-migrado começa vazio. Para cadastrar vagas pela interface, habilite o acesso institucional.

## Acesso institucional

Para testar a gestão sem Keycloak, configure `DEV_SKIP_AUTH=true` no `.env`
com `APP_URL` e `DATABASE_URL` em loopback e execute
`bun run dev --hostname 127.0.0.1`. A flag só tem efeito no modo de
desenvolvimento do Next.js. Abra `/gestao` para testar com um banco local.

No Keycloak, use o realm `pindamonhangaba` e configure um client OIDC confidencial exclusivo para o PAT, com Standard Flow e PKCE S256. Desabilite Direct Access Grants. Cadastre a URL de retorno `<APP_URL>/auth/retorno` e a URL pós-logout `<APP_URL>/` com a origem exata do ambiente.

Crie o papel de client `pat-editor` e atribua-o à equipe autorizada. Configure um mapper **User Client Role** para o próprio client, com a claim multivalorada `pat_roles` no **ID token**. As sessões locais expiram no vencimento do ID token ou em até oito horas. Para acesso continuado, entre novamente.

Defina `KEYCLOAK_ENABLED=true`, `KEYCLOAK_CLIENT_ID` e `KEYCLOAK_CLIENT_SECRET` no ambiente. Com a integração desligada, apenas a consulta pública fica disponível.

## Docker Compose

Em desenvolvimento, mantenha `COMPOSE_PROFILES=development` e configure `POSTGRES_USER`, `POSTGRES_DB` e `POSTGRES_PASSWORD`. Use caracteres seguros para URL nesses campos.

Antes da primeira subida, preencha `POSTGRES_PASSWORD` no `.env`. No PowerShell 7, este comando gera uma senha que pode ser usada na URL de conexão:

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```

Se o PostgreSQL reportar `superuser password is not specified`, preencha a senha e repita os comandos abaixo.

```sh
docker compose up -d --wait postgres
docker compose build app-dev
```

Para aplicar a migração, use o serviço de tarefa com o banco de desenvolvimento já iniciado:

```sh
docker compose --profile maintenance run --build --rm migrate-dev
docker compose up -d --wait app-dev
```

Em produção, configure `COMPOSE_PROFILES=production`, `APP_URL` HTTPS, `DATABASE_URL` do PostgreSQL institucional e o client Keycloak do ambiente. O proxy deve encaminhar a origem pública e o protocolo HTTPS. `APP_BIND_ADDRESS` e `APP_PORT` controlam a publicação da porta no host. `NEXT_BUILD_CPUS` limita o paralelismo do build.

1. Registre a revisão a implantar e preserve a imagem anterior.
2. Faça backup verificável do PostgreSQL.
3. Execute `docker compose build app` e `docker compose --profile maintenance run --build --rm migrate`.
4. Execute `docker compose up -d --wait app` e verifique `/api/health`, a listagem e o login.
5. Em falha, confira `docker compose logs app` e restaure a imagem anterior se o esquema continuar compatível. Para alteração incompatível, valide o backup antes de restaurá-lo em um banco separado.

## Verificações

```sh
bun run lint
bun run typecheck
bun test
bun run build
```

Veja [mapeamento do legado](docs/legado.md) para preparar a migração dos registros.
