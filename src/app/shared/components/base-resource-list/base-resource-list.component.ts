import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../models/base-resource.service';
import { Observable } from 'rxjs';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources$: Observable<T[]>;

  constructor(private resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resources$ = this.resourceService.getAll();
  }

  deleteResource(resource: T): boolean {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    
    if (mustDelete){
      this.resourceService.delete(resource)
      .then(
          () => console.log("Removed.")
      )
      .catch(
          ()=> console.error("Error on remove.")
      )
      return true;
    }
    return false;
  }

}