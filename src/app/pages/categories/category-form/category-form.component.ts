import { Component, Injector} from '@angular/core';
import { Validators } from '@angular/forms';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})

export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor( protected categoryService: CategoryService, protected intector: Injector ) { 
    super(intector, new Category, categoryService);
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      id: [undefined]
    })
  }

  protected onSubmit(): void {
    let c:Category = this.resourceForm.value;
    
    if(!c.id)
      this.resourceService.add(c);
    else{
      this.resourceService.update(c);
      const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

      // redirect/reload component page
      this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
        () => this.router.navigate([baseComponentPath, c.id, "edit"])
      )
    }
    
    this.resourceForm.reset();
  }

  protected createPagetitle(): string{
    return "Cadastro de Nova Categoria";
  }

  protected editionPagetitle(): string{
    const categoryName = this.resource.name || "";
    return "Editando Categoria: "+ categoryName;
  }

}
