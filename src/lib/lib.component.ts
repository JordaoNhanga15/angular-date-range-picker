import {
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { DataInterface } from "./core/interfaces/DataInterface";
import { LibService } from "./lib.service";
import { MessagesInterface } from "./core/interfaces/MessagesInterface";

@Component({
  selector: "date-range-picker",
  template: `
    <aside class="light">
      <div class="date-input" (click)="eventCalendar()">
        <input
          type="text"
          id="date"
          [placeholder]="translate.placeholder"
          readonly
          [value]="control.value"
        />
        <i class="fa fa-calendar"></i>
      </div>

      <div class="calendar" id="calendar-lib">
        <ng-container [ngSwitch]="row.type">
          <ng-container *ngSwitchCase="'day'">
            <lib-calendar-daily
              [row]="row"
              [format]="format"
              [messages]="translate"
              (dateRange)="onDateRangeChange($event)"
            ></lib-calendar-daily>
          </ng-container>
          <ng-container *ngSwitchCase="'month'">
            <lib-calendar-monthly
              [row]="row"
              [format]="format"
              [messages]="translate"
              (dateRange)="onDateRangeChange($event)"
            ></lib-calendar-monthly>
          </ng-container>
          <ng-container *ngSwitchCase="'year'">
            <lib-calendar-yearly
              [row]="row"
              [format]="format"
              [messages]="translate"
              (dateRange)="onDateRangeChange($event)"
            ></lib-calendar-yearly>
          </ng-container>
        </ng-container>
      </div>
    </aside>
  `,
  styleUrls: ["./lib.component.css"],
  styles: [
    `
      /deep/ :root {
        --dark-body: #4d4c5a !important;
        --dark-main: #141529 !important;
        --dark-second: #79788c !important;
        --dark-hover: #323048 !important;
        --dark-text: #f8fbff !important;
        --light-body: #f3f8fe !important;
        --light-main: #fdfdfd !important;
        --light-second: #c3c2c8 !important;
        --light-hover: #edf0f5 !important;
        --light-text: #151426 !important;
        --white: #fff !important;
        --shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px !important;
        --font-family: Roboto !important;
        --background-disabled: #ccc !important;
        --theme-primary: #008ffd !important;
        --theme-primary-accent: #cbe8ff !important;
      }

      /deep/ .calendar-lib {
        max-height: 100% !important;
      }

      /deep/ .dark {
        --bg-body: var(--dark-body) !important;
        --bg-main: var(--dark-main) !important;
        --bg-main-inverse: var(--light-main) !important;
        --bg-second: var(--dark-second) !important;
        --color-hover: var(--dark-hover) !important;
        --color-txt: var(--dark-text) !important;
        --color-txt-inverse: var(--light-text) !important;
        box-shadow: var(--shadow) !important;
        --c-theme-primary: #008ffd !important;
        --c-theme-primary-accent: #cbe8ff !important;
      }

      /deep/ .light {
        --bg-body: var(--light-body) !important;
        --bg-main: var(--light-main) !important;
        --bg-main-inverse: var(--dark-main) !important;
        --bg-second: var(--light-second) !important;
        --color-hover: var(--light-hover) !important;
        box-shadow: var(--shadow) !important;
        --color-txt: var(--light-text) !important;
        --color-txt-inverse: var(--dark-text) !important;
        --c-theme-primary: #008ffd !important;
        --c-theme-primary-accent: #cbe8ff !important;
      }

      /deep/ .selected {
        background-color: var(--range-lib) !important;
        color: var(--white) !important;
      }

      /deep/ .interval {
        background-color: var(--range-lib-interval) !important;
        color: var(--color-txt) !important;
      }

      /deep/ .isDisabled {
        opacity: 0.65 !important;
        pointer-events: none !important;
        cursor: not-allowed !important;
        background-color: var(--background-disabled) !important;
        color: #000 !important;
      }

      /deep/ .calendar-complete{
        // display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        height: 100% !important;
        width: 100% !important;
        align-items: center !important;
      }

      /deep/ .calendar-footer {
        padding: 10px !important;
        display: flex !important;
        justify-content: space-between !important;
        justify-items: center !important;
        align-content: center !important;
        align-items: center !important;
      }

      /deep/ .calendar-footer .trash-link-button {
        flex-shrink: 0 !important;
        width: 44px !important;
        height: 44px !important;
        display: flex !important;
        font-size: 20px !important;
        align-items: center !important;
        justify-content: center !important;
        // background: #e9e5ff !important;
        color: #f34969; !important;
        border: 1px solid #f34969 !important;
        opacity: 0.9 !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        background: transparent !important;
      }

      /deep/ .calendar-footer .trash-link-button:hover {
        opacity: 1 !important;
        // background: #f34969 !important;
      }

      /deep/ .w-100{
        width: 100% !important;
      }

      /deep/ .d-flex{
        display: flex !important;
      }

      /deep/ .align-items-center{
        align-items: center !important;
      }

      /deep/ .justify-content-between{
        justify-content: space-between !important;
      }

      /deep/ .event-hover{
        transition: all 0.2s ease-in-out !important;
        background-color: var(--color-hover) !important;
      }

      /deep/ .font-weight-600{
        font-weight: 600 !important;
      }

      /deep/ .text-color{
        color: var(--color-txt) !important;
      }

      /deep/ .font-size-25{
        font-size: 25px !important;
      }

      /deep/ .toggle {
        display: flex !important;
        align-items: center !important;
      }

      /deep/ .toggle span {
        margin-right: 10px !important;
        color: var(--color-txt) !important;
      }

      /deep/ .dark-mode-switch {
        position: relative !important;
        width: 48px !important;
        height: 25px !important;
        border-radius: 14px !important;
        background-color: var(--bg-second) !important;
        cursor: pointer !important;
      }

      /deep/ .dark-mode-switch-ident {
        width: 21px !important;
        height: 21px !important;
        border-radius: 50% !important;
        background-color: var(--bg-main) !important;
        position: absolute !important;
        top: 2px !important;
        left: 2px !important;
        transition: left 0.2s ease-in-out !important;
      }

      /deep/ .dark .dark-mode-switch .dark-mode-switch-ident {
        top: 2px !important;
        left: calc(2px + 50%) !important;
      }
    `,
  ],
})
export class DateRangeComponent implements OnInit, OnChanges, DoCheck {
  @Input() row: DataInterface;
  @Input() format: string;
  @Input() control: FormControl = new FormControl();
  translate: MessagesInterface;
  constructor(private libService: LibService) {}

  onDateRangeChange(date: { dateRange: Date }) {
    if (!date) {
      return this.control.setValue(null);
    }
    this.control.setValue(date);
  }

  ngOnInit(): void {}

  ngDoCheck(): void {
    this.validateColor();
    this.customTranslate();
  }

  private validateColor(): void {
    if (this.row.backgroundColorPrimary) {
      const isValid = this.libService.isValidColor(
        this.row.backgroundColorPrimary,
        "range-lib"
      );

      if (!isValid) return;

      this.setCustomProperty(this.row.backgroundColorPrimary, "range-lib");
    }

    if (this.row.backgroundColorSecondary) {
      const isValid = this.libService.isValidColor(
        this.row.backgroundColorSecondary,
        "range-lib-interval"
      );

      if (!isValid) return;

      this.setCustomProperty(
        this.row.backgroundColorSecondary,
        "range-lib-interval"
      );
    }
  }

  customTranslate() {
    if (this.row.locale) {
      this.translate = this.libService.fetchMessages(this.row.locale);
    }
  }

  private setCustomProperty(color: string, key: string): void {
    const cssVariable = `--${key}`;
    document.documentElement.style.setProperty(cssVariable, color);
  }

  ngOnChanges(changes: SimpleChanges): void {}

  // get translate(): MessagesInterface {
  //   return this.libService.fetchMessages(this.row.locale);
  // }

  eventCalendar() {
    const calendarLib = document.querySelector("#calendar-lib") as HTMLElement;

    switch (calendarLib.classList.contains("show")) {
      case true:
        calendarLib.classList.remove("show");
        break;
      case false:
        calendarLib.classList.add("show");
        break;
    }
  }
}
