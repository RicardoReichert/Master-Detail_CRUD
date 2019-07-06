import { Category } from '../../categories/shared/category.model';

export class Entry {

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
    ){}
    
    static types = {
      expense: 'Despesa',
      revenue: 'Receita'
    };

    get paidText() {
      return this.paid ? 'Pago' : 'Pendente';
    }

}