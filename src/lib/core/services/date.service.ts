import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public transformPipeInDate(day: number, month: number, year: number): Date {
    return new Date(year, month, day);
  }

  public formatDate(date: Date, callback: (date: Date) => string): string {
    if (!date) return '';
    return callback(date);
  }

  public isBefore(date: Date, compare: Date): boolean {
    if (!date || !compare) return false;
    return date.getTime() < compare.getTime();
  }

  public  isAfter(date: Date, compare: Date): boolean {
    if (!date || !compare) return false;
    return date.getTime() > compare.getTime();
  }

  public parseDate(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
  }
}
