import { Injectable } from "@angular/core";
import { MessagesInterface } from "./core/interfaces/MessagesInterface";
import { HttpClient } from "@angular/common/http";
import { manifest } from "./locale";
@Injectable({
  providedIn: "root",
})
export class LibService {
  private userLanguage: string = navigator.language;
  private validColorRegex =
    /^(#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0|1|0?\.\d+)\))$/;
  constructor(private http: HttpClient) {}

  public loadManifest(): {
    [key: string]: MessagesInterface;
  } {
    return manifest;
  }

  get navigatorLanguage(): string {
    return this.userLanguage.split("-")[0];
  }

  fetchMessages(
    language: string,
    locale: {
      [key: string]: MessagesInterface;
    }
  ): MessagesInterface {
    const lang = language || this.navigatorLanguage;

    return locale?.[lang];
  }

  isValidColor(color: string, key: string): boolean {
    if (!color) return false;

    const isValid = this.validColorRegex.test(color);

    if (!isValid) throw new Error(`Invalid color ${color}`);

    return isValid;
  }
}
