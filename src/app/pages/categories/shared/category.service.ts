import { Injectable, Injector } from '@angular/core';


import { Category } from './category.model';
import { BaseResourceService } from 'src/app/shared/models/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category>{

  constructor( protected injector: Injector ) {
    super('Categories', injector);
  }

}