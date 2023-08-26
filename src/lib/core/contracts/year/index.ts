import { DataInterface } from '../../interfaces/DataInterface';
import { FormControlInterface } from '../../interfaces/FormControlInterface';
export class Contract {
  public static default(
    data: any,
    form: FormControlInterface,
    DataInterface: DataInterface
  ) {
    const { year: element } = data as any;
    const { secondDate, firstDate } = form;

    const years = document.querySelectorAll(
      '.year-element'
    ) as any as HTMLElement[];

    element.classList.add('selected');

    const isSecondClick = secondDate && secondDate.value ? true : false;

    if (isSecondClick) {
      for (const y of years) {
        if (!y) continue;

        const year = Number(y.innerText);

        const isTheSameYear = year == Number(firstDate.value);

        const isWithinTheRange = year < Number(secondDate.value) && year > Number(firstDate.value);

        if (isWithinTheRange && !isTheSameYear) {
          y.classList.add('interval');
        }
      }
    }
  }
}
