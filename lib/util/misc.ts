export const querify = (params: Record<string, string | number | undefined>): string =>
  Object.keys(params).filter((key) => params[key] !== undefined).map((key) =>
    key + "=" + params[key]
  ).join("&");

export const delay = (ms: number): Promise<void> => {
  return new Promise<void>((res) => setTimeout(() => res(), ms));
};

export const clamp = (num: number | undefined, min: number, max: number) => {
  if (!num)
    return max;
  
  return num > max ? max : (num < min ? min : num);
}