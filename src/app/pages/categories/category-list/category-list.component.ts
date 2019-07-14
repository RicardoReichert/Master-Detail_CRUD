import { Component } from '@angular/core';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import * as faker from 'faker';

import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})

export class CategoryListComponent extends BaseResourceListComponent<Category> {

  constructor(private categoryService: CategoryService) {
    super(categoryService);
  }

  addOne(){
    const c: Category = {
      name: faker.finance.accountName(),
      description: faker.finance.transactionType()
    };
    this.categoryService.add(c);
  }

  generate(){
      this.addOne();
  }

}