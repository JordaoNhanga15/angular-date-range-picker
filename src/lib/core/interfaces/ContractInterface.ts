import { DateModel } from '../../shared/models/date.model';
import { FormControlInterface } from './FormControlInterface';
import { calendarType } from './DataInterface';

export interface ContractInterface {
  default(
    data: DateModel,
    form: FormControlInterface,
    DataInterface: calendarType
  ): any;
}
