import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MessagesInterface } from "../../../core/interfaces/MessagesInterface";

@Component({
  selector: "calendar-footer",
  template: `
    <div class="calendar-footer justify-content-end">
      <div class="toggle" (click)="handleDarkMode()" *ngIf="isDarkMode">
        <span>{{ messages.dark }}</span>
        <div class="dark-mode-switch">
          <div class="dark-mode-switch-ident"></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /deep/ .justify-content-end {
        justify-content: flex-end !important;
      }
    `,
  ],
})
export class CalendarFooterComponent implements OnInit {
  @Input() messages: MessagesInterface;
  @Input() dateRangeValue: boolean;
  @Input() isDarkMode: boolean;
  @Output() clear: EventEmitter<Function> = new EventEmitter();
  @Output() darkMode: EventEmitter<Function> = new EventEmitter();
  constructor() {}

  handleClick() {
    this.clear.emit();
  }

  handleDarkMode() {
    this.darkMode.emit();
  }

  ngOnInit(): void {}
}
