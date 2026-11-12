# AGENTS.md — Padrão de Desenvolvimento de Software

## 1. Objetivo

Este documento estabelece os padrões técnicos, arquiteturais, visuais, operacionais e de qualidade para o desenvolvimento de aplicações web da Prefeitura Municipal de Pindamonhangaba.

Seu objetivo é orientar agentes de inteligência artificial e desenvolvedores, garantindo consistência, segurança, simplicidade, interoperabilidade e facilidade de manutenção.

Este documento é genérico e reutilizável entre os projetos institucionais.

As regras de negócio, funcionalidades, integrações, modelos de dados e requisitos específicos deverão ser definidos separadamente, conforme cada projeto.

### Princípios fundamentais

- Simplicidade e legibilidade.
- Monólito MVC modular.
- Separação clara de responsabilidades.
- Segurança desde o início.
- Desenvolvimento incremental.
- Baixo acoplamento.
- Reutilização de componentes.
- Padronização institucional.
- Facilidade de manutenção.
- Preferência por tecnologias abertas.
- Evitar complexidade desnecessária.
- Não antecipar funcionalidades futuras.
- Configuração por ambiente.
- Interoperabilidade entre sistemas.
- Proteção dos dados pessoais.
- Deploy reproduzível.

**Diretriz principal:** implementar a solução mais simples que atenda aos requisitos atuais, preservando a capacidade de evolução.

---

## 2. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js — App Router |
| Linguagem | TypeScript strict |
| Runtime | Bun |
| Gerenciador de pacotes | Bun |
| Interface | React |
| Arquitetura | MVC modular |
| Backend | Controllers e Services |
| Banco de dados | PostgreSQL |
| ORM | Drizzle ORM |
| Migrações | Drizzle Kit |
| Validação | Zod |
| Autenticação | Keycloak institucional — OIDC |
| Containers | Docker |
| Orquestração | Docker Compose |
| Testes | Bun Test e Playwright |
| Qualidade | ESLint e Prettier |

Utilizar versões estáveis e suportadas.

Não adicionar dependências sem necessidade técnica justificada.

Não substituir componentes da stack sem decisão arquitetural explícita.

### Regras do Bun

Utilizar Bun para desenvolvimento, gerenciamento de pacotes, build, testes e execução em produção.

Comandos padrão:

```bash
bun install
bun run dev
bun run build
bun run start
bun test
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

Regras:

1. Não utilizar npm, yarn ou pnpm.
2. Versionar `bun.lock`.
3. Utilizar `bun install --frozen-lockfile` nos builds reproduzíveis.
4. Utilizar imagens oficiais `oven/bun` nos containers.
5. Não instalar Node.js no container por padrão.
6. Verificar compatibilidade das dependências com Bun.
7. Validar a aplicação no container final.
8. Não introduzir ferramentas alternativas sem justificativa.

---

## 3. Arquitetura MVC modular

A aplicação deverá utilizar uma arquitetura **monolítica MVC modular**, com responsabilidades claramente separadas.

O Next.js será responsável pelo roteamento e renderização, sem concentrar a lógica de negócio.

### Model

Responsável pela representação e persistência dos dados.

Inclui:

- Schemas do Drizzle ORM.
- Entidades e tipos.
- Repositories.
- Consultas e operações de persistência.

### View

Responsável pela apresentação.

Inclui:

- Páginas React.
- Componentes.
- Formulários.
- Tabelas.
- Estados visuais.

Views não devem implementar regras de negócio nem acessar diretamente o banco.

### Controller

Responsável por receber e coordenar requisições.

Inclui:

- Recebimento de parâmetros.
- Validação de entradas.
- Verificação de autenticação e autorização.
- Chamada dos services.
- Tratamento e formatação das respostas.

Controllers não devem implementar regras complexas de negócio nem acessar repositories diretamente.

### Service

Responsável pela lógica de negócio.

Inclui:

- Regras de domínio.
- Coordenação de repositories.
- Integrações externas.
- Transações.
- Processamento de dados.
- Comunicação entre módulos.

Services não devem depender de componentes React ou objetos HTTP do Next.js.

### Fluxo arquitetural

```text
Next.js Route / Server Action
             |
             v
         Controller
             |
             v
          Service
             |
             v
      Model / Repository
             |
             v
         PostgreSQL
```

Para integrações externas, utilizar adapters quando necessário.

### Regras arquiteturais

1. Manter as camadas separadas.
2. Organizar funcionalidades por módulos.
3. Evitar dependências circulares.
4. Não compartilhar regras de negócio por meio de componentes visuais.
5. Utilizar interfaces quando contribuírem para o desacoplamento.
6. Não criar abstrações prematuras.
7. Não introduzir microsserviços sem decisão arquitetural explícita.
8. Manter os arquivos de `app/` mínimos.
9. Evitar duplicação de lógica entre controllers e services.
10. Priorizar Server Components quando adequados.
11. Utilizar Client Components apenas quando houver necessidade de interatividade.
12. Não expor serviços ou dependências exclusivamente de servidor no bundle do cliente.

---

## 4. Estrutura de diretórios

Estrutura inicial recomendada:

```text
project/
├── AGENTS.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── modules/
│   │   └── ...
│   │
│   └── shared/
│       ├── components/
│       ├── lib/
│       │   ├── db/
│       │   ├── auth/
│       │   ├── security/
│       │   └── env.ts
│       ├── styles/
│       └── types/
│
├── drizzle/
├── tests/
├── docs/
├── Dockerfile
├── compose.yml
├── drizzle.config.ts
├── next.config.ts
├── .env.example
├── .dockerignore
├── .gitignore
├── bun.lock
├── tsconfig.json
└── package.json
```

Cada módulo poderá utilizar:

```text
module/
├── controllers/
├── services/
├── models/
├── repositories/
├── views/
├── schemas/
└── ...
```

Regras:

- Criar apenas os diretórios necessários.
- Organizar código por domínio funcional.
- Evitar módulos excessivamente grandes.
- Centralizar componentes realmente compartilhados.
- Não criar estruturas vazias apenas para seguir o exemplo.
- Não concentrar toda a lógica da aplicação em `shared/`.
- Manter a organização consistente entre projetos.

---

## 5. Banco de dados

Utilizar PostgreSQL com Drizzle ORM.

### Convenções

- Tabelas e colunas em `snake_case`.
- Propriedades TypeScript em `camelCase`.
- Identificadores preferencialmente UUID.
- Chaves estrangeiras explícitas.
- Constraints no banco.
- Índices conforme necessidade.
- Datas preferencialmente em `timestamptz`.
- Armazenamento temporal consistente, preferencialmente UTC.
- Conexões parametrizadas por ambiente.
- Utilizar pool de conexões quando apropriado.

### Migrações

1. Utilizar Drizzle Kit.
2. Versionar todas as migrações.
3. Revisar o SQL gerado.
4. Não utilizar `drizzle-kit push` em produção.
5. Não alterar migrações já aplicadas.
6. Não executar operações destrutivas sem autorização.
7. Realizar backup antes de alterações relevantes.
8. Não executar migrações automaticamente em toda inicialização de produção.
9. Executar migrações como etapa controlada do deploy.
10. Documentar alterações incompatíveis e procedimentos de recuperação.

### Ambientes

Cada ambiente deverá utilizar seu próprio banco de dados ou isolamento equivalente aprovado.

Em produção, priorizar o servidor PostgreSQL institucional externo quando disponibilizado pela infraestrutura.

Não criar automaticamente um banco PostgreSQL em container de produção quando já existir infraestrutura institucional apropriada.

A modelagem deverá seguir os requisitos efetivos de cada projeto.

Não criar tabelas ou relacionamentos antecipadamente.

---

## 6. Autenticação institucional

Quando a aplicação exigir autenticação, deverá utilizar obrigatoriamente o **Keycloak institucional da Prefeitura Municipal de Pindamonhangaba**.

### Provedor oficial

**Servidor:** https://sso.pindamonhangaba.sp.gov.br

**Realm:** `Pindamonhangaba`

**Issuer:**

```text
https://sso.pindamonhangaba.sp.gov.br/realms/Pindamonhangaba
```

**Protocolo:** OpenID Connect (OIDC).

O realm institucional é fixo e não deverá ser substituído por realms particulares de cada aplicação.

Cada sistema deverá possuir seu próprio client no Keycloak, com identificador e credenciais individuais.

O Keycloak poderá utilizar o Active Directory institucional como fonte de identidade, sem que a aplicação precise integrar-se diretamente ao AD.

### Regras obrigatórias

1. Utilizar o Keycloak institucional como único provedor de autenticação.
2. Utilizar OpenID Connect com Authorization Code Flow.
3. Utilizar PKCE S256.
4. Não implementar autenticação direta por LDAP ou Active Directory.
5. Não implementar cadastros paralelos de senhas.
6. Não criar login local alternativo.
7. Não armazenar senhas dos usuários.
8. Não utilizar o realm `master` para autenticação das aplicações.
9. Não utilizar o fluxo Resource Owner Password Credentials.
10. Validar issuer, audience, assinatura, expiração e demais condições aplicáveis aos tokens.
11. Utilizar bibliotecas consolidadas para integração OIDC.
12. Não implementar manualmente protocolos criptográficos de autenticação.
13. Não expor client secrets no frontend.
14. Proteger sessões, cookies e tokens.
15. Implementar logout seguro.
16. Não considerar autenticação como autorização.
17. Não exigir autenticação em aplicações inteiramente públicas quando desnecessária.

### Identificação dos usuários

Utilizar o identificador `sub` do Keycloak, associado ao issuer, como referência estável da identidade externa.

Quando necessário, manter UUID interno para relacionamentos e auditoria.

Não utilizar e-mail, nome ou CPF como chave primária de identidade.

Não exigir recadastramento manual de usuários já autenticados pelo Keycloak, salvo quando houver necessidade de informações específicas da aplicação.

### Sessões

A aplicação poderá utilizar uma biblioteca consolidada para gerenciar sessões locais, como Better Auth, quando compatível com a arquitetura adotada.

A biblioteca de sessão não deverá substituir o Keycloak como provedor de identidade.

Quando necessário, configurar um segredo próprio para gerenciamento de sessões.

Os cookies deverão utilizar configurações seguras, incluindo `HttpOnly`, `Secure` em produção e política `SameSite` adequada.

A renovação de tokens deverá ser realizada de forma segura.

### Autorização

Quando necessário, utilizar RBAC ou outro modelo apropriado aos requisitos.

Os papéis e grupos poderão ser definidos no Keycloak e utilizados pela aplicação.

As permissões específicas de negócio poderão permanecer no banco de dados da aplicação.

Regras:

1. Negar acesso por padrão.
2. Aplicar o princípio do menor privilégio.
3. Verificar autorização no servidor.
4. Não confiar exclusivamente na interface.
5. Não presumir que todo usuário autenticado possui acesso ao sistema.
6. Não conceder privilégios administrativos automaticamente.
7. Registrar alterações administrativas relevantes.
8. Validar permissões em cada operação protegida.
9. Utilizar papéis de cliente quando apropriado, evitando privilégios globais desnecessários.

### Autenticação desabilitada

Quando `KEYCLOAK_ENABLED=false`, não deverá existir mecanismo alternativo de autenticação.

As funcionalidades públicas poderão continuar disponíveis.

Todas as funcionalidades privadas deverão permanecer inacessíveis.

---

## 7. Configuração por ambiente

Todo projeto deverá disponibilizar um arquivo `.env.example` contendo as variáveis necessárias para sua execução.

O arquivo deverá ser versionado, documentado e não conter credenciais reais.

### Ambientes

Suportar:

- Desenvolvimento.
- Testes.
- Produção.

A configuração deverá ser realizada por variáveis de ambiente.

### Regras obrigatórias

1. Manter `.env.example` versionado.
2. Nunca versionar `.env` com credenciais reais.
3. Separar credenciais por ambiente.
4. Validar configurações obrigatórias com Zod.
5. Falhar explicitamente quando configurações essenciais estiverem ausentes.
6. Não expor segredos por variáveis `NEXT_PUBLIC_`.
7. Documentar novas variáveis.
8. Não utilizar credenciais de produção em desenvolvimento.
9. Não definir valores inseguros como fallback silencioso.
10. Não incorporar arquivos `.env` nas imagens Docker.
11. Utilizar configurações externas ao código para endereços, portas, credenciais e integrações.
12. Atualizar `.env.example` sempre que uma configuração for adicionada, alterada ou removida.
13. Não criar variáveis desnecessárias.
14. Manter nomes consistentes entre projetos.

### Modelo base de `.env.example`

```dotenv
# ==========================================
# AMBIENTE
# ==========================================

# development ou production
COMPOSE_PROFILES=development

NODE_ENV=development

# ==========================================
# APLICAÇÃO
# ==========================================

APP_URL=http://localhost:3000
APP_PORT=3000

# Endereço de escuta/publicação
APP_BIND_ADDRESS=127.0.0.1

# HTTP permitido somente em desenvolvimento
# controlado
ALLOW_LOCAL_HTTP=true

# ==========================================
# BANCO DE DADOS
# ==========================================

# Obrigatório quando a aplicação utilizar
# PostgreSQL externo
DATABASE_URL=

# Apenas quando houver PostgreSQL local
# gerenciado pelo Compose
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# ==========================================
# AUTENTICAÇÃO INSTITUCIONAL
# ==========================================

KEYCLOAK_ENABLED=false

KEYCLOAK_ISSUER=https://sso.pindamonhangaba.sp.gov.br/realms/Pindamonhangaba

KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=

# HTTP inseguro desabilitado por padrão
KEYCLOAK_ALLOW_INSECURE_HTTP=false

# ==========================================
# SESSÃO
# ==========================================

# Apenas quando a biblioteca de sessão
# utilizada exigir segredo próprio
BETTER_AUTH_SECRET=

# ==========================================
# BUILD
# ==========================================

# Paralelismo conservador para servidores
# com recursos limitados
NEXT_BUILD_CPUS=2
```

Esse arquivo representa uma base inicial.

As variáveis deverão ser adicionadas ou removidas conforme as necessidades efetivas do projeto.

### Keycloak

O valor institucional padrão do issuer deverá ser:

```dotenv
KEYCLOAK_ISSUER=https://sso.pindamonhangaba.sp.gov.br/realms/Pindamonhangaba
```

O client ID e o client secret serão individuais para cada aplicação.

A configuração do client deverá ser realizada no Keycloak institucional.

Não utilizar credenciais compartilhadas entre aplicações.

Em produção, a autenticação deverá utilizar HTTPS.

### Validação das variáveis

Centralizar a leitura e validação das variáveis de ambiente em um módulo apropriado, preferencialmente:

```text
src/shared/lib/env.ts
```

Utilizar Zod para validar:

- Presença de variáveis obrigatórias.
- Tipos.
- URLs.
- Números.
- Booleanos.
- Valores permitidos.
- Dependências entre configurações.

As configurações obrigatórias deverão ser validadas conforme os recursos habilitados.

Exemplo: as credenciais do Keycloak serão obrigatórias quando `KEYCLOAK_ENABLED=true`.

Não exigir credenciais de integrações desabilitadas.

### Configurações públicas

Variáveis com prefixo `NEXT_PUBLIC_` poderão ser disponibilizadas ao navegador.

Nunca utilizar esse prefixo para:

- Senhas.
- Tokens privados.
- Client secrets.
- Connection strings com credenciais.
- Chaves criptográficas.
- Segredos de sessão.

---

## 8. Integrações externas

As integrações deverão ser implementadas de forma isolada, segura e configurável.

### Regras

1. Isolar integrações em services ou adapters.
2. Não realizar chamadas externas diretamente nas views.
3. Manter credenciais exclusivamente no backend.
4. Validar entradas e respostas.
5. Utilizar timeouts.
6. Tratar indisponibilidade.
7. Não inventar contratos de APIs.
8. Não expor detalhes internos aos usuários.
9. Documentar contratos separadamente.
10. Evitar acoplamento entre regras de negócio e protocolos externos.
11. Implementar retries apenas quando seguros e apropriados.
12. Considerar idempotência em operações que possam ser repetidas.

### Configuração

Integrações opcionais deverão possuir uma variável de ativação quando apropriado.

Exemplo:

```dotenv
INTEGRATION_ENABLED=false
INTEGRATION_BASE_URL=
INTEGRATION_TIMEOUT_MS=15000
```

Utilizar prefixos específicos e consistentes para cada integração.

Não criar variáveis genéricas que possam causar ambiguidades.

### Certificados

Quando houver autenticação por certificados:

- Não versionar certificados privados.
- Não incorporar certificados à imagem Docker.
- Utilizar volumes ou mecanismos de secrets.
- Montar arquivos sensíveis preferencialmente como somente leitura.
- Configurar caminhos por variáveis de ambiente.
- Proteger senhas de certificados.
- Validar a cadeia de confiança TLS.
- Não desabilitar validação TLS em produção.

### Limites operacionais

Quando aplicável, configurar:

- Timeout.
- Limite de requisições.
- Concorrência.
- Franquia contratual.
- Limites por usuário.
- Cache.
- Política de retry.

Essas configurações deverão refletir os requisitos reais de cada integração.

---

## 9. Segurança e privacidade

Aplicar segurança desde o início do desenvolvimento.

### Requisitos gerais

- HTTPS em produção.
- Validação de entradas com Zod.
- Consultas parametrizadas.
- Proteção contra XSS, CSRF e SSRF.
- Proteção de sessões e cookies.
- Segredos fora do código-fonte.
- Tratamento seguro de erros.
- Controle de acesso.
- Limitação de requisições quando necessária.
- Validação de arquivos enviados, quando aplicável.
- Aplicação dos princípios da LGPD.
- Proteção contra exposição indevida de informações.
- Atualização de dependências vulneráveis.

### Dados sensíveis

- Não expor credenciais.
- Não registrar tokens em logs.
- Não retornar informações internas em mensagens de erro.
- Não persistir dados desnecessários.
- Restringir o acesso conforme finalidade.
- Definir retenção e descarte conforme necessidade.
- Não armazenar informações pessoais sem finalidade definida.
- Evitar informações sensíveis em URLs.
- Não utilizar dados reais de produção em testes sem autorização e proteção adequada.

### Autorização

Toda operação protegida deverá verificar as permissões no servidor.

A ocultação de botões ou menus não substitui a autorização.

As regras deverão ser aplicadas independentemente do cliente utilizado para acessar a aplicação.

### Dependências

- Preferir bibliotecas consolidadas.
- Evitar dependências sem manutenção.
- Verificar vulnerabilidades conhecidas.
- Remover dependências não utilizadas.
- Não atualizar versões principais sem avaliar incompatibilidades.
- Não executar scripts externos desconhecidos sem revisão.

---

## 10. Auditoria e logs

Implementar auditoria conforme a criticidade e os requisitos de cada projeto.

Distinguir:

- Logs técnicos.
- Eventos de segurança.
- Registros de auditoria.
- Eventos de negócio.

### Regras

1. Utilizar logs estruturados quando apropriado.
2. Utilizar identificadores de correlação quando necessário.
3. Registrar erros relevantes.
4. Evitar dados pessoais excessivos.
5. Não registrar senhas ou tokens.
6. Restringir acesso aos registros.
7. Definir políticas de retenção.
8. Não ocultar falhas silenciosamente.
9. Não registrar dados completos de requisições sensíveis sem justificativa.
10. Evitar logs excessivamente verbosos em produção.

### Auditoria de negócio

Quando necessário, registrar:

- Usuário responsável.
- Operação executada.
- Data e hora.
- Recurso afetado.
- Resultado.
- Identificador de correlação.

Não implementar infraestrutura complexa de auditoria antes de existir necessidade.

---

## 11. Identidade visual institucional

As aplicações deverão seguir a identidade visual oficial da Prefeitura Municipal de Pindamonhangaba.

### Referência obrigatória

https://dsiapp.pindamonhangaba.sp.gov.br/paleta-prefeitura/

A referência disponibilizada nesse endereço deverá orientar a definição das cores e demais elementos institucionais.

### Regras

1. Consultar a referência antes de definir cores.
2. Não inventar valores hexadecimais institucionais.
3. Centralizar cores em design tokens ou variáveis CSS.
4. Evitar cores definidas diretamente nos componentes.
5. Utilizar cores institucionais consistentemente.
6. Garantir contraste e acessibilidade.
7. Não criar paletas alternativas sem autorização.
8. Preservar tokens existentes quando a referência estiver indisponível.
9. Priorizar a reutilização dos padrões visuais institucionais já implementados.

---

## 12. Estilo visual

O estilo visual deverá combinar:

**Swiss Design + Minimalismo + Design System Institucional.**

### Swiss Design

Priorizar:

- Grids consistentes.
- Alinhamentos rigorosos.
- Hierarquia tipográfica clara.
- Espaçamento intencional.
- Organização objetiva.
- Composições equilibradas.

### Minimalismo

Priorizar:

- Interfaces limpas.
- Navegação simples.
- Baixa poluição visual.
- Redução de elementos decorativos.
- Uso moderado de cores.
- Eficiência dos fluxos.

Evitar:

- Sombras excessivas.
- Gradientes decorativos.
- Animações desnecessárias.
- Cards sem função.
- Bordas excessivas.
- Elementos visuais redundantes.

### Design System Institucional

Utilizar:

- Tokens de cores.
- Escala tipográfica consistente.
- Espaçamentos padronizados.
- Componentes reutilizáveis.
- Estados de interação padronizados.
- Ícones consistentes.
- Formulários acessíveis.
- Layouts responsivos.

### Diretriz estética

A interface deverá transmitir uma identidade:

**Institucional, moderna, sóbria, organizada e confiável.**

Priorizar clareza, produtividade e acessibilidade em vez de elementos decorativos.

---

## 13. Componentes e experiência do usuário

Priorizar componentes reutilizáveis quando houver utilização recorrente.

Exemplos:

- Botões.
- Campos de entrada.
- Formulários.
- Tabelas.
- Menus.
- Alertas.
- Modais.
- Indicadores de carregamento.
- Estados vazios.
- Mensagens de erro.

### Usabilidade

- Utilizar linguagem clara.
- Apresentar feedback das ações.
- Manter navegação consistente.
- Evitar etapas desnecessárias.
- Garantir responsividade.
- Priorizar acessibilidade.
- Não sobrecarregar a interface.
- Apresentar estados de carregamento.
- Tratar estados vazios e indisponibilidade.
- Evitar confirmações desnecessárias.
- Confirmar operações destrutivas relevantes.

### Acessibilidade

Considerar as diretrizes WCAG aplicáveis.

Priorizar:

- Navegação por teclado.
- Compatibilidade com leitores de tela.
- Rótulos claros.
- Contraste adequado.
- Estados de foco visíveis.
- Mensagens compreensíveis.
- Estrutura semântica apropriada.

---

## 14. Docker e deploy

Utilizar Docker e Docker Compose.

### Dockerfile

- Utilizar imagem oficial do Bun.
- Fixar versão da imagem.
- Utilizar multi-stage build.
- Instalar dependências com lockfile.
- Executar build no container.
- Reduzir dependências da imagem final.
- Executar com usuário não privilegiado.
- Utilizar Bun como runtime de produção.
- Não incorporar segredos.
- Utilizar `.dockerignore`.
- Evitar ferramentas desnecessárias na imagem final.

### Docker Compose

Configurar apenas os serviços necessários.

Requisitos:

- Persistência de dados quando necessária.
- Health checks.
- Rede interna.
- Configuração por ambiente.
- Política de reinicialização.
- Não expor bancos publicamente por padrão.
- Separar configurações de desenvolvimento e produção.
- Evitar portas fixas desnecessárias.
- Não armazenar credenciais diretamente no Compose.

### Profiles

Utilizar `COMPOSE_PROFILES` quando houver necessidade de selecionar serviços por ambiente.

Valores institucionais recomendados:

```dotenv
COMPOSE_PROFILES=development
```

ou:

```dotenv
COMPOSE_PROFILES=production
```

Não utilizar profiles como substitutos de validação de segurança.

### Produção

Garantir:

- HTTPS.
- Proxy reverso quando necessário.
- Backups.
- Logs.
- Deploy reproduzível.
- Procedimento documentado de atualização.
- Recuperação em caso de falhas.
- Configurações externas à imagem.
- Health checks apropriados.
- Controle de acesso à infraestrutura.

### Proxy reverso

A aplicação deverá ser compatível com publicação por proxy reverso.

Não presumir que o endereço interno do container corresponde ao endereço público.

Utilizar `APP_URL` para representar a origem pública da aplicação quando necessário.

Configurar corretamente cabeçalhos encaminhados pelo proxy, considerando apenas proxies confiáveis.

Não utilizar endereços IP internos diretamente no código.

### Migrações

Não executar migrações automaticamente a cada inicialização da aplicação em produção.

As migrações deverão ser executadas em etapa controlada.

### Atualizações

O procedimento de deploy deverá permitir:

1. Identificar a versão implantada.
2. Construir a imagem de forma reproduzível.
3. Validar configurações.
4. Executar migrações necessárias.
5. Atualizar os containers.
6. Verificar a saúde da aplicação.
7. Identificar falhas.
8. Executar rollback quando tecnicamente viável.

Alterações incompatíveis de banco deverão possuir plano específico de recuperação.

---

## 15. Convenções de código

Utilizar TypeScript strict.

Evitar `any` e preferir tipos explícitos.

### Nomenclatura

| Elemento | Convenção |
|---|---|
| Variáveis | camelCase |
| Funções | camelCase |
| Componentes | PascalCase |
| Tipos e interfaces | PascalCase |
| Constantes globais | UPPER_SNAKE_CASE |
| Arquivos | kebab-case |
| Diretórios | kebab-case |
| Tabelas | snake_case |
| Colunas | snake_case |

### Idioma

- Código e identificadores em inglês.
- Interface em português brasileiro.
- Documentação em português brasileiro.
- Mensagens aos usuários em português brasileiro.

### Boas práticas

- Funções pequenas.
- Responsabilidades claras.
- Baixa duplicação.
- Evitar abstrações prematuras.
- Não criar arquivos excessivamente grandes.
- Preferir legibilidade.
- Comentar decisões relevantes, não comportamentos óbvios.
- Evitar dependências desnecessárias.
- Utilizar tipagem explícita nos limites entre módulos.
- Evitar valores mágicos.
- Centralizar constantes compartilhadas.
- Não duplicar contratos de dados desnecessariamente.

---

## 16. Tratamento de erros

Distinguir:

- Erros de validação.
- Erros de autenticação.
- Erros de autorização.
- Erros de negócio.
- Erros de integração.
- Erros inesperados.

Controllers deverão converter erros em respostas apropriadas.

Services deverão utilizar erros de domínio sem depender de códigos HTTP.

Não retornar stack traces ou informações sensíveis ao usuário.

Não ocultar falhas silenciosamente.

Apresentar mensagens claras e compreensíveis.

### APIs

Utilizar códigos HTTP apropriados.

Padronizar a estrutura das respostas de erro quando houver APIs próprias.

Não retornar detalhes internos de banco, infraestrutura ou autenticação.

Utilizar identificadores de correlação quando necessários para diagnóstico.

---

## 17. Testes e qualidade

Utilizar Bun Test para testes unitários e de integração.

Utilizar Playwright para testes de ponta a ponta quando necessário.

### Prioridades

- Services.
- Controllers.
- Validação.
- Autorização.
- Repositories.
- Integrações externas.
- Operações críticas.
- Fluxos de autenticação.
- Regras de negócio sensíveis.

### Regras

- Utilizar mocks para serviços externos.
- Isolar ambientes de teste.
- Não executar testes contra produção.
- Cobrir fluxos críticos.
- Evitar testes redundantes.
- Não afirmar que testes passaram sem executá-los.
- Não depender de credenciais reais para testes automatizados.
- Evitar testes frágeis baseados exclusivamente em detalhes visuais.

### Validação

Antes de concluir alterações relevantes:

```bash
bun run lint
bun run typecheck
bun test
bun run build
```

Os scripts deverão existir no `package.json`.

Informar quando alguma verificação não puder ser executada.

### Integração contínua

Quando houver pipeline CI/CD, executar automaticamente as verificações aplicáveis.

Priorizar:

1. Instalação reproduzível.
2. Lint.
3. Typecheck.
4. Testes.
5. Build.
6. Verificações de segurança pertinentes.

Não realizar deploy automático em produção sem autorização e configuração institucional apropriada.

---

## 18. Documentação

Manter documentação objetiva em `docs/`.

Documentar conforme necessário:

- Instalação.
- Configuração.
- Desenvolvimento.
- Arquitetura.
- Integrações.
- Permissões.
- Migrações.
- Deploy.
- Recuperação.
- Decisões arquiteturais relevantes.

### README

Todo projeto deverá possuir um `README.md` com informações suficientes para compreender e executar a aplicação.

Incluir, quando aplicável:

- Objetivo.
- Stack.
- Pré-requisitos.
- Configuração inicial.
- Variáveis de ambiente.
- Execução local.
- Execução via Docker.
- Testes.
- Deploy.
- Integrações.
- Licença.

### Separação de responsabilidades

Este `AGENTS.md` estabelece padrões gerais de desenvolvimento.

Não deverá ser utilizado para registrar:

- Requisitos específicos.
- Funcionalidades particulares.
- APIs e endpoints específicos.
- Modelos de dados específicos.
- Regras de negócio.
- Credenciais.
- Cronogramas.
- Demandas temporárias.

Essas informações deverão permanecer em documentação própria de cada projeto.

### Decisões arquiteturais

Quando necessário, registrar:

- Contexto.
- Decisão.
- Justificativa.
- Consequências.

Evitar documentação extensa sem necessidade.

---

## 19. Projeto institucional de referência

O projeto **Identifica Pinda** será utilizado como referência institucional para o desenvolvimento dos demais sistemas.

Repositório:

https://github.com/Prefeitura-de-Pindamonhangaba/Pindamonhangaba.IdentificaPinda

### Objetivo

Promover consistência entre aplicações desenvolvidas pela Prefeitura, reduzindo divergências técnicas, retrabalho e custos de manutenção.

### Diretrizes

1. Consultar o repositório de referência antes de iniciar novos projetos.
2. Reutilizar padrões arquiteturais compatíveis.
3. Priorizar convenções de organização já consolidadas.
4. Reutilizar componentes visuais quando apropriado.
5. Manter consistência na configuração por ambiente.
6. Seguir o padrão de autenticação institucional.
7. Preservar a separação MVC modular.
8. Priorizar soluções já validadas.
9. Não copiar funcionalidades específicas sem necessidade.
10. Não copiar credenciais, certificados ou segredos.
11. Não reproduzir vulnerabilidades ou soluções provisórias.
12. Não copiar dependências obsoletas.
13. Registrar justificativas para divergências relevantes.
14. Priorizar documentação oficial quando houver incompatibilidades técnicas.
15. Não considerar o repositório de referência substituto deste documento.

### Reutilização

Antes de desenvolver uma solução já existente no projeto de referência, verificar se ela poderá ser reutilizada.

Exemplos:

- Configuração do Keycloak.
- Gerenciamento de sessões.
- Validação de variáveis de ambiente.
- Estrutura de controllers e services.
- Componentes visuais.
- Tratamento de erros.
- Configuração Docker.
- Organização de testes.
- Convenções de banco de dados.

A reutilização deverá considerar compatibilidade, segurança e manutenção.

Não criar bibliotecas compartilhadas entre projetos antecipadamente.

A extração de componentes para pacotes reutilizáveis deverá ocorrer quando houver necessidade real e benefício demonstrado.

---

## 20. Desenvolvimento incremental

Todo projeto deverá ser desenvolvido incrementalmente.

### Diretrizes

1. Entender os requisitos antes de implementar.
2. Identificar a solução mais simples.
3. Reutilizar estruturas existentes.
4. Implementar apenas o necessário.
5. Validar cada etapa.
6. Evitar refatorações sem justificativa.
7. Não antecipar funcionalidades.
8. Preservar compatibilidade.
9. Documentar decisões relevantes.

### Evolução arquitetural

Não introduzir antecipadamente:

- Microsserviços.
- Filas externas.
- Sistemas distribuídos.
- Camadas excessivas de abstração.
- Infraestrutura de observabilidade complexa.
- Mecanismos genéricos sem utilização concreta.

Esses recursos poderão ser incorporados quando houver necessidade técnica demonstrada.

---

## 21. Instruções obrigatórias para agentes de IA

Todo agente deverá:

1. Ler este documento antes de modificar o projeto.
2. Inspecionar a estrutura existente.
3. Consultar o projeto institucional de referência quando pertinente e acessível.
4. Respeitar a arquitetura MVC modular.
5. Utilizar Bun.
6. Respeitar a stack tecnológica.
7. Não introduzir microsserviços sem autorização.
8. Não adicionar dependências sem justificativa.
9. Não implementar funcionalidades fora do escopo.
10. Manter controllers, services, models e views separados.
11. Não colocar lógica de negócio nas views.
12. Não acessar o banco diretamente nos controllers.
13. Isolar integrações externas.
14. Não inventar contratos de APIs.
15. Validar entradas e respostas externas.
16. Proteger credenciais e dados pessoais.
17. Respeitar a LGPD.
18. Utilizar a paleta oficial da Prefeitura.
19. Seguir Swiss Design + Minimalismo + Design System Institucional.
20. Reutilizar componentes e tokens existentes.
21. Não executar operações destrutivas sem autorização.
22. Preservar compatibilidade.
23. Atualizar documentação relevante.
24. Executar os testes disponíveis.
25. Informar testes não executados.
26. Comunicar decisões técnicas relevantes.
27. Solicitar esclarecimentos para decisões arquiteturais de alto impacto.
28. Utilizar exclusivamente o Keycloak institucional quando houver autenticação.
29. Utilizar o realm `Pindamonhangaba`.
30. Manter credenciais e configurações sensíveis fora do código.
31. Atualizar `.env.example` sempre que necessário.
32. Não criar mecanismos alternativos de autenticação.
33. Não alterar configurações de produção sem autorização.
34. Não executar migrações destrutivas automaticamente.
35. Não afirmar que uma integração foi validada sem testá-la.
36. Não presumir que o código do projeto de referência foi inspecionado quando não houver acesso a ele.

### Antes de implementar

- Entender o requisito.
- Inspecionar o código existente.
- Identificar o módulo responsável.
- Verificar os padrões estabelecidos.
- Consultar implementações reutilizáveis.
- Avaliar impactos de segurança.
- Escolher a solução mais simples.
- Verificar configurações de ambiente necessárias.

### Durante a implementação

- Realizar alterações pequenas e coesas.
- Respeitar as camadas.
- Evitar dependências desnecessárias.
- Preservar a identidade visual.
- Manter código legível.
- Não antecipar funcionalidades.
- Proteger dados e credenciais.
- Atualizar configurações e documentação afetadas.

### Após implementar

- Verificar tipagem.
- Executar testes.
- Verificar build.
- Revisar segurança.
- Validar configurações de ambiente.
- Documentar alterações relevantes.
- Informar limitações e pendências.
- Resumir as alterações realizadas.

### Restrições operacionais

O agente não deverá, sem autorização explícita:

- Excluir bancos de dados.
- Apagar volumes Docker.
- Remover dados persistentes.
- Executar migrações destrutivas.
- Alterar credenciais institucionais.
- Modificar configurações de produção.
- Publicar serviços externamente.
- Alterar permissões administrativas do Keycloak.
- Enviar dados pessoais a serviços externos.
- Realizar deploy em produção.

---

## 22. Diretrizes específicas do Next.js

O Next.js deverá ser utilizado como framework de roteamento e renderização.

A lógica de negócio deverá permanecer nas camadas apropriadas.

### Regras

1. Utilizar App Router.
2. Priorizar Server Components quando adequados.
3. Utilizar Client Components apenas quando necessário.
4. Não acessar o banco diretamente em componentes de apresentação.
5. Não concentrar regras de negócio em Server Actions.
6. Manter Route Handlers e Server Actions como pontos de entrada para controllers ou services apropriados.
7. Verificar autenticação e autorização nas operações protegidas.
8. Não confiar em validações realizadas exclusivamente no navegador.
9. Evitar dependências desnecessárias entre código de cliente e servidor.
10. Utilizar APIs oficiais e suportadas da versão instalada.

### Documentação local

Antes de implementar funcionalidades que dependam de APIs do Next.js, consultar a documentação correspondente à versão instalada.

Quando disponível, utilizar:

```text
node_modules/next/dist/docs/
```

Não presumir que APIs, convenções ou estruturas de versões anteriores continuam válidas.

Respeitar avisos de depreciação e alterações incompatíveis.

Quando o Next.js gerar automaticamente instruções para agentes, preservar o bloco gerenciado pela ferramenta e não realizar alterações manuais desnecessárias.

---

## 23. Licenciamento e reutilização

Os projetos destinados à publicação como software livre deverão priorizar a licença MIT, conforme a orientação institucional adotada, observadas as condições jurídicas aplicáveis.

### Regras

- Verificar a titularidade e os direitos sobre o código.
- Respeitar licenças de dependências.
- Não publicar credenciais ou dados internos.
- Não incluir informações pessoais indevidas.
- Não publicar componentes de terceiros sem autorização ou licença compatível.
- Manter avisos de copyright e licença necessários.
- Documentar dependências relevantes.
- Não presumir que todo projeto institucional poderá ser publicado automaticamente.

Quando aprovado para publicação sob MIT, incluir o arquivo `LICENSE`.

Priorizar soluções que facilitem a reutilização por outros municípios, sem comprometer a segurança ou introduzir complexidade desnecessária.

---

## 24. Diretriz final

Todo projeto deverá priorizar uma arquitetura:

**Simples, modular, segura, padronizada, extensível e sustentável.**

O Next.js será responsável pelo roteamento e renderização, enquanto controllers, services, models e views manterão responsabilidades separadas.

O Bun será utilizado como runtime e gerenciador de pacotes.

O PostgreSQL e o Drizzle ORM serão os padrões de persistência.

Quando houver autenticação, ela deverá ocorrer exclusivamente pelo Keycloak institucional da Prefeitura Municipal de Pindamonhangaba, utilizando o realm `Pindamonhangaba`.

As configurações deverão ser externalizadas e documentadas em `.env.example`, sem exposição de credenciais.

O Identifica Pinda será a referência institucional para organização, configuração e reutilização de soluções, respeitadas as particularidades de cada projeto.

A interface deverá seguir a identidade institucional da Prefeitura Municipal de Pindamonhangaba, combinando Swiss Design, Minimalismo e Design System Institucional.

A segurança, a legibilidade, a interoperabilidade e a facilidade de manutenção deverão ser consideradas requisitos fundamentais.

**Construir o necessário agora, preservando a capacidade de evoluir depois.**

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
