export const DECO_METHODS = {
  "Embroidery": "EMB",
  "Silkscreen": "SP",
  "Laser Engraved": "LSR",
  "4CP": "4CP",
  "Pad Print": "PAD",
  "Silk Screen Transfer": "SST",
  "Dye Sublimated": "SUB",
  "Heat Transfer": "HT",
  "Digital Color Print": "4CP",
  "Laser Plus": "LSR",
  "Digital Print": "DP",
  "Direct to Garment": "DTG",
  "Foil Stamped": "FOIL",
  "Screenprint": "SP",
  "Deboss": "DEB"
};

export function getDecoMethodCode(method) {
  const map = Object.fromEntries(
    Object.entries(DECO_METHODS).map(([k, v]) => [k.toLowerCase(), v])
  );

  return map[method?.toLowerCase?.()] || null;
}