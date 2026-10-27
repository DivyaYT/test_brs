export function cleanLine(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

export function extractAmount(line: string) {
  const match = line.match(/[\d,]+\.\d{2}/);
  return match ? match[0] : null;
}

export function extractTransferName(line: string) {
  line = cleanLine(line);

  if (!line.includes("FUNDS TRANSFER")) return null;

  let part = line.split("-").slice(1).join("-");

  // remove amount
  part = part.replace(/[\d,]+\.\d{2}.*$/, "").trim();

  return part || null;
}
