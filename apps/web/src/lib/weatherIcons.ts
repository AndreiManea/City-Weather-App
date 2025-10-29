export function getWeatherEmoji(desc: string | undefined | null) {
  if (!desc) return '🌍';
  const d = desc.toLowerCase();
  if (d.includes('sun')) return '☀️';
  if (d.includes('clear')) return '🌤️';
  if (d.includes('cloud')) return '☁️';
  if (d.includes('rain')) return '🌧️';
  if (d.includes('storm') || d.includes('thunder')) return '⛈️';
  if (d.includes('snow')) return '❄️';
  if (d.includes('mist') || d.includes('fog') || d.includes('haze')) return '🌫️';
  return '🌍';
}

export function countryCodeToFlagEmoji(cca2?: string | null) {
  if (!cca2) return '🌍';
  const code = cca2.toUpperCase();
  if (code.length !== 2) return '🌍';
  const base = 127397; // regional indicator symbol letter A
  const chars = Array.from(code).map((c) => String.fromCodePoint(base + c.charCodeAt(0)));
  return chars.join('');
}
