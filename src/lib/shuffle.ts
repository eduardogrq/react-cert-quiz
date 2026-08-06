/**
 * Seeded shuffle usando algoritmo Fisher-Yates + LCG para seed.
 * Permite reproducir el mismo orden con la misma seed (útil para examen simulado).
 */

function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    // LCG parameters (Numerical Recipes)
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  const random = createSeededRandom(seed);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function shuffle<T>(array: T[]): T[] {
  return seededShuffle(array, Date.now());
}
