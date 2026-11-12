# Mapeamento do PAT em PHP

A listagem do legado lia `vagas` em ordem de ocupação e consultava `config.Data_atualizacao` para exibir a data da lista. A edição usava a mesma tabela `vagas`. O novo projeto mantém a listagem pública e o controle explícito da data, que a equipe pode registrar com o horário atual.

| PHP/MySQL                             | Next.js/PostgreSQL                                    |
| ------------------------------------- | ----------------------------------------------------- |
| `vagas_list.php`                      | `/` com busca, filtro de situação e paginação         |
| `vagas_edicao_*.php`                  | `/gestao` para cadastro, edição e exclusão            |
| `config.Data_atualizacao`             | `publication.updated_at`, registro único com `id = 1` |
| `pessoas`, grupos e permissões do PHP | Keycloak institucional, papel de client `pat-editor`  |

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

A carga histórica ainda precisa ser executada. As telas auxiliares de importação, exportação e impressão do gerador PHP ficaram fora desta versão. O fluxo de contas passa pelo Keycloak.
