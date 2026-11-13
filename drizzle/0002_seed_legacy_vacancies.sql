-- Carga única da exportação do PAT legado. Os últimos dígitos do UUID preservam o id_vaga.
INSERT INTO vacancies (id, occupation, openings, education, experience, notes, filled, updated_at)
VALUES
  ('5c68020b-6cbf-4990-8057-000008502888', 'Açougueiro / Balconista de Açougue', 2, 'Indiferente', 'SIM', 'Disponibilidade de horário', false, TIMESTAMP '2026-11-11 09:04:59' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502873', 'Orçamentista / Planejador de obras', 1, 'Ensino médio', 'SIM', '-', false, TIMESTAMP '2026-11-06 15:40:36' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502891', 'Ajudante geral na produção', 2, 'Indiferente', 'Não exige', 'Vaga masculina - Somente moradores do Araretama ou Cidade Jardim', false, TIMESTAMP '2026-11-13 08:02:39' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502865', 'Pedreiro', 1, 'Ensino Fundamental', 'SIM', '.', false, TIMESTAMP '2026-11-05 11:59:43' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502897', 'Meio Oficial de Cozinha', 2, 'Ensino Fundamental', 'SIM', '.', false, TIMESTAMP '2026-11-13 12:20:21' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502895', 'Balconista', 5, 'Indiferente', 'SIM', 'Loja de roupas', false, TIMESTAMP '2026-11-13 11:05:06' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502896', 'Técnico em Nutrição', 2, 'Técnico na área', 'Não exige', '.', false, TIMESTAMP '2026-11-13 12:16:55' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502879', 'Frentista', 2, 'Ensino médio', 'Não exige', 'Vaga exclusiva para PCD / Dutra / 14h20 as 23h', false, TIMESTAMP '2026-11-09 15:10:24' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502894', 'Balconista de crediário', 5, 'Indiferente', 'SIM', 'Loja de roupas', false, TIMESTAMP '2026-11-13 11:04:51' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502885', 'Supervisor de loja', 1, 'Indiferente', 'SIM', 'Tremembé', false, TIMESTAMP '2026-11-10 11:00:22' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502892', 'Jardineiro (Roçadeira)', 2, 'Indiferente', 'SIM', '-', false, TIMESTAMP '2026-11-13 09:44:00' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502893', 'Soldador', 3, 'Ensino Médio', 'SIM', 'Curso de Solda com certificado', false, TIMESTAMP '2026-11-13 10:09:25' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502889', 'Atendente de lanchonete', 10, 'Ensino médio', 'Não exige', 'Roseira / Moradores de Moreira / 18 a 25 anos', false, TIMESTAMP '2026-11-12 08:16:59' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502890', 'Servente de limpeza', 1, 'Indiferente', 'SIM', 'Vaga masculina', false, TIMESTAMP '2026-11-12 10:02:23' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502845', 'Balconista', 4, 'Ensino Fundamental', 'SIM', 'Vaga na Dutra / CNH AB', false, TIMESTAMP '2026-11-03 08:25:05' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502843', 'Auxiliar de Cozinha', 2, 'Ensino Fundamental', 'SIM', 'Vaga na Dutra / CNH AB', false, TIMESTAMP '2026-11-03 08:19:28' AT TIME ZONE 'America/Sao_Paulo'),
  ('5c68020b-6cbf-4990-8057-000008502844', 'Auxiliar de Limpeza', 2, 'Ensino Fundamental', 'SIM', 'Vaga na Dutra / CNH AB', false, TIMESTAMP '2026-11-03 08:22:34' AT TIME ZONE 'America/Sao_Paulo')
ON CONFLICT (id) DO NOTHING;
