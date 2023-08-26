export class DateModel{
  year: any;
  month?: number;
  day?: HTMLElement;
  week?: number;
}

export enum TypeContract{
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  decade = 'decade',
  century = 'century'
}
