const months = Array.from({ length: 12 }).fill(0);
const currentDate = new Date();

export const monthsNames = (locale: string) =>
  months.map((_, index) => {
    const date = new Date(currentDate.getFullYear(), index, 1);
    return date.toLocaleDateString(locale, { month: 'long' });
  }) as string[];

export const calendarHeader = (): HTMLElement => {
  return document.querySelector('#year-picker') as HTMLElement;
};

export const calendar = (): HTMLElement => {
  return document.querySelector('.calendar') as HTMLElement;
};

export const calendarMonths = (): HTMLElement[] | null => {
  const elements = document.querySelectorAll('.month-element');
  return Array.from(elements) as HTMLElement[];
};

export const monthElement = (): HTMLElement | null => {
  return document.querySelector('.month-container');
};

export const yearElement = (): HTMLElement | null => {
  return document.querySelector('.year-container');
};

export const calendarDays = (): HTMLElement[] | null => {
  const elements = document.querySelectorAll('.calendar-days .bundle');
  return Array.from(elements) as HTMLElement[];
};
