export const getStored = <T,>(key: string): T[] => JSON.parse(localStorage.getItem(key) || "[]") as T[];

export const setStored = <T,>(key: string, value: T[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};
