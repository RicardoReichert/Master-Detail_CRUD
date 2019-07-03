import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import * as faker from 'faker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  category$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.category$ = this.categoryService.getALLCategory();
  }

  addOne(){
    const c: Category = {
      name: faker.finance.accountName(),
      description: faker.finance.transactionType()
    };
    this.categoryService.addCategory(c);
  }

  generate(){
    for(let i=0; i<5; i++){
      this.addOne();
    }
  }

  delete(c: Category){
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.categoryService.deleteCategory(c)
      .then(
        ()=>{
          console.log("Product removed.");
        }
      )
      .catch(
        ()=>{
          console.error("Error on remove the product.");
        }
      )
    }
    
  }

}


/*
  categories: Category[];

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.categoryService.getALLCategory()
    .pipe(
      tap(p=>console.log("component" + p)),
      map(cat => this.categories = cat),
      catchError((e) => {
        console.log(e);
        return throwError(e);
      })
    )
    console.log(this.categories);
    
  }
*/