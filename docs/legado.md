# Mapeamento do PAT em PHP

A listagem do legado lia `vagas` em ordem de ocupação e consultava `config.Data_atualizacao` para exibir a data da lista. A edição usava a mesma tabela `vagas`. O novo projeto mantém a listagem pública e atualiza a data automaticamente a cada inclusão, edição efetiva ou exclusão de vaga.

| PHP/MySQL                             | Next.js/PostgreSQL                                    |
| ------------------------------------- | ----------------------------------------------------- |
| `vagas_list.php`                      | `/` com busca, filtro de situação e paginação         |
| `vagas_edicao_*.php`                  | `/gestao` para cadastro, edição e exclusão            |
| `config.Data_atualizacao`             | `publication.updated_at`, registro único com `id = 1` |
| `pessoas`, grupos e permissões do PHP | Keycloak institucional, papel de client `operator`    |

| Coluna de origem | Coluna de destino                |
| ---------------- | -------------------------------- |
| `id_vaga`        | `id` UUID gerado pelo PostgreSQL |
| `ocupacao`       | `occupation`                     |
| `nrvagas`        | `openings`, inteiro positivo     |
| `instrucao`      | `education`                      |
| `experiencia`    | `experience`                     |
| `observacao`     | `notes`                          |
| `preenchida`     | `filled`, booleano               |
| `dt_atualizada`  | `updated_at`, com fuso horário   |

Antes de importar, obtenha uma exportação autorizada de `vagas` e do registro de atualização. Confirme os valores efetivos de `preenchida` e o fuso dos horários de origem. Revise valores nulos, quantidades e comprimentos antes de preparar a carga. Execute a carga em um banco isolado e compare as contagens, os filtros e uma amostra dos registros antes de publicar.

A migração `0002_seed_legacy_vacancies.sql` importa as 17 vagas do CSV fornecido. Os UUIDs preservam o identificador legado nos últimos 12 dígitos. Campos de situação vazios ou nulos foram mapeados para vagas disponíveis, e os horários históricos foram interpretados em America/Sao_Paulo. As telas auxiliares de importação, exportação e impressão do gerador PHP ficaram fora desta versão. O fluxo de contas passa pelo Keycloak.
