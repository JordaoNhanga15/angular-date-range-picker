# Date Range Picker Angular Library

The **ngx-angular-date-range-picker** library provides a customizable date range picker component for Angular applications.

## Installation

To use this library in your Angular project, you need to install it using npm:

```bash
npm install ngx-angular-date-range-picker
```

## Usage

1. Import the `DateRangePickerModule` into your application module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DateRangePickerModule } from 'ngx-angular-date-range-picker';

@NgModule({
  declarations: [/* ... */],
  imports: [
    BrowserModule,
    DateRangePickerModule, // Add this line
  ],
  bootstrap: [/* ... */],
})
export class AppModule {}
```

2. In your component template, use the `ngx-angular-date-range-picker` component:

```html
<date-range-picker [row]="row" [control]="date"></date-range-picker>
```

3. In your component TypeScript file, configure the `DataInterface` and the `FormControl`:

```typescript
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataInterface } from 'ngx-angular-date-range-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  date = new FormControl();

  row: DataInterface = {
    type: 'day',
    date: new Date(),
    containDarkMode: true,
    locale: 'en',
    backgroundColorPrimary: '#F1BF98',
    backgroundColorSecondary: '#FDF4ED',
    maxDate: new Date(),
    minDate: new Date(),
  };
}
```

## Features

- Supports various date range types (day, month, year).
- Allows formatting based on different regions.
- Provides internationalization (i18n) support.
- Customizable CSS styling.
- Supports dark mode.
- Allows setting a maximum and minimum date range.
- Supports reactive forms.
- Supports template-driven forms.
- Supports Angular 11.

## Contributions

Contributions are welcome! Feel free to open issues or pull requests on the [GitHub repository](https://github.com/JordaoNhanga15/angular-date-range-picker).

## Author

- LinkedIn: [Jordão de Oliveira](https://www.linkedin.com/in/jordao-de-oliveira/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
