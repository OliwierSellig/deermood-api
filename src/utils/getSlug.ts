export const getSlug = (fullString: string) =>
  fullString.trim().toLowerCase().replaceAll(' ', '-');
