export default function toCamelCase(rows: { [key: string]: any }[]) {
  return rows.map((row) => {
    const replaced: { [key: string]: any } = {};
    Object.keys(row).forEach((key) => {
      const camelCase = key.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace("_", ""));
      replaced[camelCase] = row[key];
    });

    return replaced;
  });
}
