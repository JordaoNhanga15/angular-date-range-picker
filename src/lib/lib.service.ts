import { Injectable } from "@angular/core";
import { MessagesInterface } from "./core/interfaces/MessagesInterface";
import { map, debounceTime } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LibService {
  private userLanguage: string = navigator.language;
  private validColorRegex =
    /^(#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0|1|0?\.\d+)\))$/;
  constructor(private http: HttpClient) {}

  public loadGist(): Observable<any> {
    // const url = `https://gist.githubusercontent.com/JordaoNhanga15/fdf9c19cf1f423b116f632e484479e44/raw/4d325e23a9f57fc9d5ef5ee76b7abba1fdbf5d30/locale-web-angular`;

    const url = 'https://gist.githubusercontent.com/jordaonhanga15/fdf9c19cf1f423b116f632e484479e44/raw/locale-web-angular.json'

    return this.http.get(url,{
      responseType: 'json'
    }).pipe(
      debounceTime(500),
    );
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
