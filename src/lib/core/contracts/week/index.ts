import { DataInterface } from '../../interfaces/DataInterface';

export class Contract {
  public static default(data: any, form: any, DataInterface: DataInterface) {
    console.log('week Contract');
    return { data, form };
  }
}
