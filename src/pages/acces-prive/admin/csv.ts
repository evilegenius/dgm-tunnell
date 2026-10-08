/** Utilitaires d'export CSV pour le panel admin. */

type CsvValue = string | number | null | undefined;

function escapeCell(value: CsvValue): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsv(headers: string[], rows: CsvValue[][]): string {
  const lines = [headers.map(escapeCell).join(",")];
  rows.forEach((row) => lines.push(row.map(escapeCell).join(",")));
  return lines.join("\r\n");
}

/** Déclenche le téléchargement d'un fichier CSV (compatible Excel, BOM UTF-8). */
export function downloadCsv(filename: string, headers: string[], rows: CsvValue[][]): void {
  const csv = buildCsv(headers, rows);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function timestampSuffix(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}