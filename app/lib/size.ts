// Product sizes are stored as metre dimensions in the form "16x8m".

const trim = (n: number) => String(Number(n.toFixed(2)));

export const formatSize = (width: number, length: number) =>
  `${trim(width)}x${trim(length)}m`;

export const parseSize = (size: string): { width: number; length: number } | null => {
  const match = /^\s*(\d+(?:[.,]\d+)?)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*m?\s*$/.exec(size);
  if (!match) return null;

  const width = parseFloat(match[1].replace(",", "."));
  const length = parseFloat(match[2].replace(",", "."));
  if (!width || !length) return null;

  return { width, length };
};

// Falls back to the raw string for legacy values that predate the metre format.
export const normalizeSize = (size: string) => {
  const parsed = parseSize(size);
  return parsed ? formatSize(parsed.width, parsed.length) : size;
};
