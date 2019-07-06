import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  
  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }  

  onSubmit(){
    let c:Category = this.categoryForm.value;
    
    if(!c.id)
      this.categoryService.add(c);
    else{
      this.categoryService.update(c);
      this.router.navigateByUrl("/categories/new");
    }
    
    this.categoryForm.reset();
  }

  // PRIVATE METHODS

  setPageTitle() {
    if(this.currentAction == "new")
      this.pageTitle = "Cadastro de Nova Categoria";
    else{
      const categoryName = this.category.name || "";
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    }else{
      this.currentAction = "edit";
    }
  }

  private loadCategory() {
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category.data();
          this.categoryForm.setValue(this.category);          
        },
        (err) => {
          this.handleError(err);
        }
      )
    }
  }
  
  private buildCategoryForm() {
    this.categoryForm = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      id: [undefined]
    })
  }

  

    // PRIVATE METHODS

    private handleError(error: any[]): Observable<any>{    
      console.log("ERRO NA REQUISIÇÂO => ",  error);
      return throwError(error);    
    }

}
