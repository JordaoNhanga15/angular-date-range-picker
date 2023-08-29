import {
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataInterface } from './core/interfaces/DataInterface';
import { LibService } from './lib.service';
import { MessagesInterface } from './core/interfaces/MessagesInterface';

@Component({
  selector: 'date-range-picker',
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
  styleUrls: ['./lib.component.css'],
  styles: [
    `
      /deep/ :root {
        --dark-body: #4d4c5a;
        --dark-main: #141529;
        --dark-second: #79788c;
        --dark-hover: #323048;
        --dark-text: #f8fbff;
        --light-body: #f3f8fe;
        --light-main: #fdfdfd;
        --light-second: #c3c2c8;
        --light-hover: #edf0f5;
        --light-text: #151426;
        --range-lib: #0000ff;
        --range-lib-interval: rgba(63, 81, 181, 0.2);
        --white: #fff;
        --shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        --font-family: Roboto;
      }

      .calendar-lib {
        max-height: 100%;
      }

      /deep/ .dark {
        --bg-body: var(--dark-body);
        --bg-main: var(--dark-main);
        --bg-main-inverse: var(--light-main);
        --bg-second: var(--dark-second);
        --color-hover: var(--dark-hover);
        --color-txt: var(--dark-text);
        --color-txt-inverse: var(--light-text);
        box-shadow: var(--shadow);
      }

      /deep/ .light {
        --bg-body: var(--light-body);
        --bg-main: var(--light-main);
        --bg-main-inverse: var(--dark-main);
        --bg-second: var(--light-second);
        --color-hover: var(--light-hover);
        box-shadow: var(--shadow);
        --color-txt: var(--light-text);
        --color-txt-inverse: var(--dark-text);
      }

      /deep/ .date-input {
        position: relative;
        display: grid;
        background-color: var(--bg-main);
        width: 100%;
        color: var(--color-txt);
      }

      /deep/ .date-input input {
        padding: 8px 12px;
        background: none;
        font-size: 14px;
        color: var(--color-txt);
        border 0px !important;
      }

      /deep/ .date-input input::placeholder {
        color: var(--color-txt);
      }

      /deep/ .date-input input:focus {
        outline: none;
        color: var(--color-txt);
      }

      /deep/ .date-input i {
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translateY(-50%);
        height: 100%;
        align-items: center;
        justify-content: center;
        display: flex;
        width: 40px;
        cursor: pointer;
        font-size: 20px;
        color: var(--color-txt);
      }

      /deep/ .light {
        // display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        place-items: center;
        font-family: var(--font-family);
      }

      @media screen and (max-width: 767px) {
        .light {
          width: 100%;
        }

        .light .date-input {
          width: 100%;
        }

        .light .calendar {
          width: 100%;
        }

        .dark {
          width: 100%;
        }

        .dark .date-input {
          width: 100%;
        }

        .dark .calendar {
          width: 100%;
        }
      }

      /deep/ .dark {
        // display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        place-items: center;
        font-family: var(--font-family);
      }

      /deep/ .selected {
        background-color: var(--range-lib) !important;
        color: var(--white) !important;
      }

      /deep/ .interval {
        background-color: var(--range-lib-interval);
        color: var(--color-txt);
      }

      /deep/ .isDisabled {
        opacity: 0.5;
        pointer-events: none;
      }

      /deep/ .calendar {
        height: max-content;
        width: max-content;
        background-color: var(--bg-main);
        position: absolute;
        z-index: 999;
        overflow: hidden;
        display: none;
        width: 100%;
        max-width: -moz-available;
        /* transform: scale(1.25); */
      }

      /deep/ .calendar.show {
        display: block;
      }

      /deep/ .light .calendar {
        box-shadow: var(--shadow);
      }

      /deep/ .calendar-header {
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
        font-size: 25px;
        font-weight: 600;
        color: var(--color-txt);
        padding: 10px;
      }

      /deep/ .calendar-body {
        padding: 10px;
      }

      /deep/ .calendar-week-day {
        height: 50px;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        font-weight: 600;
      }

      /deep/ .calendar-week-day div {
        display: grid;
        place-items: center;
        color: var(--bg-second);
      }

      /deep/ .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        color: var(--color-txt);
      }

      /deep/ .calendar-days div {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        position: relative;
        cursor: pointer;
        animation: to-top 1s forwards;
        /* border-radius: 50%; */
      }

      /deep/ .calendar-days div span {
        position: absolute;
      }

      /deep/ .calendar-days div:hover span {
        transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
      }

      /deep/ .calendar-days div span:nth-child(1),
      .calendar-days div span:nth-child(3) {
        width: 2px;
        height: 0;
        background-color: var(--color-txt);
      }

      /deep/ .calendar-days div:hover span:nth-child(1),
      /deep/ .calendar-days div:hover span:nth-child(3) {
        height: 100%;
      }

      /deep/ .calendar-days div span:nth-child(1) {
        bottom: 0;
        left: 0;
      }

      /deep/ .calendar-days div span:nth-child(3) {
        top: 0;
        right: 0;
      }

      /deep/ .calendar-days div span:nth-child(2),
      /deep/ .calendar-days div span:nth-child(4) {
        width: 0;
        height: 2px;
        background-color: var(--color-txt);
      }

      /deep/ .calendar-days div:hover span:nth-child(2),
      .calendar-days div:hover span:nth-child(4) {
        width: 100%;
      }

      /deep/ .calendar-days div span:nth-child(2) {
        top: 0;
        left: 0;
      }

      /deep/ .calendar-days div span:nth-child(4) {
        bottom: 0;
        right: 0;
      }

      /deep/ .calendar-days div:hover span:nth-child(2) {
        transition-delay: 0.2s;
      }

      /deep/ .calendar-days div:hover span:nth-child(3) {
        transition-delay: 0.4s;
      }

      /deep/ .calendar-days div:hover span:nth-child(4) {
        transition-delay: 0.6s;
      }

      /deep/ .calendar-days div.curr-date,
      /deep/ .calendar-days div.curr-date:hover {
        border: 2px solid var(--color-txt);
        border-radius: 100%;
      }

      /deep/ .calendar-days div.curr-date span {
        display: none;
      }

      /deep/ .month-picker {
        padding: 5px 10px;
        border-radius: 10px;
        cursor: pointer;
      }

      /deep/ .month-element {
        border-radius: 10px;
      }

      /deep/ .month-element:hover {
        background-color: var(--color-hover);
      }

      /deep/ .month-element:hover {
        background-color: var(--color-hover);
      }

      /deep/ .year-picker {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /deep/ .year-value {
      }

      /deep/ .year-change {
        width: 40px;
        max-height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        place-items: center;
        margin: 0 10px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

      /deep/ .year-change:hover {
        box-shadow: var(--shadow);
        background-color: var(--color-hover);
      }

      /deep/ .calendar-footer {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-content: center;
        align-items: center;
      }

      /deep/ .calendar-footer  .trash-link-button {
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        display: flex;
        font-size: 20px;
        align-items: center;
        justify-content: center;
        background: #bc3b44;
        color: var(--color-txt);
        border: 1px solid #eee;
        opacity: 0.9;
        border-radius: 50%;
        cursor: pointer;
      }

      /deep/ .toggle {
        display: flex;
      }

      /deep/ .toggle span {
        margin-right: 10px;
        color: var(--color-txt);
      }

      /deep/ .dark-mode-switch {
        position: relative;
        width: 48px;
        height: 25px;
        border-radius: 14px;
        background-color: var(--bg-second);
        cursor: pointer;
      }

      /deep/ .dark-mode-switch-ident {
        width: 21px;
        height: 21px;
        border-radius: 50%;
        background-color: var(--bg-main);
        position: absolute;
        top: 2px;
        left: 2px;
        transition: left 0.2s ease-in-out;
      }

      /deep/ .dark .dark-mode-switch .dark-mode-switch-ident {
        top: 2px;
        left: calc(2px + 50%);
      }

      /deep/ .month-container {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;
        flex-direction: column;
        width: 100%;
        transform: scale(1.5);
        visibility: hidden;
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: var(--bg-main);
        padding: 20px;
      }

      /deep/ .year-container {
        display: flex;
        justify-content: flex-start;
        position: relative;
        flex-direction: column;
        width: 100%;
        transform: scale(1.5);
        visibility: hidden;
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: var(--bg-main);
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 8px;
        padding-right: 8px;
        align-items: center;
        transition: all 0.2s ease-in-out;
      }

      /deep/ .year-container.show {
        transform: scale(1);
        visibility: visible;
        pointer-events: visible;
        transition: all 0.2s ease-in-out;
      }

      /deep/ .year-list {
        width: 100%;
        align-items: center;
        justify-content: space-between;
        justify-items: center;
        background-color: var(--bg-main);
        padding: 20px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 10px 30px;
        display: grid;
        margin-right: 17px;
      }

      /deep/ .year-list div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        color: var(--color-txt);
        height: 60px;
        cursor: pointer;
        font-size: 1rem;
      }

      /deep/ .year-list div:hover {
        background-color: var(--color-hover);
        border-radius: 10px;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
      }

      /deep/ .year-picker {
        padding: 5px 10px;
        margin-left: 20px;
        border-radius: 10px;
        cursor: pointer;
      }

      /deep/ .year-pickers {
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        transition: all 0.2s ease-in-out;
      }

      /deep/ .year-picker:hover {
        transition: all 0.2s ease-in-out;
        background-color: var(--color-hover);
      }

      /deep/ .month-container.show {
        transform: scale(1);
        visibility: visible;
        pointer-events: visible;
        transition: all 0.2s ease-in-out;
      }

      /deep/ .month-list {
        /* position: absolute; */
        height: 100%;
        /* top: 0; */
        /* left: 0; */
        background-color: var(--bg-main);
        padding: 20px;
        grid-template-columns: repeat(3, auto);
        gap: 10px;
        display: grid;
        // font-size: 1rem;
        width: 100% !important;
        /* transform: scale(1.5);
        visibility: hidden;
        pointer-events: none; */
      }

      /deep/ .month-list.show {
        transform: scale(1);
        visibility: visible;
        pointer-events: visible;
        transition: all 0.2s ease-in-out;
      }

      /deep/ .month-list > div {
        display: grid;
        place-items: center;
      }

      /deep/ .month-list > div > div {
        width: 100%;
        padding: 5px 20px;
        border-radius: 10px;
        text-align: center;
        cursor: pointer;
        color: var(--color-txt);
      }

      /deep/ .month-list > div > div:hover {
        background-color: var(--color-hover);
      }

      /deep/ .month-list .month-element {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        color: var(--color-txt);
        height: 60px;
        cursor: pointer;
        font-size: 1.5rem;
      }

      /deep/ .year-list .year-element {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        color: var(--color-txt);
        height: 60px;
        cursor: pointer;
        font-size: 1.5rem;
      }

      @keyframes to-top {
        0% {
          transform: translateY(100%);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class DateRangeComponent implements OnInit, OnChanges, DoCheck {
  @Input() row: DataInterface;
  @Input() format: string;
  @Input() control: FormControl = new FormControl();
  translate: MessagesInterface;
  constructor(
    private libService: LibService,
  ) {}

  onDateRangeChange(date: { dateRange: Date }) {
    if (!date) {
      return this.control.setValue(null);
    }
    this.control.setValue(date);
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.validateColor();
    this.customTranslate();
  }

  private validateColor(): void {
    if (this.row.backGroundColorPrimary) {
      const isValid = this.libService.isValidColor(
        this.row.backGroundColorPrimary,
        'range-lib'
      );

      if (!isValid) return;

      this.setCustomProperty(this.row.backGroundColorPrimary, 'range-lib');
    }

    if (this.row.backGroundColorSecondary) {
      const isValid = this.libService.isValidColor(
        this.row.backGroundColorSecondary,
        'range-lib-interval'
      );

      if (!isValid) return;

      this.setCustomProperty(
        this.row.backGroundColorSecondary,
        'range-lib-interval'
      );
    }
  }

  customTranslate(){
    if(this.row.locale){
      this.translate = this.libService.fetchMessages(this.row.locale);
    }
  }

  private setCustomProperty(color: string, key: string): void {
    const cssVariable = `--${key}`;
    document.documentElement.style.setProperty(cssVariable, color);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  // get translate(): MessagesInterface {
  //   return this.libService.fetchMessages(this.row.locale);
  // }

  eventCalendar() {
    const calendarLib = document.querySelector('#calendar-lib') as HTMLElement;

    switch (calendarLib.classList.contains('show')) {
      case true:
        calendarLib.classList.remove('show');
        break;
      case false:
        calendarLib.classList.add('show');
        break;
    }
  }
}
