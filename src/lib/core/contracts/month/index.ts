import {
  formatDate,
  isAfter,
} from '../../../shared/utils/formatDate';
import { monthsNames, calendarHeader } from '../../../shared/utils/months';
import { FormControlInterface } from '../../interfaces/FormControlInterface';
import { calendarType } from '../../interfaces/DataInterface';

export class Contract {
  public static default(
    data: any,
    form: FormControlInterface,
    DataInterface: calendarType
  ) {
    const { secondDate, firstDate } = form;
    const { month: innerMonth } = data as any;

    const months = document.querySelectorAll(
      '.month-element'
    ) as any as HTMLElement[];

    const nameMonths = monthsNames(DataInterface.locale);

    const calendarHeaderYear = Number(
      calendarHeader() ? calendarHeader().innerHTML : 0
    );

    const isSecondClick = secondDate && secondDate.value ? true : false;

    if (isSecondClick) {
      for (const m of months) {
        if (!m) continue;

        const monthName = m.innerHTML;

        if (!monthName) continue;

        const monthIndex = nameMonths.indexOf(monthName);

        const date = formatDate(firstDate.value, (d) =>
          d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' })
        );

        const [firstDateMonth, firstDateYear] = date.split('/');

        if (!firstDateMonth || !firstDateYear) continue;

        const isTheSameYear = Number(firstDateYear) == calendarHeaderYear;

        const greaterThanFirstDateMonth =
          Number(innerMonth + 1) > Number(firstDateMonth);

        if (!greaterThanFirstDateMonth) {
          return m.classList.add('selected');
        }

        const isWithinTheRange =
          Number(monthIndex + 1) < innerMonth + 1 &&
          monthIndex + 1 > Number(firstDateMonth) &&
          isTheSameYear;

        const isTheSameMonth =
          Number(monthIndex + 1) == innerMonth + 1 && isTheSameYear;

        if (
          !isTheSameMonth &&
          isAfter(secondDate.value, firstDate.value) &&
          isWithinTheRange
        ) {
          m.classList.add('interval');
        }

        if (isTheSameMonth && isAfter(secondDate.value, firstDate.value)) {
          m.classList.add('selected');
        }
      }

      return { data, form };
    }

    return { data, form };
  }
}
