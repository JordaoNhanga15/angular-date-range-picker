import { Injectable } from '@angular/core';
import data from './locale/manifest.json';
import { MessagesInterface } from './core/interfaces/MessagesInterface';

@Injectable({
  providedIn: 'root',
})
export class LibService {
  private userLanguage: string = navigator.language;
  private validColorRegex =
    /^(#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0|1|0?\.\d+)\))$/;
  constructor() {}

  get navigatorLanguage(): string {
    return this.userLanguage.split('-')[0];
  }

  fetchMessages(language: string): MessagesInterface {
    const lang = language || this.navigatorLanguage;

    const messages =
      data[lang as keyof typeof data] || data[lang as keyof typeof data];

    return messages;
  }

  isValidColor(color: string, key: string): boolean {
    if (!color) return false;

    const isValid = this.validColorRegex.test(color);

    if (!isValid) throw new Error(`Invalid color ${color}`);

    return isValid;
  }
}
