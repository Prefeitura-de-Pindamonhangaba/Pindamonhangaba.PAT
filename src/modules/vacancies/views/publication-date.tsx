const formatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function PublicationDate({ date }: { date?: Date }) {
  if (!date) return null;
  return (
    <p className="publication">
      Última atualização{" "}
      <time dateTime={date.toISOString()}>{formatter.format(date)}</time>
    </p>
  );
}
