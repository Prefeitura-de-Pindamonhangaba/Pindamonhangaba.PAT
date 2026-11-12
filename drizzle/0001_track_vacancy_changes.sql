INSERT INTO publication (id, updated_at)
SELECT 1, max(updated_at) FROM vacancies HAVING count(*) > 0
ON CONFLICT (id) DO UPDATE SET updated_at = EXCLUDED.updated_at;
--> statement-breakpoint
CREATE FUNCTION record_vacancy_list_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF (to_jsonb(OLD) - 'updated_at') = (to_jsonb(NEW) - 'updated_at') THEN
      RETURN NULL;
    END IF;
  END IF;

  INSERT INTO publication (id, updated_at)
  VALUES (1, clock_timestamp())
  ON CONFLICT (id) DO UPDATE
  SET updated_at = greatest(publication.updated_at, EXCLUDED.updated_at);
  RETURN NULL;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER vacancy_list_changed
AFTER INSERT OR UPDATE OR DELETE ON vacancies
FOR EACH ROW EXECUTE FUNCTION record_vacancy_list_change();
