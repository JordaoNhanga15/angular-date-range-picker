import { transformPipeInDate, isAfter } from '../../../shared/utils/formatDate';
import { calendarDays } from '../../../shared/utils/months';
import { FormControlInterface } from '../../interfaces/FormControlInterface';
import { DataInterface } from '../../interfaces/DataInterface';

export class Contract {
  public static default(
    data: any,
    form: FormControlInterface,
    DataInterface: DataInterface
  ) {
    const { secondDate, firstDate, monthIndex, year } = form as any;
    const { day, month } = data;

    const containFirstDate = firstDate && firstDate.value;

    const days = calendarDays() as any as HTMLElement[];

    if (containFirstDate) {
      for (const d of days) {
        if (!d) continue;

        const numberDay = Number(d.innerText);

        const date = transformPipeInDate(
          numberDay,
          monthIndex.value - 1,
          year.value
        );

        const isTheSelectedDay = numberDay == day.innerText;

        const isWithinTheRange = numberDay < day.innerText;

        if (
          !isTheSelectedDay &&
          isAfter(date, firstDate.value) &&
          isWithinTheRange
        ) {
          d.classList.add('interval');
        }

        if (isTheSelectedDay && isAfter(date, firstDate.value)) {
          d.classList.add('selected');
        }
      }

      return { data, form };
    }

    days.forEach((d) => {
      d.classList.remove('selected');
      d.classList.remove('interval');
    });

    day.classList.add('selected');

    day.classList.remove('curr-date');

    return { data, form };
  }
}
