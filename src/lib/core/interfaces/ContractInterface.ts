import { DateModel } from '../../shared/models/date.model';
import { FormControlInterface } from './FormControlInterface';
import { DataInterface } from './DataInterface';

export interface ContractInterface {
  default(
    data: DateModel,
    form: FormControlInterface,
    DataInterface: DataInterface
  ): any;
}
