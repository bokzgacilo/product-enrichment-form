export const COLOR_CODE_MAP = {
  "White": "WHT",
  "Full Color Blue": "FCBLUE",
  "Full Color White": "FCW",
  "Full Color Black": "FCB",
  "Black": "BLK",
  "Red": "RED",
  "Deboss": "DEB",
  "Laser Engrave": "LSR",
  "Full Color Yellow": "FCY"
};

const COLOR_CODE_LOOKUP = Object.entries(COLOR_CODE_MAP).reduce(
  (acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  },
  {}
);

export function getColorCode(color) {
  return color
    ? COLOR_CODE_LOOKUP[color.toLowerCase()] || null
    : null;
}