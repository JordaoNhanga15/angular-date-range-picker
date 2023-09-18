import { DateModel, TypeContract } from '../../shared/models/date.model';
import { DataInterface } from '../interfaces/DataInterface';
import { FormControlInterface } from '../interfaces/FormControlInterface';
import * as contractsByType from './contracts';
import { ContractInterface } from '../interfaces/ContractInterface';

const contracts = {
  [TypeContract.day]: contractsByType.day,
  [TypeContract.month]: contractsByType.month,
  [TypeContract.year]: contractsByType.year,
};

export class DateContract {
  private contract: DataInterface;
  constructor(contractType: DataInterface) {
    this.contract = contractType;
  }

  public async compile(data: DateModel, form: FormControlInterface) {
    const contract = contracts[this.contract.type] as ContractInterface;

    if (!contract)
      throw new Error(`Contract ${this.contract.type} not founded`);

    contract.default(data, form, this.contract);
  }
}
