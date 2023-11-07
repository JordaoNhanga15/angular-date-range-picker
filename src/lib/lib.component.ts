import {
  Component,
  DoCheck,
  Input,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { calendarType } from "./core/interfaces/DataInterface";
import { LibService } from "./lib.service";
import { MessagesInterface } from "./core/interfaces/MessagesInterface";

@Component({
  selector: "date-range-picker",
  template: `
    <aside class="light" #dateInputDiv>
      <div class="date-input" (click)="eventCalendar()">
        <input
          type="text"
          id="date"
          [placeholder]="translate?.placeholder || 'loading...'"
          readonly
          [value]="control.value"
        />
        <span
          class="fa fa-xmark"
          aria-label="close"
          role="button"
          (click)="clearCalendar()"
          *ngIf="control.value"
        ></span>
        <i class="fa fa-calendar"></i>
      </div>

      <div class="calendar" id="calendar-lib">
        <ng-container [ngSwitch]="props.type">
          <ng-container *ngSwitchCase="'day'">
            <lib-calendar-daily
              [row]="props"
              [format]="format"
              [messages]="translate"
              [clear-calendar]="toClearCalendar"
              (dateRange)="onDateRangeChange($event)"
            ></lib-calendar-daily>
          </ng-container>
          <ng-container *ngSwitchCase="'month'">
            <lib-calendar-monthly
              [row]="props"
              [format]="format"
              [messages]="translate"
              [clear-calendar]="toClearCalendar"
              (dateRange)="onDateRangeChange($event)"
            ></lib-calendar-monthly>
          </ng-container>
          <ng-container *ngSwitchCase="'year'">
            <lib-calendar-yearly
              [row]="props"
              [format]="format"
              [messages]="translate"
              [clear-calendar]="toClearCalendar"
              (dateRange)="onDateRangeChange($event)"
            ></lib-calendar-yearly>
          </ng-container>
        </ng-container>
      </div>
    </aside>
  `,
  styles: [
    `
      @import url("https://cdn.jsdelivr.net/gh/JordaoNhanga15/CDN-for-Assets@main/lib.css");

      @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.css");

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

      /deep/ .calendar {
        position: absolute;
        z-index: 150000 !important;
        box-sizing: border-box;
        top: 100% !important;
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
        position: relative !important;
        width: 296px !important;
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
        position: relative !important;
        width: 296px !important;
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
    `,
  ],
})
export class DateRangeComponent implements OnInit, DoCheck {
  @Input() props: calendarType;
  @Input() format: string;
  @Input() control: FormControl = new FormControl();
  translate: MessagesInterface;
  manifest: any;
  toClearCalendar: boolean = false;
  @ViewChild("dateInputDiv") dateInputDiv: ElementRef;
  constructor(private libService: LibService) {
    this.manifest = this.libService.loadManifest();
  }

  onDateRangeChange(date: { dateRange: Date }) {
    if (!date) {
      return this.control.setValue(null);
    }
    this.control.setValue(date);
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    if (!this.dateInputDiv.nativeElement.contains(event.target as Node)) {
      this.eventCalendar(true);
    }
  }

  clearCalendar() {
    this.control.setValue(null);
    this.toClearCalendar = true;
    setTimeout(() => {
      this.toClearCalendar = false;
    }, 100);
  }

  ngOnInit(): void {
    this.customTranslate(this.manifest);
  }

  ngDoCheck(): void {
    this.validateColor();
    this.customTranslate(this.manifest);
  }

  private validateColor(): void {
    if (this.props.backgroundColorPrimary) {
      const isValid = this.libService.isValidColor(
        this.props.backgroundColorPrimary,
        "range-lib"
      );

      if (!isValid) return;

      this.setCustomProperty(this.props.backgroundColorPrimary, "range-lib");
    }

    if (this.props.backgroundColorSecondary) {
      const isValid = this.libService.isValidColor(
        this.props.backgroundColorSecondary,
        "range-lib-interval"
      );

      if (!isValid) return;

      this.setCustomProperty(
        this.props.backgroundColorSecondary,
        "range-lib-interval"
      );
    }
  }

  customTranslate(locale: any) {
    if (this.props.locale) {
      this.translate = this.libService.fetchMessages(
        this.props.locale.toLowerCase(),
        locale
      );
    }
  }

  private setCustomProperty(color: string, key: string): void {
    const cssVariable = `--${key}`;
    document.documentElement.style.setProperty(cssVariable, color);
  }

  eventCalendar(toClose?: boolean) {
    const calendarLib = document.querySelector("#calendar-lib") as HTMLElement;

    if (toClose) {
      calendarLib.classList.remove("show");
      return;
    }

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
