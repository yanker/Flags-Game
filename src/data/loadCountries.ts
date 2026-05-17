import type { Country } from '../lib/types';
import fallbackData from './countries.json';

// Normalize a raw entry from restcountries API
function normalize(raw: Record<string, unknown>): Country | null {
  const cca2 = raw.cca2 as string | undefined;
  if (!cca2 || cca2.length !== 2) return null;

  const code = cca2.toLowerCase();

  // Try Spanish translation first
  let name: string | undefined;
  try {
    const translations = raw.translations as Record<string, { common?: string; official?: string }> | undefined;
    name = translations?.spa?.common ?? translations?.spa?.official;
  } catch {
    // ignore
  }
  if (!name) {
    try {
      const nameObj = raw.name as { common?: string } | undefined;
      name = nameObj?.common;
    } catch {
      // ignore
    }
  }
  if (!name) return null;

  const regionRaw = raw.region as string | undefined;
  const region = regionRaw ?? 'Other';
  const population = (raw.population as number | undefined) ?? 0;

  return { code, name, region, population };
}

export async function loadCountries(): Promise<Country[]> {
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/independent?status=true&fields=name,translations,flags,cca2,region,population',
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = (await res.json()) as Record<string, unknown>[];
    const countries: Country[] = [];
    for (const item of raw) {
      const c = normalize(item);
      if (c) countries.push(c);
    }
    if (countries.length < 50) throw new Error('Too few countries from API');
    return countries;
  } catch {
    // Fall back to committed snapshot
    return fallbackData as Country[];
  }
}
