export function castToBoolean(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    return null;
  }
}
