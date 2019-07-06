import { Category } from '../../categories/shared/category.model';
import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

export class Entry extends BaseResourceModel{

    constructor(
      public id?: string,
      public name?: string,
      public description?: string,
      public type?: string,
      public amount?: string,
      public date?: string,
      public paid?: boolean,
      public categoriId?: string,
      public category?: Category
    ){
      super();
    }
    
    static types = {
      expense: 'Despesa',
      revenue: 'Receita'
    };

    static fromData(data: any): Entry{
      return Object.assign(new Entry(), data)
    }

    get paidText() {
      return this.paid ? 'Pago' : 'Pendente';
    }

}