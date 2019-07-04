import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

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
  submittingForm: boolean = false;
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
      this.categoryService.addCategory(c);
    else
      this.categoryService.updateCategory(c);
    
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
        switchMap(params => this.categoryService.getByIdCategory(params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category.data();
          this.categoryForm.setValue(this.category);
          console.log(this.category);
          
        },
        (err) => {
          alert('Erro no Servidor')
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

}
